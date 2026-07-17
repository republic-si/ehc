import { sql } from "@/db/client";

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
