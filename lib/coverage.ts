import { sql } from "@/db/client";
import { pushScope, type Scope } from "@/lib/scope";
import { computePressValueEur } from "@/lib/coverage-value";

export interface Pickup {
  date: string;
  isoDate: string | null;
  outletName: string;
  outletUrl: string;
  articleUrl: string;
  makerSlug: string;
  language: string;
  country: string;
  scope: string;
  estReach: number | null;
  monthlyVisits: number | null;
}

interface PickupRow {
  article_url: string;
  date_spotted: string | null;
  outlet_name: string;
  outlet_url: string;
  maker_slug: string;
  language: string;
  country: string;
  scope: string;
  est_reach: number | null;
  monthly_visits_est: number | null;
}

function toPickup(row: PickupRow): Pickup {
  const iso = row.date_spotted ? row.date_spotted.slice(0, 10) : null;
  return {
    date: iso ?? "",
    isoDate: iso,
    outletName: row.outlet_name,
    outletUrl: row.outlet_url,
    articleUrl: row.article_url,
    makerSlug: row.maker_slug,
    language: row.language,
    country: row.country,
    scope: row.scope,
    estReach: row.est_reach,
    monthlyVisits: row.monthly_visits_est,
  };
}

// Not project-scoped: this powers the PUBLIC /coverage page (no session/scope),
// and there is no admin pickups view. Per-campaign coverage lives in the
// committed HTML reports at /admin/coverage/[campaign]. Revisit if an admin
// pickups surface is added.
export async function getPickups(): Promise<Pickup[]> {
  const rows = (await sql`
    SELECT article_url, date_spotted::text AS date_spotted,
           outlet_name, outlet_url, maker_slug, language, country, scope,
           est_reach, monthly_visits_est
    FROM pickups
    WHERE is_false_positive = false
    ORDER BY date_spotted DESC NULLS LAST, outlet_name ASC
  `) as PickupRow[];
  return rows.map(toPickup);
}

export function getPickupStats(pickups: Pickup[]): {
  count: number;
  outlets: number;
  countries: number;
  totalReach: number | null;
} {
  const outlets = new Set(pickups.map((p) => p.outletName.toLowerCase()));
  const countries = new Set(
    pickups.map((p) => p.country.toUpperCase()).filter(Boolean),
  );
  let totalReach = 0;
  let anyReach = false;
  for (const p of pickups) {
    const r = p.estReach ?? p.monthlyVisits;
    if (r != null) {
      totalReach += r;
      anyReach = true;
    }
  }
  return {
    count: pickups.length,
    outlets: outlets.size,
    countries: countries.size,
    totalReach: anyReach ? totalReach : null,
  };
}

// ---------------------------------------------------------------------------
// Scoped admin coverage (the native /admin/coverage report, reads pickups).
// A "valued" pickup is a real, priced one: not a false positive, EUR > 0.
// Everything is scoped by the current project via pushScope on campaign_slug.
// ---------------------------------------------------------------------------

const VALUED = "is_false_positive = false AND press_value_eur > 0";
const VALUED_P = "p.is_false_positive = false AND p.press_value_eur > 0";

export interface CoverageStats {
  pickupCount: number;
  totalEur: number;
  makerCount: number;
  dateFrom: string | null;
  dateTo: string | null;
}

export async function getCoverageStats(scope: Scope): Promise<CoverageStats> {
  const where = [VALUED];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "campaign_slug");
  const [r] = (await sql.query(
    `SELECT count(*)::int AS n, COALESCE(sum(press_value_eur), 0)::int AS eur,
            count(DISTINCT maker_slug)::int AS makers,
            min(date_spotted)::text AS mn, max(date_spotted)::text AS mx
       FROM pickups WHERE ${where.join(" AND ")}`,
    params,
  )) as { n: number; eur: number; makers: number; mn: string | null; mx: string | null }[];
  return {
    pickupCount: r?.n ?? 0,
    totalEur: r?.eur ?? 0,
    makerCount: r?.makers ?? 0,
    dateFrom: r?.mn ?? null,
    dateTo: r?.mx ?? null,
  };
}

