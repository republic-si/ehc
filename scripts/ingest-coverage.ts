import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { sql } from "../db/client.ts";

const CSV_PATH = join(homedir(), "ehc-press", "coverage", "coverage.csv");

function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cur += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        fields.push(cur);
        cur = "";
      } else cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === '"') {
      if (inQuotes && raw[i + 1] === '"') {
        current += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        current += c;
      }
    } else if (c === "\n" && !inQuotes) {
      if (current.length > 0) rows.push(parseCsvRow(current.replace(/\r$/, "")));
      current = "";
    } else current += c;
  }
  if (current.trim().length > 0) rows.push(parseCsvRow(current));
  return rows;
}

function toIntOrNull(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseInt(v.replace(/[, ]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function toDateOrNull(v: string | undefined): string | null {
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return null;
}

async function main() {
  const raw = readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(raw);
  if (rows.length < 2) {
    console.log("no rows");
    return;
  }
  const header = rows[0];
  const col = (name: string) => header.indexOf(name);
  const idx = {
    date: col("date_spotted"),
    outletName: col("outlet_name"),
    outletUrl: col("outlet_url"),
    articleUrl: col("article_url"),
    maker: col("maker_slug"),
    language: col("language"),
    country: col("country"),
    scope: col("scope"),
    medium: col("medium"),
    source: col("source"),
    estReach: col("est_reach"),
    monthlyVisits: col("monthly_visits_est"),
    domainAuthority: col("domain_authority"),
    notes: col("notes"),
    pressValueEur: col("press_value_eur"),
    mentionsRoh: col("mentions_roh"),
    mentionsEhsa: col("mentions_ehsa"),
    followLinkRoh: col("follow_link_to_roh"),
    followLinkMaker: col("follow_link_to_maker"),
    positionOfMention: col("position_of_mention"),
  };

  let upserted = 0;
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < header.length) {
      skipped++;
      continue;
    }
    const articleUrl = r[idx.articleUrl] || "";
    if (!articleUrl) {
      skipped++;
      continue;
    }
    const notes = r[idx.notes] || "";
    const isFp = /\[FP[:\]]/i.test(notes);

    await sql`
      INSERT INTO pickups (
        article_url, date_spotted, outlet_name, outlet_url, maker_slug,
        language, country, scope, medium, source,
        est_reach, monthly_visits_est, domain_authority, notes,
        press_value_eur, mentions_roh, mentions_ehsa,
        follow_link_to_roh, follow_link_to_maker, position_of_mention,
        campaign_slug, is_false_positive, updated_at
      ) VALUES (
        ${articleUrl},
        ${toDateOrNull(r[idx.date])}::date,
        ${r[idx.outletName] || ""},
        ${r[idx.outletUrl] || ""},
        ${r[idx.maker] || ""},
        ${r[idx.language] || ""},
        ${r[idx.country] || ""},
        ${r[idx.scope] || ""},
        ${r[idx.medium] || ""},
        ${r[idx.source] || ""},
        ${toIntOrNull(r[idx.estReach])},
        ${toIntOrNull(r[idx.monthlyVisits])},
        ${r[idx.domainAuthority] || ""},
        ${notes},
        ${toIntOrNull(r[idx.pressValueEur])},
        ${r[idx.mentionsRoh] || ""},
        ${r[idx.mentionsEhsa] || ""},
        ${r[idx.followLinkRoh] || ""},
        ${r[idx.followLinkMaker] || ""},
        ${r[idx.positionOfMention] || ""},
        'ehsa_2026',
        ${isFp},
        now()
      )
      ON CONFLICT (article_url, maker_slug) DO UPDATE SET
        date_spotted = EXCLUDED.date_spotted,
        outlet_name = EXCLUDED.outlet_name,
        outlet_url = EXCLUDED.outlet_url,
        maker_slug = EXCLUDED.maker_slug,
        language = EXCLUDED.language,
        country = EXCLUDED.country,
        scope = EXCLUDED.scope,
        medium = EXCLUDED.medium,
        source = EXCLUDED.source,
        est_reach = EXCLUDED.est_reach,
        monthly_visits_est = EXCLUDED.monthly_visits_est,
        domain_authority = EXCLUDED.domain_authority,
        notes = EXCLUDED.notes,
        press_value_eur = EXCLUDED.press_value_eur,
        mentions_roh = EXCLUDED.mentions_roh,
        mentions_ehsa = EXCLUDED.mentions_ehsa,
        follow_link_to_roh = EXCLUDED.follow_link_to_roh,
        follow_link_to_maker = EXCLUDED.follow_link_to_maker,
        position_of_mention = EXCLUDED.position_of_mention,
        campaign_slug = EXCLUDED.campaign_slug,
        is_false_positive = EXCLUDED.is_false_positive,
        updated_at = now()
    `;
    upserted++;
  }

  const [{ count }] = await sql`
    SELECT count(*)::int AS count FROM pickups
  ` as Array<{ count: number }>;
  const [{ count: realCount }] = await sql`
    SELECT count(*)::int AS count FROM pickups WHERE is_false_positive = false
  ` as Array<{ count: number }>;

  console.log(
    `coverage ingest: upserted=${upserted} skipped=${skipped} total_in_db=${count} real=${realCount}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
