import { unstable_cache } from "next/cache";
import { sql } from "@/db/client";

export const EVENTS_CACHE_TAG = "events";

export const TARGET_TIERS = [
  "we_want_to_go",
  "priority_for_us",
  "potential",
  "not_interested",
] as const;
export type TargetTier = (typeof TARGET_TIERS)[number];

export const TARGET_TIER_LABELS: Record<TargetTier, string> = {
  we_want_to_go: "We want to go",
  priority_for_us: "Priority for us",
  potential: "Potential",
  not_interested: "Not interested",
};

export const DISTANCE_BANDS = [
  "drive 1 day",
  "weekender",
  "far far away",
  "unknown",
] as const;
export type DistanceBand = (typeof DISTANCE_BANDS)[number];

const DISTANCE_PENALTY: Record<string, number> = {
  "drive 1 day": 0,
  weekender: -10,
  "far far away": -25,
  unknown: -15,
};

const SCHEDULED = new Set([
  "confirmed",
  "form-link",
  "priced",
  "pdf-pending",
  "asking-more",
]);
const REPLIED = new Set(["form-link", "priced", "pdf-pending", "asking-more"]);
const WAITING = new Set(["new", "late"]);
const INACTIVE = new Set(["declined", "withdrawn", "closed-unsure", "refused"]);
const BLOCKED = new Set([
  "form-only",
  "unsure",
  "low-confidence",
  "cold",
]);

export const STATUS_VALUES = [
  "cold",
  "new",
  "late",
  "form-only",
  "unsure",
  "low-confidence",
  "form-link",
  "priced",
  "pdf-pending",
  "asking-more",
  "confirmed",
  "declined",
  "withdrawn",
  "closed-unsure",
  "refused",
] as const;
export type EventStatus = (typeof STATUS_VALUES)[number];

export const DATE_KINDS = [
  "single",
  "span",
  "weekly",
  "seasonal",
  "various",
  "unknown",
] as const;
export type DateKind = (typeof DATE_KINDS)[number];

export interface EventRow {
  event_id: string;
  event: string;
  city: string;
  date_2026: string;
  start_date: string | null;
  end_date: string | null;
  date_kind: string;
  weekday: string;
  organiser_website: string;
  email: string;
  status: string;
  target_tier: string;
  stall_cost: string;
  crowd_size: string;
  last_contact: string | null;
  priority: number | null;
  notes: string;
  notes_en: string;
  updates: string;
  updates_en: string;
  deadline: string | null;
  distance_km: number | null;
  distance_band: string;
  booked: boolean;
  stand_cost: string | null;
  hotel_cost: string | null;
}

export interface EventModel {
  eventId: string;
  event: string;
  city: string;
  date2026: string;
  startDate: string | null;
  endDate: string | null;
  dateKind: DateKind;
  weekday: string;
  organiserWebsite: string;
  email: string;
  status: string;
  targetTier: TargetTier;
  stallCost: string;
  crowdSize: string;
  lastContact: string | null;
  priority: number | null;
  notes: string;
  notesEn: string;
  updates: string;
  updatesEn: string;
  deadline: string | null;
  distanceKm: number | null;
  distanceBand: string;
  booked: boolean;
  standCost: number | null;
  hotelCost: number | null;
}

function toEvent(row: EventRow): EventModel {
  return {
    eventId: row.event_id,
    event: row.event,
    city: row.city,
    date2026: row.date_2026,
    startDate: row.start_date ? row.start_date.slice(0, 10) : null,
    endDate: row.end_date ? row.end_date.slice(0, 10) : null,
    dateKind: (row.date_kind as DateKind) ?? "unknown",
    weekday: row.weekday,
    organiserWebsite: row.organiser_website,
    email: row.email,
    status: row.status,
    targetTier: (row.target_tier as TargetTier) ?? "potential",
    stallCost: row.stall_cost,
    crowdSize: row.crowd_size,
    lastContact: row.last_contact ? row.last_contact.slice(0, 10) : null,
    priority: row.priority,
    notes: row.notes,
    notesEn: row.notes_en ?? "",
    updates: row.updates ?? "",
    updatesEn: row.updates_en ?? "",
    deadline: row.deadline ? row.deadline.slice(0, 10) : null,
    distanceKm: row.distance_km,
    distanceBand: row.distance_band,
    booked: row.booked ?? false,
    standCost: row.stand_cost != null ? Number(row.stand_cost) : null,
    hotelCost: row.hotel_cost != null ? Number(row.hotel_cost) : null,
  };
}

