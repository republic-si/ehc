import { sql } from "@/db/client";
import { pushScope, type Scope } from "@/lib/scope";

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
  makerLabel: string;
  scope: string;
  position: string;
  rohMention: string;
  ehsaMention: string;
  rohLink: string;
  eur: number;
}

export async function getCoverageRows(scope: Scope): Promise<CoverageRow[]> {
  const where = [VALUED_P];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "p.campaign_slug");
  const rows = (await sql.query(
    `SELECT p.date_spotted::text AS date, p.outlet_name, p.article_url, p.maker_slug, pr.brand,
            p.scope, p.position_of_mention, p.mentions_roh, p.mentions_ehsa,
            p.follow_link_to_roh, p.press_value_eur
       FROM pickups p LEFT JOIN producers pr ON pr.slug = p.maker_slug
      WHERE ${where.join(" AND ")}
      ORDER BY p.press_value_eur DESC, p.date_spotted DESC NULLS LAST`,
    params,
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    date: ((r.date as string) || "").slice(0, 10),
    outletName: (r.outlet_name as string) || "",
    articleUrl: (r.article_url as string) || "",
    makerLabel: (r.brand as string) || (r.maker_slug as string) || "",
    scope: (r.scope as string) || "",
    position: (r.position_of_mention as string) || "",
    rohMention: (r.mentions_roh as string) || "",
    ehsaMention: (r.mentions_ehsa as string) || "",
    rohLink: (r.follow_link_to_roh as string) || "",
    eur: (r.press_value_eur as number) ?? 0,
  }));
}
