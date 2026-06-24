import Link from "next/link";
import {
  listEvents,
  actionFor,
  formatDateRange,
  daysUntil,
  STATUS_META,
  type EventModel,
} from "@/lib/events";

const INACTIVE = new Set(["declined", "withdrawn", "closed-unsure"]);

const PAGE_CSS = `
.dlpage { font-family: var(--font-inter), system-ui, -apple-system, sans-serif; color: var(--ink); background: #fafaf7; padding: 32px 22px 96px; }
.dlpage-wrap { max-width: 1100px; margin: 0 auto; font-size: 13.5px; line-height: 1.55; }
.dlpage-eyebrow { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; color: var(--muted); margin: 0 0 8px; }
.dlpage h1 { font-size: 32px; line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 8px; color: var(--ink); }
.dlpage h1 .dot { color: var(--accent); margin-left: 2px; }
.dlpage-header { border-bottom: 1px solid var(--rule); padding-bottom: 22px; margin-bottom: 22px; }
.dlpage-lede { font-size: 14px; color: var(--muted); margin: 0; max-width: 60ch; line-height: 1.55; }
.dl-section { margin: 28px 0; }
.dl-section h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); margin: 0 0 10px; border-bottom: 1px solid var(--rule); padding-bottom: 6px; }
.dl-section.dl-overdue h2 { color: #a01a12; border-bottom-color: #f4b7b1; }
.dl-section.dl-week h2    { color: #c8261c; border-bottom-color: #f4b7b1; }
.dl-section.dl-2w h2      { color: #d97706; border-bottom-color: #f6d9a8; }
.dl-section.dl-30 h2      { color: #b88a1e; border-bottom-color: #ebd29a; }
.dl-section.dl-later h2   { color: #888; }
.dl-row { display: grid; grid-template-columns: 110px 80px 1fr 100px 140px; gap: 14px; align-items: center; padding: 12px 14px; border-radius: 4px; background: #fff; border: 1px solid var(--rule); border-left: 3px solid var(--rule); text-decoration: none; color: var(--ink); margin: 6px 0; transition: background-color 0.12s ease; }
.dl-row:hover { background: #fcfbf7; }
.dl-row.tier-locked { border-left-color: #2a6b3f; background: #fbfdfb; }
.dl-row.tier-target { border-left-color: var(--accent); background: #fffaf6; }
.dl-row.tier-skip   { opacity: 0.45; }
.dl-row.tier-watching { border-left-color: var(--rule); }
.dl-row.tier-watching .dl-tier { visibility: hidden; }
.dl-date { font-weight: 600; font-variant-numeric: tabular-nums; font-size: 13px; color: var(--ink); }
.dl-rel { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 3px; text-align: center; letter-spacing: 0.02em; line-height: 1.3; }
.dl-rel.r-past  { background: #ededed; color: #888; text-decoration: line-through; }
.dl-rel.r-soon  { background: #fde8e6; color: #a01a12; }
.dl-rel.r-near  { background: #fff1de; color: #d97706; }
.dl-rel.r-mid   { background: #fff7ec; color: #b88a1e; }
.dl-rel.r-later { background: #f5f5f5; color: #666; }
.dl-main { min-width: 0; }
.dl-main .dl-ename { font-weight: 600; font-size: 14px; line-height: 1.35; color: var(--ink); }
.dl-main .dl-meta  { font-size: 11.5px; color: var(--muted); margin-top: 3px; line-height: 1.45; }
.dl-tier { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 8px; border-radius: 3px; text-align: center; line-height: 1.3; }
.dl-tier.t-locked   { background: #2a6b3f; color: #fff; }
.dl-tier.t-target   { background: var(--accent); color: #fff; }
.dl-tier.t-watching { background: transparent; color: var(--muted-soft); }
.dl-tier.t-skip     { background: #f5f5f5; color: #888; }
.dl-action { font-size: 11px; color: var(--muted); font-weight: 500; font-style: italic; margin-top: 4px; }
.dl-status { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 600; border: 1px solid var(--rule); white-space: nowrap; }
.st-new       { background: #e3f3f5; color: #1f6470; border-color: #b1d8de; }
.st-form      { background: #fff1de; color: #d97706; border-color: #f6d9a8; }
.st-priced    { background: #e5f3e9; color: #2a6b3f; border-color: #b8dcc1; }
.st-pdf       { background: #efe6f5; color: #6b3aa1; border-color: #d4bfe2; }
.st-asking    { background: #e3ecf5; color: #1f4d7c; border-color: #b5c7df; }
.st-confirmed { background: #2a6b3f; color: #fff; border-color: #2a6b3f; }
.st-formonly  { background: #f5f5f5; color: #555; border-color: #ddd; }
.st-unsure    { background: #fff7ec; color: #b88a1e; border-color: #ebd29a; }
.st-late      { background: #fde8e6; color: #c8261c; border-color: #f4b7b1; }
.st-cold      { background: #f0eee8; color: #666; border-color: #d8d4ca; }
.dl-empty { color: var(--muted-soft); font-style: italic; padding: 10px 0; font-size: 12.5px; }
.dl-counts { display: flex; gap: 20px; margin-top: 14px; font-size: 12px; color: var(--muted); }
.dl-counts b { color: var(--ink); font-weight: 600; margin-right: 2px; }
`;

