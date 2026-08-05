import { createHash } from "node:crypto";
import { sql } from "../db/client.ts";

const MAX_BYTES = 2_000_000;

async function main() {
  const rows = (await sql`
    SELECT r.id::text, r.dhl_label_url
      FROM sample_requests r
      LEFT JOIN dhl_label_documents d ON d.sample_request_id = r.id
     WHERE r.dhl_tracking_number IS NOT NULL
       AND r.dhl_label_url IS NOT NULL
       AND r.dhl_label_url <> ''
       AND d.sample_request_id IS NULL
     ORDER BY r.id
  `) as Array<{ id: string; dhl_label_url: string }>;

  let imported = 0;
  for (const row of rows) {
    try {
      const response = await fetch(row.dhl_label_url, { redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const pdf = new Uint8Array(await response.arrayBuffer());
      if (pdf.byteLength < 5 || Buffer.from(pdf.subarray(0, 5)).toString("ascii") !== "%PDF-") {
        throw new Error("not a PDF");
      }
      if (pdf.byteLength > MAX_BYTES) throw new Error(`larger than ${MAX_BYTES} bytes`);
      const base64 = Buffer.from(pdf).toString("base64");
      const sha256 = createHash("sha256").update(pdf).digest("hex");
      await sql`
        WITH stored AS (
          INSERT INTO dhl_label_documents (sample_request_id, pdf, sha256, byte_size)
          VALUES (${row.id}::bigint, decode(${base64}, 'base64'), ${sha256}, ${pdf.byteLength})
          ON CONFLICT (sample_request_id) DO NOTHING
          RETURNING sample_request_id
        )
        UPDATE sample_requests r
           SET dhl_label_state = 'ready', dhl_label_error = NULL
          FROM stored s
         WHERE r.id = s.sample_request_id
      `;
      imported += 1;
      console.log(`request ${row.id}: stored ${pdf.byteLength} bytes`);
    } catch (error) {
      console.error(
        `request ${row.id}: FAILED (${error instanceof Error ? error.message : "unknown error"})`,
      );
    }
  }
  console.log(`Imported ${imported}/${rows.length} existing DHL labels.`);
  if (imported !== rows.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