export interface CoverageByMaker {
  makerSlug: string;
  label: string;
  count: number;
  eur: number;
}

export async function getCoverageByMaker(scope: Scope): Promise<CoverageByMaker[]> {
  const where = [VALUED_P];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "p.campaign_slug");
  const rows = (await sql.query(
    `SELECT p.maker_slug, pr.brand, count(*)::int AS n, sum(p.press_value_eur)::int AS eur
       FROM pickups p LEFT JOIN producers pr ON pr.slug = p.maker_slug
      WHERE ${where.join(" AND ")}
      GROUP BY p.maker_slug, pr.brand
      ORDER BY eur DESC, n DESC`,
    params,
  )) as { maker_slug: string; brand: string | null; n: number; eur: number }[];
  return rows.map((r) => ({
    makerSlug: r.maker_slug,
    label: r.brand || r.maker_slug,
    count: r.n,
    eur: r.eur,
  }));
}

const SCOPE_ORDER = [
  "hyperlocal",
  "local",
  "regional",
  "national",
  "trade",
  "pan-eu",
  "unknown",
];

export interface CoverageByScope {
  scope: string;
  count: number;
  eur: number;
}

export async function getCoverageByScope(scope: Scope): Promise<CoverageByScope[]> {
  const where = [VALUED];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "campaign_slug");
  const rows = (await sql.query(
    `SELECT COALESCE(NULLIF(scope, ''), 'unknown') AS scope,
            count(*)::int AS n, sum(press_value_eur)::int AS eur
       FROM pickups WHERE ${where.join(" AND ")} GROUP BY 1`,
    params,
  )) as { scope: string; n: number; eur: number }[];
  return rows
    .sort((a, b) => {
      const ia = SCOPE_ORDER.indexOf(a.scope);
      const ib = SCOPE_ORDER.indexOf(b.scope);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    })
    .map((r) => ({ scope: r.scope, count: r.n, eur: r.eur }));
}

export interface BrandSurvival {
  total: number;
  ehsaNamed: number;
  rohNamed: number;
  rohLinked: number;
}