export type SortKey =
  | "date"
  | "distance"
  | "crowd"
  | "tier"
  | "status"
  | "name";

export interface ListFilters {
  distanceBand?: string;
  status?: string;
  month?: number;
  tier?: string;
  sort?: SortKey;
}

const SORT_SQL: Record<SortKey, string> = {
  date: "start_date ASC NULLS LAST, event ASC",
  distance: "distance_km ASC NULLS LAST, start_date ASC NULLS LAST",
  crowd: "crowd_size DESC, start_date ASC NULLS LAST",
  tier:
    "CASE target_tier WHEN 'we_want_to_go' THEN 1 WHEN 'priority_for_us' THEN 2 WHEN 'potential' THEN 3 WHEN 'not_interested' THEN 4 ELSE 5 END, start_date ASC NULLS LAST",
  status: "status ASC, start_date ASC NULLS LAST",
  name: "event ASC",
};

export async function listEvents(
  filters: ListFilters = {},
): Promise<EventModel[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (filters.distanceBand) {
    where.push(`distance_band = $${i++}`);
    params.push(filters.distanceBand);
  }
  if (filters.status) {
    where.push(`status = $${i++}`);
    params.push(filters.status);
  }
  if (filters.tier) {
    where.push(`target_tier = $${i++}`);
    params.push(filters.tier);
  }
  if (filters.month != null) {
    where.push(`EXTRACT(MONTH FROM start_date) = $${i++}`);
    params.push(filters.month);
  }

  const sortSql = SORT_SQL[filters.sort ?? "date"];
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const text = `
    SELECT event_id, event, city, date_2026,
           start_date::text AS start_date,
           end_date::text   AS end_date,
           date_kind, weekday, organiser_website, email, status, target_tier,
           stall_cost, crowd_size,
           last_contact::text AS last_contact,
           priority, notes, notes_en, updates, updates_en,
           deadline::text AS deadline,
           distance_km, distance_band,
           booked,
           stand_cost::text AS stand_cost,
           hotel_cost::text AS hotel_cost
    FROM events
    ${whereSql}
    ORDER BY ${sortSql}
  `;

  const rows = (await sql.query(text, params)) as EventRow[];
  return rows.map(toEvent);
}

export async function getEvent(eventId: string): Promise<EventModel | null> {
  const rows = (await sql`
    SELECT event_id, event, city, date_2026,
           start_date::text AS start_date,
           end_date::text   AS end_date,
           date_kind, weekday, organiser_website, email, status, target_tier,
           stall_cost, crowd_size,
           last_contact::text AS last_contact,
           priority, notes, notes_en, updates, updates_en,
           deadline::text AS deadline,
           distance_km, distance_band,
           booked,
           stand_cost::text AS stand_cost,
           hotel_cost::text AS hotel_cost
    FROM events
    WHERE event_id = ${eventId}
    LIMIT 1
  `) as EventRow[];
  if (rows.length === 0) return null;
  return toEvent(rows[0]);
}

// Cached read variants for view surfaces (admin Pipeline / Table / Deadlines / Detail
// and future producer-facing views). Tag-busted by EVENTS_CACHE_TAG in actions.
// Do NOT use these inside mutating server actions that need to compare against
// the live row before writing - use the uncached listEvents/getEvent for that.
export const listEventsCached = unstable_cache(
  async (filters: ListFilters = {}) => listEvents(filters),
  ["events-list-v1"],
  { tags: [EVENTS_CACHE_TAG], revalidate: 3600 },
);

export const getEventCached = unstable_cache(
  async (id: string) => getEvent(id),
  ["events-by-id-v1"],
  { tags: [EVENTS_CACHE_TAG], revalidate: 3600 },
);

