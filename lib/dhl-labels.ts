import { createHash, randomUUID } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { sql } from "@/db/client";

export type DhlLabelState =
  | "idle"
  | "generating"
  | "ready"
  | "rejected"
  | "uncertain";

export interface LabelBatchSummary {
  id: string;
  state: "building" | "ready" | "failed";
  createdAt: string;
  readyAt: string | null;
  failureReason: string | null;
  labelCount: number;
}

const MAX_BATCH_LABELS = Number(process.env.DHL_BATCH_MAX_LABELS ?? 25);
const MAX_BATCH_PDF_BYTES = Number(process.env.DHL_BATCH_MAX_BYTES ?? 4_000_000);

export async function claimIndividualLabel(
  requestId: string,
  attemptRef: string,
): Promise<boolean> {
  const rows = (await sql`
    UPDATE sample_requests
       SET dhl_label_state = 'generating',
           dhl_label_attempt_ref = ${attemptRef},
           dhl_label_started_at = now(),
           dhl_label_error = NULL
     WHERE id = ${requestId}::bigint
       AND status = 'approved'
       AND wants_samples = TRUE
       AND audience = 'press'
       AND dhl_tracking_number IS NULL
       AND dhl_label_state IN ('idle','rejected')
       AND NOT EXISTS (
         SELECT 1 FROM dhl_label_documents d WHERE d.sample_request_id = sample_requests.id
       )
    RETURNING id
  `) as Array<{ id: string }>;
  return rows.length === 1;
}

export async function completeIndividualLabel(
  requestId: string,
  attemptRef: string,
  trackingNumber: string,
  pdf: Uint8Array,
): Promise<boolean> {
  const base64 = Buffer.from(pdf).toString("base64");
  const sha256 = createHash("sha256").update(pdf).digest("hex");
  const rows = (await sql`
    WITH eligible AS (
      SELECT id
        FROM sample_requests
       WHERE id = ${requestId}::bigint
         AND dhl_label_state = 'generating'
         AND dhl_label_attempt_ref = ${attemptRef}
         AND dhl_tracking_number IS NULL
    ), inserted AS (
      INSERT INTO dhl_label_documents
        (sample_request_id, pdf, sha256, byte_size)
      SELECT id, decode(${base64}, 'base64'), ${sha256}, ${pdf.byteLength}
        FROM eligible
      ON CONFLICT (sample_request_id) DO NOTHING
      RETURNING sample_request_id
    )
    UPDATE sample_requests r
       SET dhl_tracking_number = ${trackingNumber},
           dhl_label_url = NULL,
           dhl_label_state = 'ready',
           dhl_label_error = NULL,
           status = 'shipped',
           reviewed_at = now()
      FROM inserted i
     WHERE r.id = i.sample_request_id
    RETURNING r.id
  `) as Array<{ id: string }>;
  return rows.length === 1;
}

export async function failIndividualLabel(
  requestId: string,
  attemptRef: string,
  state: "rejected" | "uncertain",
  error: string,
  trackingNumber?: string,
): Promise<void> {
  await sql`
    UPDATE sample_requests
       SET dhl_label_state = ${state},
           dhl_label_error = ${error},
           dhl_tracking_number = COALESCE(${trackingNumber ?? null}, dhl_tracking_number)
     WHERE id = ${requestId}::bigint
       AND dhl_label_state = 'generating'
       AND dhl_label_attempt_ref = ${attemptRef}
  `;
}

export async function getStoredLabelPdf(requestId: string): Promise<Uint8Array | null> {
  const rows = (await sql`
    SELECT encode(pdf, 'base64') AS pdf_base64
      FROM dhl_label_documents
     WHERE sample_request_id = ${requestId}::bigint
  `) as Array<{ pdf_base64: string }>;
  return rows[0] ? Uint8Array.from(Buffer.from(rows[0].pdf_base64, "base64")) : null;
}

export async function getNewLabelCount(): Promise<number> {
  const rows = (await sql`
    SELECT count(*)::int AS n
      FROM dhl_label_documents d
      JOIN sample_requests r ON r.id = d.sample_request_id
      LEFT JOIN dhl_label_batch_items i ON i.sample_request_id = d.sample_request_id
     WHERE r.dhl_label_state = 'ready'
       AND i.sample_request_id IS NULL
  `) as Array<{ n: number }>;
  return rows[0]?.n ?? 0;
}

export async function getLabelBatchHistory(limit = 10): Promise<LabelBatchSummary[]> {
  const rows = (await sql`
    SELECT b.id::text, b.state, b.created_at::text, b.ready_at::text,
           b.failure_reason, count(i.sample_request_id)::int AS label_count
      FROM dhl_label_batches b
      LEFT JOIN dhl_label_batch_items i ON i.batch_id = b.id
     GROUP BY b.id
     ORDER BY b.created_at DESC
     LIMIT ${limit}
  `) as Array<{
    id: string;
    state: LabelBatchSummary["state"];
    created_at: string;
    ready_at: string | null;
    failure_reason: string | null;
    label_count: number;
  }>;
  return rows.map((r) => ({
    id: r.id,
    state: r.state,
    createdAt: r.created_at,
    readyAt: r.ready_at,
    failureReason: r.failure_reason,
    labelCount: r.label_count,
  }));
}

