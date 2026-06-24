import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEvent,
  listEvents,
  TARGET_TIERS,
  TARGET_TIER_LABELS,
  STATUS_VALUES,
  type EventModel,
} from "@/lib/events";
import { updateEventAction } from "../actions";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ saved?: string }>;

function formatDate(e: EventModel): string {
  if (e.dateKind === "weekly") return `Weekly · ${e.weekday}`;
  if (e.dateKind === "seasonal") return `Seasonal · ${e.weekday}`;
  if (e.dateKind === "various") return "Various";
  if (e.dateKind === "unknown") return "TBC";
  if (e.startDate && e.endDate && e.startDate !== e.endDate)
    return `${e.startDate} → ${e.endDate}`;
  return e.startDate ?? "—";
}

function mondayKeyFor(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  const dow = d.getUTCDay();
  const offset = dow === 0 ? 6 : dow - 1;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const e = await getEvent(id);
  if (!e) notFound();

  const all = e.startDate ? await listEvents({}) : [];
  const myKey = e.startDate ? mondayKeyFor(e.startDate) : null;
  const sameWeekend = myKey
    ? all.filter(
        (x) =>
          x.eventId !== e.eventId &&
          x.startDate &&
          mondayKeyFor(x.startDate) === myKey,
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/admin/events"
        className="label text-muted hover:text-ink"
      >
        ← All events
      </Link>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
        {e.event}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {e.city || "—"} · {formatDate(e)}
        {e.distanceKm != null ? ` · ${e.distanceKm} km from Berlin` : ""}
      </p>

      {saved ? (
        <p className="mt-4 inline-block text-xs px-2 py-1 bg-[#d8efde] text-[#1f4d2d]">
          Saved.
        </p>
      ) : null}

      <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <p className="label text-muted">Event ID</p>
          <p className="mt-1 text-ink font-mono text-xs">{e.eventId}</p>
        </div>
        <div>
          <p className="label text-muted">Distance band</p>
          <p className="mt-1 text-ink">{e.distanceBand || "—"}</p>
        </div>
        <div>
          <p className="label text-muted">Deadline</p>
          <p className="mt-1 text-ink">{e.deadline || "—"}</p>
        </div>
        <div>
          <p className="label text-muted">Date (raw)</p>
          <p className="mt-1 text-ink">{e.date2026 || "—"}</p>
        </div>
        <div>
          <p className="label text-muted">Priority (legacy)</p>
          <p className="mt-1 text-ink">{e.priority ?? "—"}</p>
        </div>
        <div>
          <p className="label text-muted">Organiser website</p>
          <p className="mt-1 text-ink break-all">
            {e.organiserWebsite ? (
              <a
                href={
                  e.organiserWebsite.startsWith("http")
                    ? e.organiserWebsite
                    : `https://${e.organiserWebsite}`
                }
                target="_blank"
                rel="noopener nofollow"
                className="hover:text-accent"
              >
                {e.organiserWebsite}
              </a>
            ) : (
              "—"
            )}
          </p>
        </div>
      </section>

      <form
        action={updateEventAction}
        className="mt-10 space-y-6 p-6 bg-paper-green rounded-sm"
      >
        <input type="hidden" name="id" value={e.eventId} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="text-xs text-muted">
            Target tier
            <select
              name="target_tier"
              defaultValue={e.targetTier}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
            >
              {TARGET_TIERS.map((t) => (
                <option key={t} value={t}>
                  {TARGET_TIER_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs text-muted">
            Status
            <select
              name="status"
              defaultValue={e.status}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
            >
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs text-muted">
            Stand cost (€)
            <input
              type="number"
              step="0.01"
              name="stand_cost"
              defaultValue={e.standCost ?? ""}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
              placeholder="e.g. 350"
            />
          </label>

          <label className="text-xs text-muted">
            Hotel cost (€)
            <input
              type="number"
              step="0.01"
              name="hotel_cost"
              defaultValue={e.hotelCost ?? ""}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
              placeholder="e.g. 120"
            />
          </label>

          <label className="text-xs text-muted flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              name="booked"
              defaultChecked={e.booked}
              className="h-4 w-4"
            />
            <span className="text-ink">Booked</span>
          </label>

          <label className="text-xs text-muted">
            Stall cost (legacy free-text)
            <input
              name="stall_cost"
              defaultValue={e.stallCost}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
              placeholder="e.g. 350 EUR / ? / free"
            />
          </label>

          <label className="text-xs text-muted">
            Crowd size
            <input
              name="crowd_size"
              defaultValue={e.crowdSize}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
              placeholder="e.g. 5k/day"
            />
          </label>

          <label className="text-xs text-muted">
            Email
            <input
              name="email"
              defaultValue={e.email}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
              placeholder="organiser email or FORM-ONLY / UNSURE"
            />
          </label>

          <label className="text-xs text-muted">
            Organiser website
            <input
              name="organiser_website"
              defaultValue={e.organiserWebsite}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
            />
          </label>

          <label className="text-xs text-muted">
            Last contact
            <input
              type="date"
              name="last_contact"
              defaultValue={e.lastContact ?? ""}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
            />
          </label>

          <label className="text-xs text-muted">
            Deadline
            <input
              type="date"
              name="deadline"
              defaultValue={e.deadline ?? ""}
              className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink"
            />
          </label>
        </div>

        <label className="block text-xs text-muted">
          Notes
          <textarea
            name="notes"
            defaultValue={e.notes}
            rows={6}
            className="mt-1 w-full bg-white border border-rule px-2 py-1.5 text-sm text-ink font-mono"
          />
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-ink text-white rounded-sm hover:bg-ink-deep"
          >
            Save
          </button>
        </div>
      </form>

      {sameWeekend.length > 0 ? (
        <section className="mt-12">
          <h2 className="label text-muted">Same weekend</h2>
          <ol className="mt-4 divide-y divide-rule border-t border-rule">
            {sameWeekend.map((x) => (
              <li key={x.eventId} className="py-3">
                <Link
                  href={`/admin/events/${x.eventId}`}
                  className="grid grid-cols-12 gap-3 items-baseline text-sm text-ink hover:bg-paper-green"
                >
                  <div className="col-span-3 text-muted">{formatDate(x)}</div>
                  <div className="col-span-4 font-medium">{x.event}</div>
                  <div className="col-span-3 text-muted">{x.city || "—"}</div>
                  <div className="col-span-2 text-right text-muted text-xs">
                    {TARGET_TIER_LABELS[x.targetTier]} · {x.status}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
