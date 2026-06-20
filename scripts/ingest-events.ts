import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { sql } from "../db/client.ts";

const CSV_PATH = join(homedir(), "roh-events", "db", "events.csv");

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
  const trimmed = v.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  return null;
}

type DateKind = "single" | "span" | "weekly" | "seasonal" | "various" | "unknown";

function classifyDate(
  startRaw: string,
  endRaw: string,
  date2026Raw: string,
): { kind: DateKind; weekday: string; start: string | null; end: string | null } {
  const start = (startRaw || "").trim();
  const end = (endRaw || "").trim();
  const d2026 = (date2026Raw || "").trim();

  if (/^weekly:/i.test(start)) {
    return { kind: "weekly", weekday: start.split(":")[1] || "", start: null, end: null };
  }
  if (/^seasonal:/i.test(start)) {
    return { kind: "seasonal", weekday: start.split(":")[1] || "", start: null, end: null };
  }
  if (start === "various" || d2026 === "various") {
    return { kind: "various", weekday: "", start: null, end: null };
  }

  const s = toDateOrNull(start);
  const e = toDateOrNull(end);
  if (s && e && s !== e) return { kind: "span", weekday: "", start: s, end: e };
  if (s) return { kind: "single", weekday: "", start: s, end: e ?? s };
  return { kind: "unknown", weekday: "", start: null, end: null };
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
    eventId: col("event_id"),
    event: col("event"),
    city: col("city"),
    date2026: col("date_2026"),
    organiserWebsite: col("organiser_website"),
    email: col("email"),
    status: col("status"),
    stallCost: col("stall_cost"),
    crowdSize: col("crowd_size"),
    lastContact: col("last_contact"),
    priority: col("priority"),
    notes: col("notes"),
    startDate: col("start_date"),
    endDate: col("end_date"),
    deadline: col("deadline"),
    distanceKm: col("distance_km"),
    distanceBand: col("distance_band"),
  };

  let upserted = 0;
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < header.length) {
      skipped++;
      continue;
    }
    const eventId = (r[idx.eventId] || "").trim();
    if (!eventId) {
      skipped++;
      continue;
    }

    const dateInfo = classifyDate(
      r[idx.startDate] || "",
      r[idx.endDate] || "",
      r[idx.date2026] || "",
    );

    await sql`
      INSERT INTO events (
        event_id, event, city, date_2026,
        start_date, end_date, date_kind, weekday,
        organiser_website, email, status,
        stall_cost, crowd_size, last_contact, priority, notes,
        deadline, distance_km, distance_band, updated_at
      ) VALUES (
        ${eventId},
        ${r[idx.event] || ""},
        ${r[idx.city] || ""},
        ${r[idx.date2026] || ""},
        ${dateInfo.start}::date,
        ${dateInfo.end}::date,
        ${dateInfo.kind},
        ${dateInfo.weekday},
        ${r[idx.organiserWebsite] || ""},
        ${r[idx.email] || ""},
        ${(r[idx.status] || "cold").trim() || "cold"},
        ${r[idx.stallCost] || ""},
        ${r[idx.crowdSize] || ""},
        ${toDateOrNull(r[idx.lastContact])}::date,
        ${toIntOrNull(r[idx.priority])},
        ${r[idx.notes] || ""},
        ${toDateOrNull(r[idx.deadline])}::date,
        ${toIntOrNull(r[idx.distanceKm])},
        ${r[idx.distanceBand] || ""},
        now()
      )
      ON CONFLICT (event_id) DO UPDATE SET
        event             = EXCLUDED.event,
        city              = EXCLUDED.city,
        date_2026         = EXCLUDED.date_2026,
        start_date        = EXCLUDED.start_date,
        end_date          = EXCLUDED.end_date,
        date_kind         = EXCLUDED.date_kind,
        weekday           = EXCLUDED.weekday,
        organiser_website = EXCLUDED.organiser_website,
        deadline          = EXCLUDED.deadline,
        distance_km       = EXCLUDED.distance_km,
        distance_band     = EXCLUDED.distance_band,
        updated_at        = now()
    `;
    upserted++;
  }

  const [{ count }] = (await sql`
    SELECT count(*)::int AS count FROM events
  `) as Array<{ count: number }>;

  console.log(
    `events ingest: upserted=${upserted} skipped=${skipped} total_in_db=${count}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