export interface EventPatch {
  notes?: string;
  notesEn?: string;
  updates?: string;
  updatesEn?: string;
  stallCost?: string;
  crowdSize?: string;
  targetTier?: TargetTier;
  status?: string;
  lastContact?: string | null;
  email?: string;
  organiserWebsite?: string;
  deadline?: string | null;
  booked?: boolean;
  standCost?: number | null;
  hotelCost?: number | null;
}

export async function updateEvent(
  eventId: string,
  patch: EventPatch,
): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  if (patch.notes !== undefined) {
    sets.push(`notes = $${i++}`);
    params.push(patch.notes);
  }
  if (patch.stallCost !== undefined) {
    sets.push(`stall_cost = $${i++}`);
    params.push(patch.stallCost);
  }
  if (patch.crowdSize !== undefined) {
    sets.push(`crowd_size = $${i++}`);
    params.push(patch.crowdSize);
  }
  if (patch.targetTier !== undefined) {
    sets.push(`target_tier = $${i++}`);
    params.push(patch.targetTier);
  }
  if (patch.status !== undefined) {
    sets.push(`status = $${i++}`);
    params.push(patch.status);
  }
  if (patch.lastContact !== undefined) {
    sets.push(`last_contact = $${i++}::date`);
    params.push(patch.lastContact);
  }
  if (patch.email !== undefined) {
    sets.push(`email = $${i++}`);
    params.push(patch.email);
  }
  if (patch.organiserWebsite !== undefined) {
    sets.push(`organiser_website = $${i++}`);
    params.push(patch.organiserWebsite);
  }
  if (patch.deadline !== undefined) {
    sets.push(`deadline = $${i++}::date`);
    params.push(patch.deadline);
  }
  if (patch.notesEn !== undefined) {
    sets.push(`notes_en = $${i++}`);
    params.push(patch.notesEn);
  }
  if (patch.updates !== undefined) {
    sets.push(`updates = $${i++}`);
    params.push(patch.updates);
  }
  if (patch.updatesEn !== undefined) {
    sets.push(`updates_en = $${i++}`);
    params.push(patch.updatesEn);
  }
  if (patch.booked !== undefined) {
    sets.push(`booked = $${i++}`);
    params.push(patch.booked);
  }
  if (patch.standCost !== undefined) {
    sets.push(`stand_cost = $${i++}`);
    params.push(patch.standCost);
  }
  if (patch.hotelCost !== undefined) {
    sets.push(`hotel_cost = $${i++}`);
    params.push(patch.hotelCost);
  }
  if (sets.length === 0) return;
  sets.push(`updated_at = now()`);
  params.push(eventId);
  const text = `UPDATE events SET ${sets.join(", ")} WHERE event_id = $${i}`;
  await sql.query(text, params);
}

function mondayKeyFor(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  const dow = d.getUTCDay();
  const offset = dow === 0 ? 6 : dow - 1;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

const ROLLING_KEY = "rolling";

export function groupByWeekend(
  events: EventModel[],
): { weekKey: string; events: EventModel[] }[] {
  const buckets = new Map<string, EventModel[]>();
  for (const e of events) {
    if (!e.startDate) {
      if (!buckets.has(ROLLING_KEY)) buckets.set(ROLLING_KEY, []);
      buckets.get(ROLLING_KEY)!.push(e);
      continue;
    }
    const startKey = mondayKeyFor(e.startDate);
    const endKey = e.endDate ? mondayKeyFor(e.endDate) : startKey;
    let cursor = startKey;
    while (true) {
      if (!buckets.has(cursor)) buckets.set(cursor, []);
      buckets.get(cursor)!.push(e);
      if (cursor === endKey) break;
      const d = new Date(cursor + "T00:00:00Z");
      d.setUTCDate(d.getUTCDate() + 7);
      cursor = d.toISOString().slice(0, 10);
      if (cursor > endKey) break;
    }
  }
  const keys = Array.from(buckets.keys()).sort((a, b) => {
    if (a === ROLLING_KEY) return 1;
    if (b === ROLLING_KEY) return -1;
    return a.localeCompare(b);
  });
  return keys.map((k) => ({ weekKey: k, events: buckets.get(k)! }));
}

export function formatWeekRange(mondayKey: string): string {
  if (mondayKey === ROLLING_KEY) return "Rolling / recurring";
  const mon = new Date(mondayKey + "T00:00:00Z");
  const sun = new Date(mon);
  sun.setUTCDate(sun.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    });
  return `${fmt(mon)} – ${fmt(sun)}`;
}

