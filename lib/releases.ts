import { sql } from "@/db/client";

export interface Block {
  kind: "paragraph" | "attribution" | "heading";
  text: string;
}

export interface Release {
  slug: string;
  headline: string;
  subhead: string;
  datelineRaw: string;
  city: string;
  country: string;
  displayDate: string | null;
  isoDate: string | null;
  isDraft: boolean;
  lead: string;
  blocks: Block[];
}

const MONTH_NAMES: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
};

function formatDisplayDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  const monthName = MONTH_NAMES[m];
  if (!monthName) return null;
  return `${parseInt(d, 10)} ${monthName} ${y}`;
}

interface ReleaseRow {
  slug: string;
  headline: string;
  subhead: string;
  dateline_raw: string;
  city: string;
  country: string;
  iso_date: string | null;
  is_draft: boolean;
  lead: string;
  blocks: Block[];
}

function toRelease(row: ReleaseRow): Release {
  const isoDate = row.iso_date
    ? typeof row.iso_date === "string"
      ? row.iso_date.slice(0, 10)
      : new Date(row.iso_date).toISOString().slice(0, 10)
    : null;
  return {
    slug: row.slug,
    headline: row.headline,
    subhead: row.subhead,
    datelineRaw: row.dateline_raw,
    city: row.city,
    country: row.country,
    isoDate,
    displayDate: formatDisplayDate(isoDate),
    isDraft: row.is_draft,
    lead: row.lead,
    blocks: row.blocks ?? [],
  };
}

export async function getAllReleases(): Promise<Release[]> {
  const rows = (await sql`
    SELECT slug, headline, subhead, dateline_raw, city, country,
           iso_date::text AS iso_date, is_draft, lead, blocks
    FROM releases
    ORDER BY iso_date DESC NULLS LAST, slug ASC
  `) as ReleaseRow[];
  return rows.map(toRelease);
}

export async function getRelease(slug: string): Promise<Release | null> {
  const rows = (await sql`
    SELECT slug, headline, subhead, dateline_raw, city, country,
           iso_date::text AS iso_date, is_draft, lead, blocks
    FROM releases
    WHERE slug = ${slug}
    LIMIT 1
  `) as ReleaseRow[];
  return rows[0] ? toRelease(rows[0]) : null;
}

export async function getReleaseSlugs(): Promise<string[]> {
  const rows = (await sql`SELECT slug FROM releases`) as Array<{ slug: string }>;
  return rows.map((r) => r.slug);
}