interface Bucket {
  key: string;
  label: string;
  cls: string;
  rows: EventModel[];
}

function bucketFor(days: number): string {
  if (days < 0) return "overdue";
  if (days <= 7) return "week";
  if (days <= 14) return "2w";
  if (days <= 30) return "30";
  return "later";
}

function relCls(days: number): string {
  if (days < 0) return "r-past";
  if (days <= 7) return "r-soon";
  if (days <= 14) return "r-near";
  if (days <= 30) return "r-mid";
  return "r-later";
}

function relLabel(days: number): string {
  if (days < 0) return `${-days}d ago`;
  if (days === 0) return "today";
  return `${days}d`;
}

function tierLabel(t: string): string {
  if (t === "we_want_to_go") return "★ Going";
  if (t === "priority_for_us") return "● Priority";
  if (t === "not_interested") return "× Skip";
  return "—";
}

export default async function DeadlinesPage() {
  const all = await listEvents({});
  const rows: { e: EventModel; days: number }[] = [];
  for (const e of all) {
    if (INACTIVE.has(e.status)) continue;
    if (!e.deadline) continue;
    const days = daysUntil(e.deadline);
    if (days === null) continue;
    rows.push({ e, days });
  }
  rows.sort((a, b) => a.days - b.days);

  const buckets: Bucket[] = [
    { key: "overdue", label: "Overdue", cls: "dl-overdue", rows: [] },
    { key: "week", label: "This week (≤7d)", cls: "dl-week", rows: [] },
    { key: "2w", label: "Next 14 days", cls: "dl-2w", rows: [] },
    { key: "30", label: "Next 30 days", cls: "dl-30", rows: [] },
    { key: "later", label: "Later (>30d)", cls: "dl-later", rows: [] },
  ];
  const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
  for (const r of rows) byKey[bucketFor(r.days)].rows.push(r.e);

  const targetCount = rows.filter(
    (r) =>
      r.e.targetTier === "we_want_to_go" ||
      r.e.targetTier === "priority_for_us",
  ).length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="dlpage">
        <div className="dlpage-wrap">
          <header className="dlpage-header">
            <p className="dlpage-eyebrow">European Heat Council · Admin</p>
            <h1>
              Application deadlines<span className="dot">.</span>
            </h1>
            <p className="dlpage-lede">
              Sorted by urgency. Targets and locked events show a coloured
              bar and a Target/Locked badge; everything else is unmarked.
            </p>
            <div className="dl-counts">
              <span>
                <b>{rows.length}</b> total
              </span>
              <span>
                <b>{targetCount}</b> target / locked
              </span>
              <span>
                <b>{byKey.overdue.rows.length}</b> overdue
              </span>
              <span>
                <b>{byKey.week.rows.length}</b> this week
              </span>
            </div>
          </header>

          {buckets.map((b) => (
            <section key={b.key} className={`dl-section ${b.cls}`}>
              <h2>
                {b.label} <span style={{ color: "#aaa" }}>({b.rows.length})</span>
              </h2>
              {b.rows.length === 0 ? (
                <p className="dl-empty">Nothing here.</p>
              ) : (
                b.rows.map((e) => {
                  const days = daysUntil(e.deadline)!;
                  const meta =
                    STATUS_META[e.status] ?? { label: e.status, cls: "st-unknown" };
                  return (
                    <Link
                      key={e.eventId}
                      href={`/admin/events/${e.eventId}`}
                      className={`dl-row tier-${e.targetTier}`}
                    >
                      <span className="dl-date">{e.deadline}</span>
                      <span className={`dl-rel ${relCls(days)}`}>{relLabel(days)}</span>
                      <div className="dl-main">
                        <div className="dl-ename">{e.event}</div>
                        <div className="dl-meta">
                          {e.city} · {formatDateRange(e)}
                          {e.stallCost && e.stallCost !== "?" ? ` · ${e.stallCost}` : ""}
                        </div>
                      </div>
                      <span className={`dl-tier t-${e.targetTier}`}>
                        {tierLabel(e.targetTier)}
                      </span>
                      <div>
                        <span className={`dl-status ${meta.cls}`}>{meta.label}</span>
                        {actionFor(e) ? (
                          <div className="dl-action">{actionFor(e)}</div>
                        ) : null}
                      </div>
                    </Link>
                  );
                })
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