// --- Pipeline planner helpers (ported from build_pipeline.py) -----------

export const STATUS_META: Record<string, { label: string; cls: string }> = {
  new: { label: "Waiting", cls: "st-new" },
  "form-link": { label: "Form link", cls: "st-form" },
  priced: { label: "Priced", cls: "st-priced" },
  "pdf-pending": { label: "PDF pending", cls: "st-pdf" },
  "asking-more": { label: "Asking more", cls: "st-asking" },
  confirmed: { label: "Booked", cls: "st-confirmed" },
  declined: { label: "Declined", cls: "st-declined" },
  withdrawn: { label: "Withdrawn", cls: "st-withdrawn" },
  "form-only": { label: "Form only", cls: "st-formonly" },
  unsure: { label: "Unsure", cls: "st-unsure" },
  "low-confidence": { label: "Low-conf", cls: "st-unsure" },
  late: { label: "Late chase", cls: "st-late" },
  "closed-unsure": { label: "Closed", cls: "st-declined" },
  cold: { label: "Cold", cls: "st-cold" },
  refused: { label: "Refused", cls: "st-refused" },
};

export const DISTANCE_CSS: Record<string, string> = {
  "drive 1 day": "d-near",
  weekender: "d-mid",
  "far far away": "d-far",
  unknown: "d-unknown",
};

function parseCrowdN(raw: string): number | null {
  const s = (raw || "").trim().toLowerCase();
  if (!s || s === "?") return null;
  const mK = s.match(/(\d+(?:\.\d+)?)\s*k/);
  if (mK) return Math.round(parseFloat(mK[1]) * 1000);
  const mBig = s.match(/(\d{3,})/);
  if (mBig) return parseInt(mBig[1], 10);
  const mAny = s.match(/(\d+)/);
  if (mAny) {
    const n = parseInt(mAny[1], 10);
    if (/(trader|label|schausteller|designer)/.test(s)) return null;
    return n;
  }
  return null;
}

function crowdScore(e: EventModel): number {
  const n = parseCrowdN(e.crowdSize);
  const raw = (e.crowdSize || "").toLowerCase();
  if (n === null) {
    if (raw.includes("major") || raw.includes("premium")) return 25;
    if (raw.includes("national+intl") || raw.includes("high")) return 20;
    if (raw.includes("medium")) return 12;
    return 5;
  }
  if (n >= 50000) return 40;
  if (n >= 10000) return 30;
  if (n >= 5000) return 22;
  if (n >= 1000) return 14;
  if (n >= 100) return 8;
  return 5;
}

function durationScore(e: EventModel): number {
  if (e.dateKind === "weekly" || e.dateKind === "seasonal") return 0;
  if (e.dateKind === "various" || e.dateKind === "unknown") return 4;
  if (!e.startDate) return 4;
  const start = new Date(e.startDate + "T00:00:00Z").getTime();
  const end = new Date((e.endDate ?? e.startDate) + "T00:00:00Z").getTime();
  const days = Math.round((end - start) / 86_400_000) + 1;
  if (days >= 14) return 15;
  if (days >= 3) return 12;
  if (days === 2) return 10;
  return 5;
}

function fitScore(e: EventModel): number {
  const t = `${e.event} ${e.notes}`.toLowerCase();
  if (
    /(hot sauce|chili|chilli|streetfood|street food|vegan|food week|food festival)/.test(
      t,
    )
  )
    return 20;
  if (/(eat|geschmack|kulinarisch|essen)/.test(t)) return 15;
  if (/(weihnacht|xmas|weihnachtsmarkt|winter)/.test(t)) return 12;
  if (/(bauern|markt|wochenmarkt)/.test(t)) return 10;
  if (/design/.test(t)) return 8;
  return 8;
}

