import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CSV_PATH = join(homedir(), "EHSA-press", "coverage", "coverage.csv");

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
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        fields.push(cur);
        cur = "";
      } else {
        cur += c;
      }
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
    } else {
      current += c;
    }
  }
  if (current.trim().length > 0) rows.push(parseCsvRow(current));
  return rows;
}

function toInt(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseInt(v.replace(/[, ]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

export function getPickups(): Pickup[] {
  let raw: string;
  try {
    raw = readFileSync(CSV_PATH, "utf8");
  } catch {
    return [];
  }
  const rows = parseCsv(raw);
  if (rows.length < 2) return [];
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
    estReach: col("est_reach"),
    monthlyVisits: col("monthly_visits_est"),
    notes: col("notes"),
  };

  const pickups: Pickup[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < header.length) continue;
    const notes = r[idx.notes] || "";
    if (/\[FP[:\]]/i.test(notes)) continue;
    const articleUrl = r[idx.articleUrl] || "";
    if (!articleUrl) continue;
    const date = r[idx.date] || "";
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
    pickups.push({
      date,
      isoDate: iso,
      outletName: r[idx.outletName] || "",
      outletUrl: r[idx.outletUrl] || "",
      articleUrl,
      makerSlug: r[idx.maker] || "",
      language: r[idx.language] || "",
      country: r[idx.country] || "",
      scope: r[idx.scope] || "",
      estReach: toInt(r[idx.estReach]),
      monthlyVisits: toInt(r[idx.monthlyVisits]),
    });
  }
  pickups.sort((a, b) => {
    if (a.isoDate && b.isoDate) return b.isoDate.localeCompare(a.isoDate);
    if (a.isoDate) return -1;
    if (b.isoDate) return 1;
    return a.outletName.localeCompare(b.outletName);
  });
  return pickups;
}

export function getPickupStats(pickups: Pickup[]): {
  count: number;
  outlets: number;
  countries: number;
  totalReach: number | null;
} {
  const outlets = new Set(pickups.map((p) => p.outletName.toLowerCase()));
  const countries = new Set(pickups.map((p) => p.country.toUpperCase()).filter(Boolean));
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
