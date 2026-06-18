import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { sql } from "../db/client.ts";

const MAKERS_DIR = join(homedir(), "EHSA-press", "makers");

interface Block {
  kind: "paragraph" | "attribution" | "heading";
  text: string;
}

interface ParsedRelease {
  slug: string;
  headline: string;
  subhead: string;
  datelineRaw: string;
  city: string;
  country: string;
  isoDate: string | null;
  isDraft: boolean;
  lead: string;
  blocks: Block[];
}

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

function parseDateline(line: string) {
  const cityMatch = line.match(/^([^,]+),\s*([A-Z]{2})\./);
  const city = cityMatch ? cityMatch[1].trim() : "";
  const country = cityMatch ? cityMatch[2].trim() : "";
  const isDraft = /\[(?:DD|TUESDAY|SEND DATE)/i.test(line);

  let isoDate: string | null = null;
  const iso = line.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    isoDate = `${iso[1]}-${iso[2]}-${iso[3]}`;
  } else {
    const verbose = line.match(/\b(\d{1,2})\s+([A-Z]{3,})\s+(\d{4})\b/);
    if (verbose) {
      const day = verbose[1].padStart(2, "0");
      const monthCode = verbose[2].slice(0, 3).toUpperCase();
      const month = MONTHS[monthCode];
      const year = verbose[3];
      if (month) isoDate = `${year}-${month}-${day}`;
    }
  }
  return { city, country, isoDate, isDraft };
}

function blockify(paragraph: string): Block {
  const trimmed = paragraph.trim();
  if (/^[–—-]\s/.test(trimmed) && trimmed.length < 200) {
    return { kind: "attribution", text: trimmed.replace(/^[–—-]\s/, "") };
  }
  if (/^[A-Z][A-Z\s&]+$/.test(trimmed) && trimmed.length < 80) {
    return { kind: "heading", text: trimmed };
  }
  return { kind: "paragraph", text: trimmed };
}

function parseRelease(slug: string, raw: string): ParsedRelease | null {
  const lines = raw.split(/\r?\n/);
  if (!lines[0]?.trim().toUpperCase().startsWith("PRESS RELEASE")) return null;
  const nonEmpty = lines
    .map((l, i) => ({ l: l.trim(), i }))
    .filter((x) => x.l.length > 0);
  if (nonEmpty.length < 4) return null;

  const headline = nonEmpty[1].l;
  const subhead = nonEmpty[2].l;
  const datelineIdx = nonEmpty[3].i;
  const datelineRaw = nonEmpty[3].l;
  const parsed = parseDateline(datelineRaw);

  let bodyStart = datelineIdx + 1;
  while (bodyStart < lines.length && lines[bodyStart].trim() === "") bodyStart++;

  const bodyText = lines.slice(bodyStart).join("\n").trim();
  const paragraphs = bodyText
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const blocks = paragraphs.map(blockify);
  const lead = blocks.find((b) => b.kind === "paragraph")?.text ?? "";

  return {
    slug,
    headline,
    subhead,
    datelineRaw,
    city: parsed.city,
    country: parsed.country,
    isoDate: parsed.isoDate,
    isDraft: parsed.isDraft,
    lead,
    blocks,
  };
}

async function main() {
  const slugs = readdirSync(MAKERS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let parsed = 0;
  let upserted = 0;

  for (const slug of slugs) {
    const file = join(MAKERS_DIR, slug, "release-EN.txt");
    try {
      statSync(file);
    } catch {
      continue;
    }
    const raw = readFileSync(file, "utf8");
    const r = parseRelease(slug, raw);
    if (!r) continue;
    parsed++;

    await sql`
      INSERT INTO releases (
        slug, headline, subhead, dateline_raw, city, country,
        iso_date, is_draft, lead, blocks, updated_at
      ) VALUES (
        ${r.slug}, ${r.headline}, ${r.subhead}, ${r.datelineRaw},
        ${r.city}, ${r.country}, ${r.isoDate}::date, ${r.isDraft},
        ${r.lead}, ${JSON.stringify(r.blocks)}::jsonb, now()
      )
      ON CONFLICT (slug) DO UPDATE SET
        headline = EXCLUDED.headline,
        subhead = EXCLUDED.subhead,
        dateline_raw = EXCLUDED.dateline_raw,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        iso_date = EXCLUDED.iso_date,
        is_draft = EXCLUDED.is_draft,
        lead = EXCLUDED.lead,
        blocks = EXCLUDED.blocks,
        updated_at = now()
    `;
    upserted++;
  }

  const [{ count }] = await sql`
    SELECT count(*)::int AS count FROM releases
  ` as Array<{ count: number }>;

  console.log(`releases ingest: parsed=${parsed} upserted=${upserted} total_in_db=${count}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