function statusBonus(s: string): number {
  if (s === "confirmed") return 25;
  if (REPLIED.has(s)) return 15;
  if (s === "new") return 5;
  if (s === "cold") return 2;
  if (INACTIVE.has(s)) return -100;
  return 0;
}

export interface TierBreakdown {
  crowd: number;
  duration: number;
  fit: number;
  status: number;
  distance: number;
  total: number;
}

export function scoreEvent(e: EventModel): TierBreakdown {
  const crowd = crowdScore(e);
  const duration = durationScore(e);
  const fit = fitScore(e);
  const status = statusBonus(e.status);
  const distance = DISTANCE_PENALTY[e.distanceBand] ?? -15;
  return {
    crowd,
    duration,
    fit,
    status,
    distance,
    total: crowd + duration + fit + status + distance,
  };
}

export type Tier = "S" | "A" | "B" | "C";

export function tierForEvent(e: EventModel, total?: number): Tier {
  if (e.status === "confirmed") return "S";
  const t = total ?? scoreEvent(e).total;
  if (t >= 75) return "S";
  if (t >= 60) return "A";
  if (t >= 40) return "B";
  return "C";
}

const TIER_ORDER: Record<Tier, number> = { S: 0, A: 1, B: 2, C: 3 };

export function tierSortCmp(a: EventModel, b: EventModel): number {
  const sa = scoreEvent(a);
  const sb = scoreEvent(b);
  const ta = TIER_ORDER[tierForEvent(a, sa.total)];
  const tb = TIER_ORDER[tierForEvent(b, sb.total)];
  if (ta !== tb) return ta - tb;
  if (sa.total !== sb.total) return sb.total - sa.total;
  const da = a.startDate ?? "9999-12-31";
  const db = b.startDate ?? "9999-12-31";
  if (da !== db) return da.localeCompare(db);
  return a.event.localeCompare(b.event);
}

export function actionFor(e: EventModel): string {
  const s = e.status;
  if (s === "new") return "Awaiting reply";
  if (s === "form-link" || s === "form-only")
    return e.deadline ? `Apply via form by ${e.deadline}` : "Apply via form";
  if (s === "priced") return "Decide + reply";
  if (s === "asking-more") return "Reply with details";
  if (s === "pdf-pending") return "Read PDF + extract price";
  if (s === "confirmed") return "Locked";
  if (INACTIVE.has(s)) return "";
  if (s === "unsure") return "Investigate contact";
  if (s === "low-confidence") return "Reach better contact";
  if (s === "late") return "Chase fast";
  return "";
}

export function outreachIcon(
  e: EventModel,
): { glyph: "↗" | "↙" | "✓"; cls: string; title: string } | null {
  const s = e.status;
  if (s === "confirmed")
    return { glyph: "✓", cls: "oi-booked", title: "Booked" };
  if (REPLIED.has(s) || INACTIVE.has(s))
    return { glyph: "↙", cls: "oi-reply", title: "Reply received" };
  if ((s === "new" || s === "late") && e.lastContact)
    return { glyph: "↗", cls: "oi-sent", title: "Sent, awaiting reply" };
  return null;
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00Z").getTime();
  const today = Date.now();
  return Math.round((d - today) / 86_400_000);
}

export function formatDateRange(e: EventModel): string {
  if (e.dateKind === "weekly") return `Every ${e.weekday}`;
  if (e.dateKind === "seasonal") return `Seasonal ${e.weekday}`;
  if (e.dateKind === "various") return "Year-round portfolio";
  if (e.dateKind === "unknown" || !e.startDate) return "TBC";
  const start = new Date(e.startDate + "T00:00:00Z");
  const end = e.endDate ? new Date(e.endDate + "T00:00:00Z") : start;
  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCFullYear() === end.getUTCFullYear();
  const monShort = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  if (end.getTime() !== start.getTime()) {
    if (sameMonth)
      return `${start.getUTCDate()}–${end.getUTCDate()} ${monShort(start)}`;
    return `${start.getUTCDate()} ${monShort(start)} – ${end.getUTCDate()} ${monShort(end)}`;
  }
  return `${start.getUTCDate()} ${monShort(start)}`;
}

