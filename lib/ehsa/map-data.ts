import { sql } from "@/db/client";

// Producer counts per country + a representative top winner, for the /ehsa
// Europe map. Source of truth: the producers + awards tables. Non-European
// producers are excluded. Case-normalised so "AUSTRIA"/"Austria" collapse.

export interface CountryDatum {
  country: string;
  count: number;
  winner?: string;
  winnerCategory?: string;
}

export async function getProducerMap(): Promise<Record<string, CountryDatum>> {
  try {
    const counts = await sql`
      SELECT initcap(trim(country)) AS country, count(*)::int AS count
      FROM producers
      WHERE coalesce(in_scope, true) AND trim(country) <> ''
        AND initcap(trim(country)) NOT IN ('Australia', 'United States', 'Costa Rica')
      GROUP BY 1
    `;
    const winners = await sql`
      SELECT DISTINCT ON (initcap(trim(p.country)))
        initcap(trim(p.country)) AS country, p.brand, a.category
      FROM awards a JOIN producers p ON p.slug = a.producer_slug
      WHERE a.rank = 1 AND a.region ILIKE '%EU%' AND trim(p.country) <> ''
      ORDER BY initcap(trim(p.country)), a.score DESC
    `;
    const wmap = new Map<string, { brand: string; category: string }>();
    for (const w of winners) {
      wmap.set(String(w.country), { brand: String(w.brand), category: String(w.category) });
    }

    const out: Record<string, CountryDatum> = {};
    for (const c of counts) {
      const country = String(c.country);
      const w = wmap.get(country);
      out[country] = {
        country,
        count: Number(c.count),
        winner: w?.brand,
        winnerCategory: w?.category,
      };
    }
    return out;
  } catch (err) {
    console.error("[ehsa-map] query failed", err);
    return {};
  }
}

export function mapTotals(data: Record<string, CountryDatum>) {
  const values = Object.values(data);
  return {
    countries: values.length,
    producers: values.reduce((sum, d) => sum + d.count, 0),
  };
}
