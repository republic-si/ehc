import { sql } from "@/db/client";
import { pushScope, type Scope } from "@/lib/scope";

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

// Contact-type roles held in press_outlets.category. "all" is a UI-only facet.
export type OutletCategory = "media" | "influencer" | "buyer" | "industry";

export interface OutletCategoryCount {
  category: OutletCategory | "uncategorized";
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
  category: OutletCategory | null;
  kind: string | null;
  format: string | null;
  platform: string | null;
  tier: number | null;
  tags: string[];
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
  campaignSlug: string | null;
}

export interface AdminSummary {
  outlets: OutletStatusCount[];
  bounces7d: number;
  unsubs30d: number;
  sends24h: number;
  signoffsPending: number;
}

// ---------- queries ----------

export async function getOutletStatusCounts(
  scope: Scope,
): Promise<OutletStatusCount[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  pushScope(scope, where, params, "outlet");
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = (await sql.query(
    `SELECT status, count(*)::int AS count
       FROM press_outlets
      ${whereSql}
      GROUP BY status
      ORDER BY status`,
    params,
  )) as { status: string; count: number }[];
  return rows.map((r) => ({
    status: (r.status as OutletStatus | "other") ?? "other",
    count: r.count,
  }));
}

export async function getOutletTypeCounts(
  scope: Scope,
): Promise<OutletCategoryCount[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  pushScope(scope, where, params, "outlet");
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = (await sql.query(
    `SELECT COALESCE(category, 'uncategorized') AS category, count(*)::int AS count
       FROM press_outlets
      ${whereSql}
      GROUP BY COALESCE(category, 'uncategorized')
      ORDER BY count DESC`,
    params,
  )) as { category: string; count: number }[];
  return rows.map((r) => ({
    category: r.category as OutletCategoryCount["category"],
    count: r.count,
  }));
}

export async function getAdminSummary(scope: Scope): Promise<AdminSummary> {
  const outlets = await getOutletStatusCounts(scope);

  // sends24h is scoped by campaign_slug.
  const sWhere = ["sent_at >= now() - interval '24 hours'"];
  const sParams: unknown[] = [];
  pushScope(scope, sWhere, sParams, "send");
  const [sends] = (await sql.query(
    `SELECT count(*)::int AS n FROM outlet_sends WHERE ${sWhere.join(" AND ")}`,
    sParams,
  )) as { n: number }[];

  // bounces / unsubs / signoffs are still global here; scoped in later steps
  // (bounces have no campaign column — see step 8).
  const [bounces] = (await sql`
    SELECT count(*)::int AS n FROM dsn_log
     WHERE received_at >= now() - interval '7 days'
  `) as { n: number }[];
  const [unsubs] = (await sql`
    SELECT count(*)::int AS n FROM unsubscribe_log
     WHERE received_at >= now() - interval '30 days'
  `) as { n: number }[];
  const sgWhere = ["ack_status IN ('sent', 'needs_followup', 'ack_with_edits')"];
  const sgParams: unknown[] = [];
  pushScope(scope, sgWhere, sgParams, "send");
  const [signoffs] = (await sql.query(
    `SELECT count(*)::int AS n FROM signoff_sends WHERE ${sgWhere.join(" AND ")}`,
    sgParams,
  )) as { n: number }[];
  return {
    outlets,
    bounces7d: bounces?.n ?? 0,
    unsubs30d: unsubs?.n ?? 0,
    sends24h: sends?.n ?? 0,
    signoffsPending: signoffs?.n ?? 0,
  };
}