export interface WeekWindow {
  start: string;   // Monday ISO date
  end: string;     // Sunday ISO date
  isoWeek: number;
  label: string;
  monthHead: string | null;
  events: EventModel[];
  deadlinesDue: EventModel[]; // events whose deadline falls in this week
  kind: "locked" | "busy" | "pipeline" | "free";
  hasConflict: boolean;
}

function isoWeekOf(d: Date): number {
  const target = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff =
    (target.getTime() - firstThursday.getTime()) / 86_400_000;
  return 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
}

function weekLabel(mon: Date, sun: Date): string {
  const wd = (d: Date) =>
    d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
  const mo = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const sameMonth =
    mon.getUTCMonth() === sun.getUTCMonth() &&
    mon.getUTCFullYear() === sun.getUTCFullYear();
  if (sameMonth)
    return `${wd(mon)} ${mon.getUTCDate()}–${wd(sun)} ${sun.getUTCDate()} ${mo(mon)}`;
  return `${wd(mon)} ${mon.getUTCDate()} ${mo(mon)} – ${wd(sun)} ${sun.getUTCDate()} ${mo(sun)}`;
}

function classifyWeek(events: EventModel[]): {
  kind: "locked" | "busy" | "pipeline" | "free";
  hasConflict: boolean;
} {
  if (events.length === 0) return { kind: "free", hasConflict: false };
  const statuses = events.map((e) => e.status);
  const locked = statuses.includes("confirmed");
  const scheduled = statuses.filter((s) => SCHEDULED.has(s));
  if (locked)
    return { kind: "locked", hasConflict: scheduled.length > 1 };
  if (scheduled.length > 0)
    return { kind: "busy", hasConflict: scheduled.length > 1 };
  return { kind: "pipeline", hasConflict: false };
}

export interface PipelineBuckets {
  weeks: WeekWindow[];
  weeklyRecurring: EventModel[];
  portfolio: EventModel[];
  inactive: EventModel[];
  archivedByDeadline: EventModel[];
  funnel: {
    waiting: number;
    replied: number;
    booked: number;
    inactive: number;
    blocked: number;
  };
  urgent: { event: EventModel; days: number; action: string }[];
  conflicts: { booked: EventModel; clash: EventModel }[];
}

const STILL_OURS_TO_ACT_LIB = new Set([
  "cold",
  "new",
  "late",
  "form-only",
  "unsure",
  "low-confidence",
]);

