import Link from "next/link";
import {
  listEvents,
  STATUS_VALUES,
  DISTANCE_BANDS,
  TARGET_TIERS,
  TARGET_TIER_LABELS,
  type SortKey,
  type EventModel,
} from "@/lib/events";

const MONTHS = [
  { v: "", label: "Any month" },
  { v: "1", label: "Jan" },
  { v: "2", label: "Feb" },
  { v: "3", label: "Mar" },
  { v: "4", label: "Apr" },
  { v: "5", label: "May" },
  { v: "6", label: "Jun" },
  { v: "7", label: "Jul" },
  { v: "8", label: "Aug" },
  { v: "9", label: "Sep" },
  { v: "10", label: "Oct" },
  { v: "11", label: "Nov" },
  { v: "12", label: "Dec" },
];

const SORTS: { v: SortKey; label: string }[] = [
  { v: "date", label: "Date" },
  { v: "distance", label: "Distance" },
  { v: "crowd", label: "Crowd" },
  { v: "tier", label: "Tier" },
  { v: "status", label: "Status" },
  { v: "name", label: "Name" },
];

function tierBadge(t: string) {
  const map: Record<string, string> = {
    we_want_to_go: "bg-[#2a6b3f] text-white",
    priority_for_us: "bg-[#d97706] text-white",
    potential: "bg-rule-soft text-muted",
    not_interested: "bg-rule-soft text-muted-soft line-through",
  };
  const label = TARGET_TIER_LABELS[t as keyof typeof TARGET_TIER_LABELS] ?? t;
  return (
    <span
      className={`inline-block text-[11px] px-2 py-0.5 rounded-sm ${map[t] ?? "text-muted"}`}
    >
      {label}
    </span>
  );
}

function statusBadge(s: string) {
  const tone: Record<string, string> = {
    confirmed: "bg-[#d8efde] text-[#1f4d2d]",
    "form-link": "bg-[#fff1de] text-[#7a4a10]",
    priced: "bg-[#fff1de] text-[#7a4a10]",
    "asking-more": "bg-[#fff1de] text-[#7a4a10]",
    "pdf-pending": "bg-[#fff1de] text-[#7a4a10]",
    new: "bg-[#e3f3f5] text-[#1f6470]",
    late: "bg-[#e3f3f5] text-[#1f6470]",
    cold: "bg-[#f5f3ed] text-[#7a6f50]",
    "form-only": "bg-rule-soft text-muted",
    unsure: "bg-rule-soft text-muted",
    "low-confidence": "bg-rule-soft text-muted",
    declined: "bg-[#f3dada] text-[#7a2424]",
    withdrawn: "bg-[#f3dada] text-[#7a2424]",
    "closed-unsure": "bg-rule-soft text-muted",
    refused: "bg-[#fde8e6] text-[#a01a12]",
  };
  return (
    <span
      className={`inline-block text-[11px] px-2 py-0.5 rounded-sm ${tone[s] ?? "bg-rule-soft text-muted"}`}
    >
      {s || "—"}
    </span>
  );
}

function formatDate(e: EventModel): string {
  if (e.dateKind === "weekly") return `Weekly · ${e.weekday}`;
  if (e.dateKind === "seasonal") return `Seasonal · ${e.weekday}`;
  if (e.dateKind === "various") return "Various";
  if (e.dateKind === "unknown") return "TBC";
  if (e.startDate && e.endDate && e.startDate !== e.endDate)
    return `${e.startDate} → ${e.endDate}`;
  return e.startDate ?? "—";
}

function formatDistance(km: number | null, band: string): string {
  if (km == null) return band || "—";
  return `${km} km`;
}

type SP = Promise<{
  band?: string;
  status?: string;
  month?: string;
  tier?: string;
  sort?: string;
}>;

