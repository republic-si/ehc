import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const MAKERS_DIR = join(homedir(), "EHSA-press", "makers");

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

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

const MONTH_NAMES: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
};

function parseDateline(line: string): {
  city: string;
  country: string;
  displayDate: string | null;
  isoDate: string | null;
  isDraft: boolean;
} {
  const cityMatch = line.match(/^([^,]+),\s*([A-Z]{2})\./);
  const city = cityMatch ? cityMatch[1].trim() : "";
  const country = cityMatch ? cityMatch[2].trim() : "";

  const isDraft = /\[(?:DD|TUESDAY|SEND DATE)/i.test(line);

  let isoDate: string | null = null;
  let displayDate: string | null = null;

  const iso = line.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    isoDate = `${iso[1]}-${iso[2]}-${iso[3]}`;
    const day = parseInt(iso[3], 10);
    displayDate = `${day} ${MONTH_NAMES[iso[2]]} ${iso[1]}`;
    return { city, country, displayDate, isoDate, isDraft };
  }

  const verbose = line.match(/\b(\d{1,2})\s+([A-Z]{3,})\s+(\d{4})\b/);
  if (verbose) {
    const day = verbose[1].padStart(2, "0");
    const monthCode = verbose[2].slice(0, 3).toUpperCase();
    const month = MONTHS[monthCode];
    const year = verbose[3];
    if (month) {
      isoDate = `${year}-${month}-${day}`;
      displayDate = `${parseInt(day, 10)} ${MONTH_NAMES[month]} ${year}`;
    }
  }

  return { city, country, displayDate, isoDate, isDraft };
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

function parseRelease(slug: string, raw: string): Release | null {
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
  const parsedDate = parseDateline(datelineRaw);

  let bodyStart = datelineIdx + 1;
  while (bodyStart < lines.length && lines[bodyStart].trim() === "") {
    bodyStart++;
  }

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
    city: parsedDate.city,
    country: parsedDate.country,
    displayDate: parsedDate.displayDate,
    isoDate: parsedDate.isoDate,
    isDraft: parsedDate.isDraft,
    lead,
    blocks,
  };
}

function safeReadDir(dir: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

export function getAllReleases(): Release[] {
  const slugs = safeReadDir(MAKERS_DIR);
  const releases: Release[] = [];
  for (const slug of slugs) {
    const file = join(MAKERS_DIR, slug, "release-EN.txt");
    try {
      statSync(file);
    } catch {
      continue;
    }
    const raw = readFileSync(file, "utf8");
    const parsed = parseRelease(slug, raw);
    if (parsed) releases.push(parsed);
  }
  releases.sort((a, b) => {
    if (a.isoDate && b.isoDate) return b.isoDate.localeCompare(a.isoDate);
    if (a.isoDate && !b.isoDate) return -1;
    if (!a.isoDate && b.isoDate) return 1;
    return a.slug.localeCompare(b.slug);
  });
  return releases;
}

export function getRelease(slug: string): Release | null {
  const file = join(MAKERS_DIR, slug, "release-EN.txt");
  try {
    const raw = readFileSync(file, "utf8");
    return parseRelease(slug, raw);
  } catch {
    return null;
  }
}

export function getReleaseSlugs(): string[] {
  return getAllReleases().map((r) => r.slug);
}