export function buildPipeline(
  events: EventModel[],
  today: Date = new Date(),
  end: Date = new Date(Date.UTC(2026, 11, 31)),
): PipelineBuckets {
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const todayStr = todayUtc.toISOString().slice(0, 10);
  const datedActive: EventModel[] = [];
  const weeklyRecurring: EventModel[] = [];
  const portfolio: EventModel[] = [];
  const inactive: EventModel[] = [];
  const archivedByDeadline: EventModel[] = [];

  for (const e of events) {
    if (INACTIVE.has(e.status)) {
      inactive.push(e);
      continue;
    }
    // Auto-archive: deadline passed AND still ours to act AND not booked
    // AND not a priority (we_want_to_go / priority_for_us still need decisions).
    // Tucks rotted cold leads into an archived bucket without hiding live decisions.
    const isPriorityTier =
      e.targetTier === "we_want_to_go" || e.targetTier === "priority_for_us";
    if (
      e.deadline &&
      e.deadline < todayStr &&
      STILL_OURS_TO_ACT_LIB.has(e.status) &&
      !e.booked &&
      !isPriorityTier
    ) {
      archivedByDeadline.push(e);
      continue;
    }
    if (e.dateKind === "weekly" || e.dateKind === "seasonal") {
      weeklyRecurring.push(e);
      continue;
    }
    if (e.dateKind === "various" || e.dateKind === "unknown" || !e.startDate) {
      portfolio.push(e);
      continue;
    }
    datedActive.push(e);
  }

  // full weeks from this Monday to end
  const weeks: WeekWindow[] = [];
  let d = new Date(todayUtc);
  // Roll back to Monday of the current week
  const dow = d.getUTCDay(); // 0 Sun .. 6 Sat
  const offsetToMon = dow === 0 ? 6 : dow - 1;
  d.setUTCDate(d.getUTCDate() - offsetToMon);
  let curMonth = -1;
  let curYear = -1;
  while (d.getTime() <= end.getTime()) {
    const mon = new Date(d);
    const sun = new Date(d);
    sun.setUTCDate(sun.getUTCDate() + 6);
    const monStr = mon.toISOString().slice(0, 10);
    const sunStr = sun.toISOString().slice(0, 10);

    let evs = datedActive.filter((e) => {
      if (!e.startDate) return false;
      const es = e.startDate;
      const ee = e.endDate ?? e.startDate;
      return es <= sunStr && ee >= monStr;
    });
    evs.sort(tierSortCmp);
    if (evs.some((e) => e.status === "confirmed")) {
      evs = evs.filter((e) => e.status === "confirmed");
    }
    const klass = classifyWeek(evs);

    // Deadlines DUE this week: every still-actionable event whose deadline
    // date falls within [monStr, sunStr], no matter when the event itself is.
    const deadlinesDue = events
      .filter(
        (e) =>
          e.deadline != null &&
          e.deadline >= monStr &&
          e.deadline <= sunStr &&
          !INACTIVE.has(e.status) &&
          !e.booked,
      )
      .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));

    let monthHead: string | null = null;
    if (mon.getUTCMonth() !== curMonth || mon.getUTCFullYear() !== curYear) {
      curMonth = mon.getUTCMonth();
      curYear = mon.getUTCFullYear();
      monthHead = mon.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    }

    weeks.push({
      start: monStr,
      end: sunStr,
      isoWeek: isoWeekOf(mon),
      label: weekLabel(mon, sun),
      monthHead,
      events: evs,
      deadlinesDue,
      kind: klass.kind,
      hasConflict: klass.hasConflict,
    });
    d.setUTCDate(d.getUTCDate() + 7);
  }

  // funnel
  const funnel = {
    waiting: events.filter((e) => e.status === "new").length,
    replied: events.filter((e) => REPLIED.has(e.status)).length,
    booked: events.filter((e) => e.status === "confirmed").length,
    inactive: events.filter((e) => INACTIVE.has(e.status)).length,
    blocked: events.filter((e) => BLOCKED.has(e.status)).length,
  };

  // urgent: deadlines in 0-14 days, not inactive
  const urgent: { event: EventModel; days: number; action: string }[] = [];
  for (const e of events) {
    const days = daysUntil(e.deadline);
    if (days === null || days < 0 || days > 14 || INACTIVE.has(e.status))
      continue;
    urgent.push({ event: e, days, action: actionFor(e) || "review" });
  }
  urgent.sort((a, b) => a.days - b.days);

  // conflicts: booked event window overlaps another scheduled event window
  const conflicts: { booked: EventModel; clash: EventModel }[] = [];
  const confirmed = events.filter((e) => e.status === "confirmed");
  for (const c of confirmed) {
    if (!c.startDate) continue;
    const cs = c.startDate;
    const ce = c.endDate ?? c.startDate;
    for (const r of events) {
      if (r.eventId === c.eventId) continue;
      if (INACTIVE.has(r.status) || r.status === "confirmed") continue;
      if (!SCHEDULED.has(r.status)) continue;
      if (!r.startDate) continue;
      const rs = r.startDate;
      const re = r.endDate ?? r.startDate;
      if (rs <= ce && re >= cs) {
        conflicts.push({ booked: c, clash: r });
      }
    }
  }

  return {
    weeks,
    weeklyRecurring: [...weeklyRecurring].sort(tierSortCmp),
    portfolio: [...portfolio].sort(tierSortCmp),
    inactive: [...inactive].sort(tierSortCmp),
    archivedByDeadline: [...archivedByDeadline].sort(tierSortCmp),
    funnel,
    urgent,
    conflicts,
  };
}
