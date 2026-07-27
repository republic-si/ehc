import { sql } from "@/db/client";

// "As seen in" coverage wall for the /ehsa press hub, read live from Neon.
// SOURCE OF TRUTH: the pickups table (same data the coverage admin shows).
// The 2026 coverage is the proof shown on the 2027 hub. False positives are
// filtered. The euro / EMV press value is DELIBERATELY never selected here:
// it is internal only and must not be exposed to journalists.

const CAMPAIGN = "ehsa_2026";

export interface CoverageWall {
  countryCount: number;
  hasTv: boolean;
  outlets: { name: string; isTv: boolean }[];
}

// Strip a trailing parenthetical ("(TV broadcast)", "(Volendam-Edam)") so
// variants of the same outlet collapse to one clean chip.
function cleanOutlet(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export async function getCoverageWall(limit = 42): Promise<CoverageWall | null> {
  try {
    const summary = await sql`
      SELECT count(DISTINCT country)::int AS countries,
             bool_or(medium ILIKE '%tv%') AS has_tv
      FROM pickups
      WHERE campaign_slug = ${CAMPAIGN} AND is_false_positive IS NOT TRUE
    `;
    const rows = await sql`
      SELECT outlet_name,
             MAX(est_reach) AS reach,
             bool_or(medium ILIKE '%tv%') AS is_tv
      FROM pickups
      WHERE campaign_slug = ${CAMPAIGN} AND is_false_positive IS NOT TRUE
      GROUP BY outlet_name
      ORDER BY reach DESC NULLS LAST
    `;

    const seen = new Map<string, { name: string; isTv: boolean }>();
    for (const row of rows) {
      const name = cleanOutlet(String(row.outlet_name));
      if (!name) continue;
      const key = name.toLowerCase();
      const existing = seen.get(key);
      if (existing) {
        if (row.is_tv) existing.isTv = true;
      } else {
        seen.set(key, { name, isTv: Boolean(row.is_tv) });
      }
    }

    const s = summary[0] ?? {};
    return {
      countryCount: Number(s.countries ?? 0),
      hasTv: Boolean(s.has_tv),
      outlets: [...seen.values()].slice(0, limit),
    };
  } catch (err) {
    console.error("[ehsa-coverage] query failed", err);
    return null;
  }
}

// Per-maker "featured in" coverage for the winner profile pages. Same source
// (pickups), filtered to one maker, false-positives excluded, outlet-name
// variants deduped (web + TV of the same outlet collapse to one, TV flagged).
// No euro / EMV value is ever selected.
export interface MakerCoverageItem {
  name: string;
  url: string;
  isTv: boolean;
}

export async function getMakerCoverage(
  makerSlug: string,
): Promise<MakerCoverageItem[]> {
  try {
    const rows = await sql`
      SELECT outlet_name,
             coalesce(nullif(article_url, ''), outlet_url) AS url,
             MAX(est_reach) AS reach,
             bool_or(medium ILIKE '%tv%') AS is_tv
      FROM pickups
      WHERE campaign_slug = ${CAMPAIGN}
        AND is_false_positive IS NOT TRUE
        AND maker_slug = ${makerSlug}
      GROUP BY outlet_name, coalesce(nullif(article_url, ''), outlet_url)
      ORDER BY reach DESC NULLS LAST
    `;
    const seen = new Map<string, MakerCoverageItem>();
    for (const row of rows) {
      const name = cleanOutlet(String(row.outlet_name));
      if (!name) continue;
      const key = name.toLowerCase();
      const existing = seen.get(key);
      if (existing) {
        if (row.is_tv) existing.isTv = true;
      } else {
        seen.set(key, {
          name,
          url: String(row.url ?? ""),
          isTv: Boolean(row.is_tv),
        });
      }
    }
    return [...seen.values()];
  } catch (err) {
    console.error("[ehsa-coverage] maker query failed", err);
    return [];
  }
}