export async function getOutletsByStatus(
  scope: Scope,
  status: OutletStatus,
  limit = 200,
  category?: OutletCategory,
): Promise<OutletRow[]> {
  const where = ["status = $1"];
  const params: unknown[] = [status];
  if (category) {
    where.push(`category = $${params.length + 1}`);
    params.push(category);
  }
  pushScope(scope, where, params, "outlet");
  const limitIdx = params.length + 1;
  params.push(limit);
  const rows = (await sql.query(
    `SELECT outlet_id, outlet_name, url, country, language, scope,
            email_primary, editor_name, status,
            category, kind, format, platform, tier, tags,
            unsubscribed_at::text AS unsubscribed_at,
            last_sent_at::text AS last_sent_at,
            last_dsn_at::text AS last_dsn_at,
            dsn_count
       FROM press_outlets
      WHERE ${where.join(" AND ")}
      ORDER BY COALESCE(last_dsn_at, updated_at) DESC NULLS LAST
      LIMIT $${limitIdx}`,
    params,
  )) as Record<string, unknown>[];
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
  scope: Scope,
  hours = 72,
  limit = 200,
): Promise<RecentSendRow[]> {
  const params: unknown[] = [hours];
  const where = [`os.sent_at >= now() - ($1::text || ' hours')::interval`];
  pushScope(scope, where, params, "send", "os.campaign_slug");
  const limitIdx = params.length + 1;
  params.push(limit);
  const rows = (await sql.query(
    `SELECT os.outlet_id, po.outlet_name, os.maker_slug, os.batch,
            os.sent_at::text AS sent_at, os.subject, os.transport,
            COALESCE(os.bounced, false) AS bounced, os.reply_kind
       FROM outlet_sends os
       LEFT JOIN press_outlets po ON po.outlet_id = os.outlet_id
      WHERE ${where.join(" AND ")}
      ORDER BY os.sent_at DESC
      LIMIT $${limitIdx}`,
    params,
  )) as Record<string, unknown>[];
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

// ---------- sends rollup (campaign -> batch/wave -> rows) ----------

export interface SendCampaignRollupRow {
  campaignSlug: string;
  campaignName: string | null;
  sends: number;
  batches: number;
  makers: number;
  firstAt: string | null;
  lastAt: string | null;
  bounced: number;
}

export interface SendBatchRollupRow {
  batch: string;
  sends: number;
  makers: number;
  firstAt: string | null;
  lastAt: string | null;
  bounced: number;
}

// One row per campaign in scope: totals + date span. Latest wave first.
export async function getSendCampaignRollup(
  scope: Scope,
): Promise<SendCampaignRollupRow[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "os.campaign_slug");
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = (await sql.query(
    `SELECT os.campaign_slug AS campaign_slug, c.name AS campaign_name,
            count(*)::int AS sends,
            count(DISTINCT os.batch)::int AS batches,
            count(DISTINCT os.maker_slug)::int AS makers,
            min(os.sent_at)::text AS first_at,
            max(os.sent_at)::text AS last_at,
            sum(CASE WHEN os.bounced THEN 1 ELSE 0 END)::int AS bounced
       FROM outlet_sends os
       LEFT JOIN campaigns c ON c.slug = os.campaign_slug
      ${whereSql}
      GROUP BY os.campaign_slug, c.name
      ORDER BY max(os.sent_at) DESC NULLS LAST`,
    params,
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    campaignSlug: (r.campaign_slug as string) ?? "",
    campaignName: (r.campaign_name as string) ?? null,
    sends: (r.sends as number) ?? 0,
    batches: (r.batches as number) ?? 0,
    makers: (r.makers as number) ?? 0,
    firstAt: (r.first_at as string) ?? null,
    lastAt: (r.last_at as string) ?? null,
    bounced: (r.bounced as number) ?? 0,
  }));
}

// The waves inside one campaign. Caller must have gated the campaign to scope.
export async function getSendBatchRollup(
  campaignSlug: string,
): Promise<SendBatchRollupRow[]> {
  const rows = (await sql`
    SELECT COALESCE(batch, '(no batch)') AS batch,
           count(*)::int AS sends,
           count(DISTINCT maker_slug)::int AS makers,
           min(sent_at)::text AS first_at,
           max(sent_at)::text AS last_at,
           sum(CASE WHEN bounced THEN 1 ELSE 0 END)::int AS bounced
      FROM outlet_sends
     WHERE campaign_slug = ${campaignSlug}
     GROUP BY COALESCE(batch, '(no batch)')
     ORDER BY max(sent_at) DESC NULLS LAST
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    batch: (r.batch as string) ?? "(no batch)",
    sends: (r.sends as number) ?? 0,
    makers: (r.makers as number) ?? 0,
    firstAt: (r.first_at as string) ?? null,
    lastAt: (r.last_at as string) ?? null,
    bounced: (r.bounced as number) ?? 0,
  }));
}

// All sends for one campaign (all-time). Caller must have gated to scope.
export async function getSendsForCampaign(
  campaignSlug: string,
  limit = 2000,
): Promise<RecentSendRow[]> {
  const rows = (await sql`
    SELECT os.outlet_id, po.outlet_name, os.maker_slug, os.batch,
           os.sent_at::text AS sent_at, os.subject, os.transport,
           COALESCE(os.bounced, false) AS bounced, os.reply_kind
      FROM outlet_sends os
      LEFT JOIN press_outlets po ON po.outlet_id = os.outlet_id
     WHERE os.campaign_slug = ${campaignSlug}
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

export async function getPendingSignoffs(
  scope: Scope,
): Promise<SignoffSendRow[]> {
  const where = ["s.ack_status IN ('sent', 'needs_followup', 'ack_with_edits')"];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "s.campaign_slug");
  const rows = (await sql.query(
    `SELECT DISTINCT ON (s.producer_slug)
            s.producer_slug, p.brand, p.email,
            s.sent_at::text AS sent_at, s.ack_status,
            s.due_at::text AS due_at, s.subject, s.campaign_slug
       FROM signoff_sends s
       JOIN producers p ON p.slug = s.producer_slug
      WHERE ${where.join(" AND ")}
      ORDER BY s.producer_slug, s.sent_at DESC`,
    params,
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    producerSlug: (r.producer_slug as string) ?? "",
    brand: (r.brand as string) ?? "",
    email: (r.email as string) ?? null,
    sentAt: (r.sent_at as string) ?? "",
    ackStatus: (r.ack_status as string) ?? "",
    dueAt: (r.due_at as string) ?? null,
    subject: (r.subject as string) ?? null,
    campaignSlug: (r.campaign_slug as string) ?? null,
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
    category: (r.category as OutletCategory) ?? null,
    kind: (r.kind as string) ?? null,
    format: (r.format as string) ?? null,
    platform: (r.platform as string) ?? null,
    tier: (r.tier as number) ?? null,
    tags: (r.tags as string[]) ?? [],
    unsubscribedAt: (r.unsubscribed_at as string) ?? null,
    lastSentAt: (r.last_sent_at as string) ?? null,
    lastDsnAt: (r.last_dsn_at as string) ?? null,
    dsnCount: (r.dsn_count as number) ?? 0,
  };
}
