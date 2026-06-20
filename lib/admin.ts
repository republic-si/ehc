import { sql } from "@/db/client";

// ---------- types ----------

export type OutletStatus =
  | "active"
  | "bounced"
  | "unsubscribed"
  | "dead"
  | "paused";

export interface OutletStatusCount {
  status: OutletStatus | "other";
  count: number;
}

export interface OutletRow {
  outletId: string;
  outletName: string;
  url: string | null;
  country: string | null;
  language: string | null;
  scope: string | null;
  emailPrimary: string | null;
  editorName: string | null;
  status: OutletStatus;
  unsubscribedAt: string | null;
  lastSentAt: string | null;
  lastDsnAt: string | null;
  dsnCount: number;
}

export interface DsnLogRow {
  id: number;
  receivedAt: string;
  recipientEmail: string;
  statusCode: string | null;
  classification: "permanent" | "transient" | "unknown";
  outletId: string | null;
  diagnosticText: string | null;
}

export interface UnsubscribeLogRow {
  id: number;
  receivedAt: string;
  fromEmail: string;
  fromName: string | null;
  matchedPhrase: string;
  outletId: string | null;
}

export interface RecentSendRow {
  outletId: string;
  outletName: string | null;
  makerSlug: string;
  batch: string | null;
  sentAt: string;
  subject: string | null;
  transport: string | null;
  bounced: boolean;
  replyKind: string | null;
}

export interface SignoffSendRow {
  producerSlug: string;
  brand: string;
  email: string | null;
  sentAt: string;
  ackStatus: string;
  dueAt: string | null;
  subject: string | null;
}

export interface AdminSummary {
  outlets: OutletStatusCount[];
  bounces7d: number;
  unsubs30d: number;
  sends24h: number;
  signoffsPending: number;
}

// ---------- queries ----------

export async function getOutletStatusCounts(): Promise<OutletStatusCount[]> {
  const rows = (await sql`
    SELECT status, count(*)::int AS count
      FROM press_outlets
     GROUP BY status
     ORDER BY status
  `) as { status: string; count: number }[];
  return rows.map((r) => ({
    status: (r.status as OutletStatus | "other") ?? "other",
    count: r.count,
  }));
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const outlets = await getOutletStatusCounts();
  const [bounces] = (await sql`
    SELECT count(*)::int AS n FROM dsn_log
     WHERE received_at >= now() - interval '7 days'
  `) as { n: number }[];
  const [unsubs] = (await sql`
    SELECT count(*)::int AS n FROM unsubscribe_log
     WHERE received_at >= now() - interval '30 days'
  `) as { n: number }[];
  const [sends] = (await sql`
    SELECT count(*)::int AS n FROM outlet_sends
     WHERE sent_at >= now() - interval '24 hours'
  `) as { n: number }[];
  const [signoffs] = (await sql`
    SELECT count(*)::int AS n FROM signoff_sends
     WHERE ack_status IN ('sent', 'needs_followup', 'ack_with_edits')
  `) as { n: number }[];
  return {
    outlets,
    bounces7d: bounces?.n ?? 0,
    unsubs30d: unsubs?.n ?? 0,
    sends24h: sends?.n ?? 0,
    signoffsPending: signoffs?.n ?? 0,
  };
}

export async function getOutletsByStatus(
  status: OutletStatus,
  limit = 200,
): Promise<OutletRow[]> {
  const rows = (await sql`
    SELECT outlet_id, outlet_name, url, country, language, scope,
           email_primary, editor_name, status,
           unsubscribed_at::text AS unsubscribed_at,
           last_sent_at::text AS last_sent_at,
           last_dsn_at::text AS last_dsn_at,
           dsn_count
      FROM press_outlets
     WHERE status = ${status}
     ORDER BY COALESCE(last_dsn_at, updated_at) DESC NULLS LAST
     LIMIT ${limit}
  `) as Record<string, unknown>[];
  return rows.map(rowToOutlet);
}