export async function getBrandSurvival(scope: Scope): Promise<BrandSurvival> {
  const where = [VALUED];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "campaign_slug");
  const [r] = (await sql.query(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE mentions_ehsa IN ('full','name','acronym','yes'))::int AS ehsa_named,
            count(*) FILTER (WHERE mentions_roh  IN ('full','name','acronym','yes'))::int AS roh_named,
            count(*) FILTER (WHERE follow_link_to_roh IN ('yes','do','dofollow'))::int AS roh_linked
       FROM pickups WHERE ${where.join(" AND ")}`,
    params,
  )) as { total: number; ehsa_named: number; roh_named: number; roh_linked: number }[];
  return {
    total: r?.total ?? 0,
    ehsaNamed: r?.ehsa_named ?? 0,
    rohNamed: r?.roh_named ?? 0,
    rohLinked: r?.roh_linked ?? 0,
  };
}

export interface CoverageRow {
  date: string;
  outletName: string;
  articleUrl: string;
  makerSlug: string;
  makerLabel: string;
  scope: string;
  position: string;
  rohMention: string;
  ehsaMention: string;
  rohLink: string;
  eur: number;
}

export async function getCoverageRows(scope: Scope): Promise<CoverageRow[]> {
  // The ledger table lists EVERY real pickup, priced or not — only the value
  // aggregates (stats / by-maker / by-scope) exclude unpriced rows. A pickup
  // with no traffic estimate has null press_value_eur; gating the table on
  // press_value_eur > 0 made freshly-added pickups silently vanish.
  const where = ["p.is_false_positive = false"];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "p.campaign_slug");
  const rows = (await sql.query(
    `SELECT p.date_spotted::text AS date, p.outlet_name, p.article_url, p.maker_slug, pr.brand,
            p.scope, p.position_of_mention, p.mentions_roh, p.mentions_ehsa,
            p.follow_link_to_roh, p.press_value_eur
       FROM pickups p LEFT JOIN producers pr ON pr.slug = p.maker_slug
      WHERE ${where.join(" AND ")}
      ORDER BY p.press_value_eur DESC NULLS LAST, p.date_spotted DESC NULLS LAST`,
    params,
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    date: ((r.date as string) || "").slice(0, 10),
    outletName: (r.outlet_name as string) || "",
    articleUrl: (r.article_url as string) || "",
    makerSlug: (r.maker_slug as string) || "",
    makerLabel: (r.brand as string) || (r.maker_slug as string) || "",
    scope: (r.scope as string) || "",
    position: (r.position_of_mention as string) || "",
    rohMention: (r.mentions_roh as string) || "",
    ehsaMention: (r.mentions_ehsa as string) || "",
    rohLink: (r.follow_link_to_roh as string) || "",
    eur: (r.press_value_eur as number) ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Pickup CRUD (Phase 2 — the DB is the ledger). press_value_eur is recomputed
// from the inputs on every write via computePressValueEur; domain_authority is
// looked up by the server action (lib/authority) and passed in.
// ---------------------------------------------------------------------------

export interface PickupInput {
  articleUrl: string;
  makerSlug: string;
  outletName: string;
  outletUrl: string;
  dateSpotted: string | null;
  language: string;
  country: string;
  medium: string;
  scope: string;
  position: string;
  monthlyVisits: number | null;
  mentionsEhsa: string;
  mentionsRoh: string;
  linkEhsaSite: string;
  followLinkRoh: string;
  domainAuthority: string;
  notes: string;
  isFalsePositive: boolean;
  campaignSlug: string;
}

function valueOf(p: PickupInput): number | null {
  return computePressValueEur({
    monthlyVisits: p.monthlyVisits,
    medium: p.medium,
    scope: p.scope,
    position: p.position,
    mentionsEhsa: p.mentionsEhsa,
    linkEhsaSite: p.linkEhsaSite,
    followLinkRoh: p.followLinkRoh,
    domainAuthority: p.domainAuthority,
  });
}

export async function upsertPickup(p: PickupInput): Promise<void> {
  const value = valueOf(p);
  await sql`
    INSERT INTO pickups (
      article_url, maker_slug, outlet_name, outlet_url, date_spotted,
      language, country, medium, scope, position_of_mention, monthly_visits_est,
      mentions_ehsa, mentions_roh, link_ehsa_site, follow_link_to_roh,
      domain_authority, notes, is_false_positive, press_value_eur,
      campaign_slug, updated_at
    ) VALUES (
      ${p.articleUrl}, ${p.makerSlug}, ${p.outletName}, ${p.outletUrl}, ${p.dateSpotted}::date,
      ${p.language}, ${p.country}, ${p.medium}, ${p.scope}, ${p.position}, ${p.monthlyVisits},
      ${p.mentionsEhsa}, ${p.mentionsRoh}, ${p.linkEhsaSite}, ${p.followLinkRoh},
      ${p.domainAuthority}, ${p.notes}, ${p.isFalsePositive}, ${value},
      ${p.campaignSlug}, now()
    )
    ON CONFLICT (article_url, maker_slug) DO UPDATE SET
      outlet_name = EXCLUDED.outlet_name, outlet_url = EXCLUDED.outlet_url,
      date_spotted = EXCLUDED.date_spotted, language = EXCLUDED.language,
      country = EXCLUDED.country, medium = EXCLUDED.medium, scope = EXCLUDED.scope,
      position_of_mention = EXCLUDED.position_of_mention,
      monthly_visits_est = EXCLUDED.monthly_visits_est,
      mentions_ehsa = EXCLUDED.mentions_ehsa, mentions_roh = EXCLUDED.mentions_roh,
      link_ehsa_site = EXCLUDED.link_ehsa_site, follow_link_to_roh = EXCLUDED.follow_link_to_roh,
      domain_authority = EXCLUDED.domain_authority, notes = EXCLUDED.notes,
      is_false_positive = EXCLUDED.is_false_positive, press_value_eur = EXCLUDED.press_value_eur,
      campaign_slug = EXCLUDED.campaign_slug, updated_at = now()
  `;
}

export async function updatePickup(
  oldUrl: string,
  oldMaker: string,
  p: PickupInput,
): Promise<void> {
  const value = valueOf(p);
  await sql`
    UPDATE pickups SET
      article_url = ${p.articleUrl}, maker_slug = ${p.makerSlug},
      outlet_name = ${p.outletName}, outlet_url = ${p.outletUrl},
      date_spotted = ${p.dateSpotted}::date, language = ${p.language}, country = ${p.country},
      medium = ${p.medium}, scope = ${p.scope}, position_of_mention = ${p.position},
      monthly_visits_est = ${p.monthlyVisits}, mentions_ehsa = ${p.mentionsEhsa},
      mentions_roh = ${p.mentionsRoh}, link_ehsa_site = ${p.linkEhsaSite},
      follow_link_to_roh = ${p.followLinkRoh}, domain_authority = ${p.domainAuthority},
      notes = ${p.notes}, is_false_positive = ${p.isFalsePositive},
      press_value_eur = ${value}, campaign_slug = ${p.campaignSlug}, updated_at = now()
    WHERE article_url = ${oldUrl} AND maker_slug = ${oldMaker}
  `;
}

export async function deletePickup(url: string, maker: string): Promise<void> {
  await sql`DELETE FROM pickups WHERE article_url = ${url} AND maker_slug = ${maker}`;
}

export async function setPickupFp(
  url: string,
  maker: string,
  isFp: boolean,
): Promise<void> {
  await sql`
    UPDATE pickups SET is_false_positive = ${isFp}, updated_at = now()
     WHERE article_url = ${url} AND maker_slug = ${maker}
  `;
}

export async function getPickup(
  url: string,
  maker: string,
): Promise<PickupInput | null> {
  const rows = (await sql`
    SELECT article_url, maker_slug, outlet_name, outlet_url,
           date_spotted::text AS date_spotted, language, country, medium, scope,
           position_of_mention, monthly_visits_est, mentions_ehsa, mentions_roh,
           link_ehsa_site, follow_link_to_roh, domain_authority, notes,
           is_false_positive, campaign_slug
      FROM pickups WHERE article_url = ${url} AND maker_slug = ${maker} LIMIT 1
  `) as Record<string, unknown>[];
  const r = rows[0];
  if (!r) return null;
  return {
    articleUrl: (r.article_url as string) ?? "",
    makerSlug: (r.maker_slug as string) ?? "",
    outletName: (r.outlet_name as string) ?? "",
    outletUrl: (r.outlet_url as string) ?? "",
    dateSpotted: (r.date_spotted as string) ?? null,
    language: (r.language as string) ?? "",
    country: (r.country as string) ?? "",
    medium: (r.medium as string) ?? "",
    scope: (r.scope as string) ?? "",
    position: (r.position_of_mention as string) ?? "",
    monthlyVisits: (r.monthly_visits_est as number) ?? null,
    mentionsEhsa: (r.mentions_ehsa as string) ?? "",
    mentionsRoh: (r.mentions_roh as string) ?? "",
    linkEhsaSite: (r.link_ehsa_site as string) ?? "",
    followLinkRoh: (r.follow_link_to_roh as string) ?? "",
    domainAuthority: (r.domain_authority as string) ?? "",
    notes: (r.notes as string) ?? "",
    isFalsePositive: Boolean(r.is_false_positive),
    campaignSlug: (r.campaign_slug as string) ?? "",
  };
}