export default async function EventsListPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const month = sp.month ? Number(sp.month) : undefined;
  const sort = (sp.sort as SortKey) || "date";
  const events = await listEvents({
    distanceBand: sp.band || undefined,
    status: sp.status || undefined,
    tier: sp.tier || undefined,
    month: Number.isFinite(month) ? month : undefined,
    sort,
  });

  const counts = {
    total: events.length,
    going: events.filter((e) => e.targetTier === "we_want_to_go").length,
    priority: events.filter((e) => e.targetTier === "priority_for_us").length,
    confirmed: events.filter((e) => e.status === "confirmed").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between gap-6 mb-6">
        <div>
          <p className="label text-muted">EHC · Pipeline</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Events
          </h1>
        </div>
        <div className="flex gap-6 text-xs text-muted">
          <div>
            <span className="block text-[11px] uppercase tracking-wider">
              Total
            </span>
            <span className="text-base text-ink font-medium">
              {counts.total}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider">
              Going
            </span>
            <span className="text-base text-ink font-medium">
              {counts.going}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider">
              Priority
            </span>
            <span className="text-base text-ink font-medium">
              {counts.priority}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider">
              Confirmed
            </span>
            <span className="text-base text-ink font-medium">
              {counts.confirmed}
            </span>
          </div>
        </div>
      </div>

      <form
        method="GET"
        className="mb-6 grid grid-cols-2 sm:grid-cols-6 gap-3 items-end p-4 bg-paper-green rounded-sm"
      >
        <label className="text-xs text-muted">
          Distance
          <select
            name="band"
            defaultValue={sp.band ?? ""}
            className="mt-1 w-full bg-white border border-rule px-2 py-1 text-sm text-ink"
          >
            <option value="">Any</option>
            {DISTANCE_BANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Status
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="mt-1 w-full bg-white border border-rule px-2 py-1 text-sm text-ink"
          >
            <option value="">Any</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Tier
          <select
            name="tier"
            defaultValue={sp.tier ?? ""}
            className="mt-1 w-full bg-white border border-rule px-2 py-1 text-sm text-ink"
          >
            <option value="">Any</option>
            {TARGET_TIERS.map((t) => (
              <option key={t} value={t}>
                {TARGET_TIER_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Month
          <select
            name="month"
            defaultValue={sp.month ?? ""}
            className="mt-1 w-full bg-white border border-rule px-2 py-1 text-sm text-ink"
          >
            {MONTHS.map((m) => (
              <option key={m.v} value={m.v}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Sort
          <select
            name="sort"
            defaultValue={sort}
            className="mt-1 w-full bg-white border border-rule px-2 py-1 text-sm text-ink"
          >
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-ink text-white rounded-sm hover:bg-ink-deep"
          >
            Apply
          </button>
          <Link
            href="/admin/events"
            className="px-3 py-1.5 text-sm border border-rule text-muted rounded-sm hover:text-ink"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[11px] uppercase tracking-wider text-muted border-b border-rule">
        <div className="col-span-2">Date</div>
        <div className="col-span-3">Event</div>
        <div className="col-span-2">City</div>
        <div className="col-span-1 text-right">Dist</div>
        <div className="col-span-1 text-right">Crowd</div>
        <div className="col-span-1 text-right">Stall</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Tier</div>
      </div>

      <ol className="divide-y divide-rule">
        {events.map((e) => (
          <li key={e.eventId} className="py-3 px-3 hover:bg-paper-green">
            <Link
              href={`/admin/events/${e.eventId}`}
              className="grid grid-cols-12 gap-3 items-baseline text-sm text-ink"
            >
              <div className="col-span-2 text-muted">{formatDate(e)}</div>
              <div className="col-span-3 font-medium">{e.event}</div>
              <div className="col-span-2 text-muted">{e.city || "—"}</div>
              <div className="col-span-1 text-right text-muted">
                {formatDistance(e.distanceKm, e.distanceBand)}
              </div>
              <div className="col-span-1 text-right text-muted">
                {e.crowdSize || "—"}
              </div>
              <div className="col-span-1 text-right text-muted">
                {e.stallCost || "—"}
              </div>
              <div className="col-span-1">{statusBadge(e.status)}</div>
              <div className="col-span-1">{tierBadge(e.targetTier)}</div>
            </Link>
          </li>
        ))}
      </ol>

      {events.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          No events match these filters.
        </p>
      ) : null}
    </div>
  );
}