async function reserveOrResumeBatch(userId: number): Promise<string | null> {
  const batchId = randomUUID();
  try {
    const rows = (await sql`
      WITH existing AS (
        SELECT id FROM dhl_label_batches
         WHERE state = 'building'
         ORDER BY created_at
         LIMIT 1
      ), created AS (
        INSERT INTO dhl_label_batches (id, state, created_by)
        SELECT ${batchId}::uuid, 'building', ${userId}::bigint
         WHERE NOT EXISTS (SELECT 1 FROM existing)
           AND EXISTS (
             SELECT 1
               FROM dhl_label_documents d
               JOIN sample_requests r ON r.id = d.sample_request_id
               LEFT JOIN dhl_label_batch_items i ON i.sample_request_id = d.sample_request_id
              WHERE r.dhl_label_state = 'ready' AND i.sample_request_id IS NULL
           )
        RETURNING id
      ), chosen AS (
        SELECT id FROM existing UNION ALL SELECT id FROM created
      ), candidates AS (
        SELECT d.sample_request_id,
               row_number() OVER (ORDER BY d.created_at, d.sample_request_id)::int AS position
          FROM dhl_label_documents d
          JOIN sample_requests r ON r.id = d.sample_request_id
          LEFT JOIN dhl_label_batch_items i ON i.sample_request_id = d.sample_request_id
         WHERE r.dhl_label_state = 'ready'
           AND i.sample_request_id IS NULL
           AND EXISTS (SELECT 1 FROM created)
         ORDER BY d.created_at, d.sample_request_id
         LIMIT ${MAX_BATCH_LABELS}
      ), reserved AS (
        INSERT INTO dhl_label_batch_items (batch_id, sample_request_id, position)
        SELECT c.id, x.sample_request_id, x.position
          FROM chosen c CROSS JOIN candidates x
        RETURNING batch_id
      )
      SELECT id::text FROM chosen LIMIT 1
    `) as Array<{ id: string }>;
    return rows[0]?.id ?? null;
  } catch {
    const rows = (await sql`
      SELECT id::text FROM dhl_label_batches
       WHERE state = 'building' ORDER BY created_at LIMIT 1
    `) as Array<{ id: string }>;
    return rows[0]?.id ?? null;
  }
}

async function loadBatchPdfs(batchId: string): Promise<Uint8Array[]> {
  const rows = (await sql`
    SELECT encode(d.pdf, 'base64') AS pdf_base64
      FROM dhl_label_batch_items i
      JOIN dhl_label_documents d ON d.sample_request_id = i.sample_request_id
     WHERE i.batch_id = ${batchId}::uuid
     ORDER BY i.position
  `) as Array<{ pdf_base64: string }>;
  return rows.map((r) => Uint8Array.from(Buffer.from(r.pdf_base64, "base64")));
}

export async function buildNewLabelBatch(userId: number): Promise<string | null> {
  const batchId = await reserveOrResumeBatch(userId);
  if (!batchId) return null;

  const ready = (await sql`
    SELECT 1 FROM dhl_label_batches b
    JOIN dhl_label_batch_artifacts a ON a.batch_id = b.id
    WHERE b.id = ${batchId}::uuid AND b.state = 'ready'
  `).length > 0;
  if (ready) return batchId;

  try {
    const sources = await loadBatchPdfs(batchId);
    if (sources.length === 0) throw new Error("Batch contains no labels");

    const merged = await PDFDocument.create();
    for (const bytes of sources) {
      const source = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(source, source.getPageIndices());
      for (const page of pages) merged.addPage(page);
    }
    const pdf = await merged.save({ useObjectStreams: false });
    if (pdf.byteLength > MAX_BATCH_PDF_BYTES) {
      throw new Error(`Combined PDF exceeds ${MAX_BATCH_PDF_BYTES} bytes`);
    }
    const base64 = Buffer.from(pdf).toString("base64");
    const sha256 = createHash("sha256").update(pdf).digest("hex");
    await sql`
      WITH artifact AS (
        INSERT INTO dhl_label_batch_artifacts (batch_id, pdf, sha256, byte_size)
        VALUES (${batchId}::uuid, decode(${base64}, 'base64'), ${sha256}, ${pdf.byteLength})
        ON CONFLICT (batch_id) DO NOTHING
        RETURNING batch_id
      )
      UPDATE dhl_label_batches
         SET state = 'ready', ready_at = now(), failure_reason = NULL
       WHERE id = ${batchId}::uuid
         AND state = 'building'
         AND EXISTS (
           SELECT 1 FROM dhl_label_batch_artifacts a WHERE a.batch_id = ${batchId}::uuid
         )
    `;
    return batchId;
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF merge failed";
    await sql`
      WITH failed AS (
        UPDATE dhl_label_batches
           SET state = 'failed', failed_at = now(), failure_reason = ${message}
         WHERE id = ${batchId}::uuid AND state = 'building'
           AND NOT EXISTS (
             SELECT 1 FROM dhl_label_batch_artifacts a WHERE a.batch_id = ${batchId}::uuid
           )
        RETURNING id
      )
      DELETE FROM dhl_label_batch_items i
       USING failed f
       WHERE i.batch_id = f.id
    `;
    throw error;
  }
}

export async function getStoredBatchPdf(batchId: string): Promise<Uint8Array | null> {
  const rows = (await sql`
    SELECT encode(a.pdf, 'base64') AS pdf_base64
      FROM dhl_label_batches b
      JOIN dhl_label_batch_artifacts a ON a.batch_id = b.id
     WHERE b.id = ${batchId}::uuid AND b.state = 'ready'
  `) as Array<{ pdf_base64: string }>;
  return rows[0] ? Uint8Array.from(Buffer.from(rows[0].pdf_base64, "base64")) : null;
}