export async function getRecentDsns(days = 14, limit = 200): Promise<DsnLogRow[]> {
  const rows = (await sql`
    SELECT id, received_at::text AS received_at, recipient_email,
           status_code, classification, outlet_id, diagnostic_text
      FROM dsn_log
     WHERE received_at >= now() - (${days}::text || ' days')::interval
     ORDER BY received_at DESC
     LIMIT ${limit}
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as number,
    receivedAt: (r.received_at as string) ?? "",
    recipientEmail: (r.recipient_email as string) ?? "",
    statusCode: (r.status_code as string) ?? null,
    classification: (r.classification as DsnLogRow["classification"]) ?? "unknown",
    outletId: (r.outlet_id as string) ?? null,
    diagnosticText: (r.diagnostic_text as string) ?? null,
  }));
}

export async function getRecentUnsubscribes(
  days = 90,
  limit = 100,
): Promise<UnsubscribeLogRow[]> {
  const rows = (await sql`
    SELECT id, received_at::text AS received_at, from_email, from_name,
           matched_phrase, outlet_id
      FROM unsubscribe_log
     WHERE received_at >= now() - (${days}::text || ' days')::interval
     ORDER BY received_at DESC
     LIMIT ${limit}
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as number,
    receivedAt: (r.received_at as string) ?? "",
    fromEmail: (r.from_email as string) ?? "",
    fromName: (r.from_name as string) ?? null,
    matchedPhrase: (r.matched_phrase as string) ?? "",
    outletId: (r.outlet_id as string) ?? null,
  }));
}

export async function getRecentSends(
  hours = 72,
  limit = 200,
): Promise<RecentSendRow[]> {
  const rows = (await sql`
    SELECT os.outlet_id, po.outlet_name, os.maker_slug, os.batch,
           os.sent_at::text AS sent_at, os.subject, os.transport,
           COALESCE(os.bounced, false) AS bounced, os.reply_kind
      FROM outlet_sends os
      LEFT JOIN press_outlets po ON po.outlet_id = os.outlet_id
     WHERE os.sent_at >= now() - (${hours}::text || ' hours')::interval
     ORDER BY os.sent_at DESC
     LIMIT ${limit}
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    outletId: (r.outlet_id as string) ?? "",
    outletName: (r.outlet_name as string) ?? null,
    makerSlug: (r.maker_slug as string) ?? "",
    batch: (r.batch as string) ?? null,
    sentAt: (r.sent_at as string) ?? "",
    subject: (r.subject as string) ?? null,
    transport: (r.transport as string) ?? null,
    bounced: Boolean(r.bounced),
    replyKind: (r.reply_kind as string) ?? null,
  }));
}

export async function getPendingSignoffs(): Promise<SignoffSendRow[]> {
  const rows = (await sql`
    SELECT DISTINCT ON (s.producer_slug)
           s.producer_slug, p.brand, p.email,
           s.sent_at::text AS sent_at, s.ack_status,
           s.due_at::text AS due_at, s.subject
      FROM signoff_sends s
      JOIN producers p ON p.slug = s.producer_slug
     WHERE s.ack_status IN ('sent', 'needs_followup', 'ack_with_edits')
     ORDER BY s.producer_slug, s.sent_at DESC
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    producerSlug: (r.producer_slug as string) ?? "",
    brand: (r.brand as string) ?? "",
    email: (r.email as string) ?? null,
    sentAt: (r.sent_at as string) ?? "",
    ackStatus: (r.ack_status as string) ?? "",
    dueAt: (r.due_at as string) ?? null,
    subject: (r.subject as string) ?? null,
  }));
}

function rowToOutlet(r: Record<string, unknown>): OutletRow {
  return {
    outletId: (r.outlet_id as string) ?? "",
    outletName: (r.outlet_name as string) ?? "",
    url: (r.url as string) ?? null,
    country: (r.country as string) ?? null,
    language: (r.language as string) ?? null,
    scope: (r.scope as string) ?? null,
    emailPrimary: (r.email_primary as string) ?? null,
    editorName: (r.editor_name as string) ?? null,
    status: (r.status as OutletStatus) ?? "active",
    unsubscribedAt: (r.unsubscribed_at as string) ?? null,
    lastSentAt: (r.last_sent_at as string) ?? null,
    lastDsnAt: (r.last_dsn_at as string) ?? null,
    dsnCount: (r.dsn_count as number) ?? 0,
  };
}
