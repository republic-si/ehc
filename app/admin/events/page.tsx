import Link from "next/link";
import {
  ExternalLink,
  Send,
  Inbox,
  CheckCircle2,
  Languages,
} from "lucide-react";
import {
  listEvents,
  buildPipeline,
  scoreEvent,
  tierForEvent,
  actionFor,
  outreachIcon,
  formatDateRange,
  daysUntil,
  DISTANCE_CSS,
  STATUS_META,
  TARGET_TIERS,
  TARGET_TIER_LABELS,
  type EventModel,
  type Tier,
  type WeekWindow,
} from "@/lib/events";
import { NotInterestedButton } from "./_components/NotInterestedButton";

function organiserHref(raw: string): string {
  const t = raw.trim();
  return t.startsWith("http") ? t : `https://${t}`;
}

function OutreachGlyph({ glyph }: { glyph: "↗" | "↙" | "✓" }) {
  if (glyph === "↗") return <Send size={11} aria-hidden="true" />;
  if (glyph === "↙") return <Inbox size={11} aria-hidden="true" />;
  return <CheckCircle2 size={12} aria-hidden="true" />;
}

const PIPELINE_CSS = `
.plan { font-family: var(--font-inter), system-ui, -apple-system, sans-serif; color: var(--ink); background: #fafaf7; padding: 32px 22px 96px; }
.plan-wrap { max-width: 1280px; margin: 0 auto; font-size: 13.5px; line-height: 1.55; }
.plan-eyebrow { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; color: var(--muted); margin: 0 0 8px; }
.plan h1 { font-size: 32px; line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 8px; color: var(--ink); }
.plan h1 .dot { color: var(--accent); margin-left: 2px; }
.plan-header { border-bottom: 1px solid var(--rule); padding-bottom: 22px; margin-bottom: 22px; }
.plan-lede { font-size: 14px; color: var(--muted); margin: 0; max-width: 60ch; line-height: 1.55; }
.plan-built { font-size: 11px; color: var(--muted-soft); margin-top: 6px; letter-spacing: 0.02em; }
.plan-funnel { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 16px; }
.plan-chip { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid var(--rule); background: #fff; letter-spacing: 0.01em; }
.chip-waiting { background: #e3f3f5; color: #1f6470; border-color: #b1d8de; }
.chip-replied { background: #fff1de; color: #d97706; border-color: #f6d9a8; }
.chip-booked  { background: #2a6b3f; color: #fff; border-color: #2a6b3f; }
.chip-inactive{ background: #ededed; color: #888; border-color: #d7d7d7; }
.chip-blocked { background: #f5f5f5; color: #555; border-color: #ddd; }
.plan-urgent { background: #fff7ec; border-left: 3px solid #c8261c; padding: 14px 18px; margin: 0 0 14px; font-size: 13px; border-radius: 0 3px 3px 0; }
.plan-urgent b { color: #c8261c; display: block; margin-bottom: 6px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; }
.plan-urgent ul { margin: 0; padding-left: 18px; }
.plan-urgent li { margin-bottom: 4px; line-height: 1.5; }
.plan-urgent.conflict { background: #fde8e6; border-left-color: #a01a12; }
.plan-urgent.conflict b { color: #a01a12; }
.d-rel { font-size: 11px; color: var(--muted); margin-left: 2px; }
.month-head { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); margin: 28px 0 8px; border-bottom: 1px solid var(--rule); padding-bottom: 6px; }
.wrow { display: grid; grid-template-columns: 150px 1fr 110px; gap: 16px; align-items: stretch; padding: 14px 16px; margin: 10px 0; background: #fff; border: 1px solid var(--rule); border-left: 4px solid var(--rule); border-radius: 4px; }
.wrow.r-locked   { border-left-color: #2a6b3f; background: #f1f7f3; border-color: #cfe3d6; }
.wrow.r-locked .wlabel { color: #2a6b3f; }
.wrow.r-busy     { border-left-color: #d97706; }
.wrow.r-pipeline { border-left-color: #b1d8de; }
.wrow.r-free     { border-left-color: #c8261c; border-style: dashed; background: #fff7f6; }
.wrow.r-conflict { box-shadow: inset 4px 0 0 0 #a01a12; }
.wlabel { font-weight: 600; color: var(--ink); font-size: 13px; font-variant-numeric: tabular-nums; align-self: flex-start; line-height: 1.3; }
.wlabel .iso { display: block; font-size: 10.5px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
.cards { display: flex; flex-wrap: wrap; gap: 10px; }
.card { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 4px; border: 1px solid var(--rule); background: #fcfbf7; min-width: 280px; max-width: 360px; flex: 1 1 300px; color: var(--ink); text-decoration: none; transition: background-color 0.12s ease; }
.card:hover { background: #f5f3eb; }
.card-stretch { position: absolute; inset: 0; z-index: 1; border-radius: inherit; }
.card-stretch:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.card-ext, .card-find-date, .card-not-interested { position: relative; z-index: 2; }
.card-ext { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; font-size: 13px; line-height: 1; color: var(--muted); text-decoration: none; border-radius: 50%; }
.card-ext:hover { background: #e3f3f5; color: #1f6470; }
.card-find-date { font-size: 11px; color: #1f6470; font-weight: 600; text-decoration: none; padding: 1px 6px; background: #e3f3f5; border-radius: 3px; }
.card-find-date:hover { text-decoration: underline; }
.card-not-interested { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: transparent; border: 1px solid var(--rule); border-radius: 50%; cursor: pointer; padding: 0; font-size: 14px; line-height: 1; color: var(--muted); }
.card-not-interested:hover { background: #fde8e6; border-color: #f4b7b1; color: #c8261c; }
.card-not-interested:disabled { opacity: 0.4; cursor: wait; }
.card-untranslated { position: relative; z-index: 2; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; color: #b88a1e; }
.card-find-date { display: inline-flex; align-items: center; gap: 4px; }
.card[data-ptier="we_want_to_go"]   { border-left: 3px solid #2a6b3f; padding-left: 12px; }
.card[data-ptier="priority_for_us"] { border-left: 3px solid #d97706; padding-left: 12px; }
.card[data-ptier="not_interested"]  { opacity: 0.45; }
.card[data-attention="urgent"] { background: #fdecea; border-color: #f0a8a0; box-shadow: 0 0 0 1px #f0a8a0 inset; }
.card[data-attention="urgent"]:hover { background: #fbddd9; }
.card[data-attention="urgent"] .ename { color: #a01a12; }
.card[data-attention="reply"]  { background: #fff6e6; border-color: #f0c879; box-shadow: 0 0 0 1px #f0c879 inset; }
.card[data-attention="reply"]:hover { background: #ffeed1; }
.card[data-attention="missed"] { opacity: 0.42; background: #f4f3ef; }
.card[data-attention="missed"]:hover { opacity: 0.6; }
.card-banner { display: inline-flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; align-self: flex-start; line-height: 1.4; }
.card-banner.b-urgent { background: #c8261c; color: #fff; }
.card-banner.b-reply  { background: #d97706; color: #fff; }
.card-banner.b-missed { background: #d7d4cc; color: #555; font-weight: 600; letter-spacing: 0.1em; }
.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; min-height: 20px; }
.c-flags { flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; line-height: 1; padding-top: 2px; }
.ename { flex: 1; min-width: 0; font-weight: 600; font-size: 14px; line-height: 1.35; color: var(--ink); display: flex; align-items: baseline; gap: 6px; }
.ename .ename-text { word-break: break-word; }
.tier-mark { flex-shrink: 0; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; line-height: 1; align-self: center; }
.tier-mark.tier-we_want_to_go   { background: #2a6b3f; color: #fff; }
.tier-mark.tier-priority_for_us { background: #d97706; color: #fff; }
.tier-mark.tier-not_interested  { background: #ededed; color: #888; text-decoration: line-through; }
.tier { font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 3px; white-space: nowrap; text-transform: uppercase; cursor: help; line-height: 1; }
.tier-S { background: #2a6b3f; color: #fff; }
.tier-A { background: #5f8b3f; color: #fff; }
.tier-B { background: #d97706; color: #fff; }
.tier-C { background: #d7d4cc; color: #555; }
.oicon { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; font-size: 12px; font-weight: 700; line-height: 1; }
.oi-sent   { background: #fff1de; color: #d97706; border: 1px solid #f6d9a8; }
.oi-reply  { background: #e3f3f5; color: #1f6470; border: 1px solid #b1d8de; }
.oi-booked { background: #2a6b3f; color: #fff; border: 1px solid #2a6b3f; font-size: 11px; }
.card-sub { display: flex; gap: 10px; font-size: 11.5px; color: var(--muted); line-height: 1.45; flex-wrap: wrap; }
.card-sub .city { font-weight: 500; }
.card-sub .dates { font-variant-numeric: tabular-nums; white-space: nowrap; }
.c-decide { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 8px 0; border-top: 1px solid #ececec; border-bottom: 1px solid #ececec; }
.c-cell { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.c-cell .c-lab { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; color: var(--muted-soft); text-transform: uppercase; }
.c-cell .c-val { font-size: 13px; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; line-height: 1.2; word-break: break-word; }
.c-cell .c-val.c-mute { color: #b5b9b1; font-weight: 400; }
.c-cell.c-dist .c-val.c-near    { color: #2a6b3f; }
.c-cell.c-dist .c-val.c-mid     { color: #b88a1e; }
.c-cell.c-dist .c-val.c-far     { color: #c8261c; }
.c-cell.c-cost .c-val.c-booked  { color: #2a6b3f; font-weight: 700; }
.c-cell .c-hotel { font-size: 10px; color: var(--muted); margin-top: 2px; font-weight: 500; }
.c-cell .c-detail { font-size: 10px; color: var(--muted); margin-top: 2px; font-weight: 400; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.c-content { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; padding-top: 6px; border-top: 1px dashed var(--rule); }
.c-content p { margin: 0; font-size: 11px; line-height: 1.45; }
.c-notes { color: var(--ink); }
.c-updates { color: #1f6470; font-weight: 500; padding-left: 8px; border-left: 2px solid #b1d8de; }
.c-pipeline { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 11.5px; line-height: 1.4; min-height: 18px; }
.c-pipeline .card-action { margin-left: auto; color: var(--muted); font-weight: 500; font-style: italic; }
.dist { font-size: 10.5px; font-weight: 600; padding: 1px 6px; border-radius: 3px; background: #f5f5f5; color: #555; border: 1px solid #ddd; }
.dist.d-near    { background: #e5f3e9; color: #2a6b3f; border-color: #b8dcc1; }
.dist.d-mid     { background: #fff7ec; color: #b88a1e; border-color: #ebd29a; }
.dist.d-far     { background: #fde8e6; color: #c8261c; border-color: #f4b7b1; }
.dist.d-unknown { background: #ededed; color: #888; border-color: #d7d7d7; }
.card[data-status="cold"] { opacity: 0.82; }
.card[data-status="cold"] .ename { color: var(--muted); font-weight: 500; }
.plan-filters { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 18px; align-items: center; padding: 12px 14px; background: #fff; border: 1px solid var(--rule); border-radius: 4px; }
.plan-filters > label { font-size: 10.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; margin-right: 6px; }
.filter-chip { display: inline-block; padding: 4px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 500; border: 1px solid var(--rule); background: #fff; cursor: pointer; user-select: none; transition: all 0.1s ease; }
.filter-chip:hover { border-color: var(--ink); }
.filter-chip.active { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 600; }
.filter-chip.active.fc-tier-S { background: #2a6b3f; border-color: #2a6b3f; }
.filter-chip.active.fc-tier-A { background: #5f8b3f; border-color: #5f8b3f; }
.filter-chip.active.fc-tier-B { background: #d97706; border-color: #d97706; }
.filter-chip.active.fc-band-far { background: #c8261c; border-color: #c8261c; }
.wrow.hidden, .card.hidden { display: none; }
.cost { font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; padding: 1px 6px; border-radius: 3px; background: #f0eee8; }
.cost-unknown { color: #666; background: #f5f5f5; }
.cost-booked  { background: #2a6b3f; color: #fff; }
.waited { font-size: 10.5px; color: #1f6470; font-weight: 500; }
.card-dl { font-size: 11px; }
.dl em { font-style: normal; color: var(--muted); font-weight: 500; }
.dl.near em, .dl.near { color: #d97706; font-weight: 600; }
.dl.soon em, .dl.soon { color: #c8261c; font-weight: 700; }
.dl.mid em { color: #b88a1e; }
.dl.past { color: var(--muted-soft); text-decoration: line-through; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; border: 1px solid var(--rule); white-space: nowrap; }
.st-new       { background: #e3f3f5; color: #1f6470; border-color: #b1d8de; }
.st-form      { background: #fff1de; color: #d97706; border-color: #f6d9a8; }
.st-priced    { background: #e5f3e9; color: #2a6b3f; border-color: #b8dcc1; }
.st-pdf       { background: #efe6f5; color: #6b3aa1; border-color: #d4bfe2; }
.st-asking    { background: #e3ecf5; color: #1f4d7c; border-color: #b5c7df; }
.st-confirmed { background: #2a6b3f; color: #fff; border-color: #2a6b3f; }
.st-declined  { background: #ededed; color: #888; border-color: #d7d7d7; }
.st-withdrawn { background: #efe8e8; color: #6b4646; border-color: #d8c4c4; }
.st-formonly  { background: #f5f5f5; color: #555; border-color: #ddd; }
.st-unsure    { background: #fff7ec; color: #b88a1e; border-color: #ebd29a; }
.st-late      { background: #fde8e6; color: #c8261c; border-color: #f4b7b1; }
.st-cold      { background: #f0eee8; color: #666; border-color: #d8d4ca; }
.st-refused   { background: #fde8e6; color: #a01a12; border-color: #f0a8a0; }
.tag { align-self: flex-start; justify-self: end; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 9px; border-radius: 3px; white-space: nowrap; line-height: 1.2; }
.tag-locked   { background: #2a6b3f; color: #fff; }
.tag-busy     { background: #d97706; color: #fff; }
.tag-pipeline { background: #e3f3f5; color: #1f6470; }
.tag-free     { background: #c8261c; color: #fff; }
.tag-conflict { background: #a01a12; color: #fff; margin-right: 4px; }
.free-prompt { color: #c8261c; font-style: italic; font-weight: 500; padding: 8px 0; font-size: 12.5px; }
.wbody { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.wsum-deadlines { list-style: none; margin: 0; padding: 8px 10px; background: #fff7ec; border-left: 3px solid #d97706; font-size: 12px; line-height: 1.5; display: flex; flex-direction: column; gap: 3px; }
.wsum-deadlines li { color: var(--ink); }
.wsum-lab  { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #d97706; }
.wsum-val  { font-weight: 600; }
.wsum-deadlines em { font-style: normal; font-weight: 500; color: var(--muted); margin-left: 2px; }
.wsum-empty { color: #c8261c; font-style: italic; font-weight: 500; padding: 8px 0; font-size: 12.5px; }
.bucket { margin: 32px 0 14px; }
.bucket h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); margin: 0 0 10px; border-bottom: 1px solid var(--rule); padding-bottom: 6px; }
.bucket .cards { background: #fff; border: 1px solid var(--rule); border-radius: 4px; padding: 12px; }
.bucket.inactive { opacity: 0.7; }
details.bucket { margin: 32px 0 14px; opacity: 0.85; }
details.bucket summary { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); margin: 0 0 10px; border-bottom: 1px solid var(--rule); padding-bottom: 6px; cursor: pointer; list-style: none; }
details.bucket summary::-webkit-details-marker { display: none; }
details.bucket summary::before { content: "▸ "; }
details.bucket[open] summary::before { content: "▾ "; }
`;

const FILTER_JS = `
(function(){
  var KEY='roh-pipeline-filters-v1';
  function $$(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function restore(){
    try{
      var saved=JSON.parse(localStorage.getItem(KEY)||'{}');
      $$('.filter-chip').forEach(function(c){
        var k=c.dataset.filter+':'+c.dataset.value;
        if(k in saved) c.classList.toggle('active', !!saved[k]);
      });
    }catch(e){}
  }
  function persist(){
    var s={};
    $$('.filter-chip').forEach(function(c){ s[c.dataset.filter+':'+c.dataset.value]=c.classList.contains('active'); });
    try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){}
  }
  function active(name){
    var out=new Set();
    $$('.filter-chip[data-filter="'+name+'"].active').forEach(function(c){ out.add(c.dataset.value); });
    return out;
  }
  function apply(){
    var tiers=active('tier'), bands=active('band'), groups=active('status-group'), pTiers=active('ptier');
    $$('.card').forEach(function(card){
      var t=card.dataset.tier, b=card.dataset.band, s=card.dataset.status, pt=card.dataset.ptier||'potential';
      var isCold=s==='cold';
      var groupOk=(isCold && groups.has('cold')) || (!isCold && groups.has('active'));
      var tierOk=tiers.has(t);
      var bandOk=bands.has(b);
      var ptierOk=pTiers.has(pt);
      card.classList.toggle('hidden', !(groupOk && tierOk && bandOk && ptierOk));
    });
    $$('.wrow').forEach(function(row){
      var cards=row.querySelectorAll('.card');
      if(!cards.length) return;
      var allHidden=Array.prototype.every.call(cards, function(c){ return c.classList.contains('hidden'); });
      row.classList.toggle('hidden', allHidden);
    });
  }
  $$('.filter-chip').forEach(function(c){ c.addEventListener('click', function(){ c.classList.toggle('active'); persist(); apply(); }); });
  restore();
  apply();
})();
`;

function deadlineSpan(deadline: string | null) {
  if (!deadline) return null;
  const days = daysUntil(deadline);
  let cls = "dl";
  let suffix = "";
  if (days === null) return <span className="dl">{deadline}</span>;
  if (days < 0) {
    cls = "dl past";
    suffix = "past";
  } else if (days <= 7) {
    cls = "dl soon";
    suffix = `${days}d`;
  } else if (days <= 14) {
    cls = "dl near";
    suffix = `${days}d`;
  } else if (days <= 30) {
    cls = "dl mid";
    suffix = `${days}d`;
  } else {
    suffix = `${days}d`;
  }
  return (
    <span className={cls}>
      Deadline {deadline} <em>({suffix})</em>
    </span>
  );
}

function CostPill({ cost }: { cost: string }) {
  const c = (cost || "").trim();
  if (c === "" || c === "?") return <span className="cost cost-unknown">€?</span>;
  if (c.toLowerCase() === "booked")
    return <span className="cost cost-booked">booked</span>;
  return <span className="cost">{c}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, cls: "st-unknown" };
  return <span className={`badge ${meta.cls}`}>{meta.label}</span>;
}

function DistanceBadge({ e }: { e: EventModel }) {
  const band = e.distanceBand;
  if (!band) return null;
  const cls = DISTANCE_CSS[band] ?? "d-unknown";
  const km = e.distanceKm != null ? `${e.distanceKm}km` : "?";
  return <span className={`dist ${cls}`}>{band} · {km}</span>;
}

function TierMark({ t }: { t: string }) {
  if (t === "potential") return null;
  const label =
    t === "we_want_to_go"
      ? "Going"
      : t === "priority_for_us"
        ? "Priority"
        : "Skip";
  return <span className={`tier-mark tier-${t}`}>{label}</span>;
}

function WaitingBadge({ e }: { e: EventModel }) {
  if (e.status !== "new" || !e.lastContact) return null;
  const d = new Date(e.lastContact + "T00:00:00Z").getTime();
  const n = Math.round((Date.now() - d) / 86_400_000);
  return <span className="waited">{n}d waiting</span>;
}

function crowdDisplay(raw: string): { value: string; mute: boolean } {
  const s = (raw || "").trim();
  if (!s || s === "?") return { value: "—", mute: true };
  const lower = s.toLowerCase();

  // "150-200k" / "25-30k" / "150–200k"
  const range = lower.match(/(\d+)\s*[-–]\s*(\d+)\s*k\b/);
  if (range) return { value: `${range[1]}-${range[2]}k`, mute: false };

  // "800,000+ visitors" / "161,000 visitors"
  const commaVisitors = lower.match(
    /(\d{1,3}(?:,\d{3})+)\s*\+?\s*(?:visitors|attendees|guests|besucher)/,
  );
  if (commaVisitors) {
    const n = parseInt(commaVisitors[1].replace(/,/g, ""), 10);
    if (n >= 1000) {
      return { value: `${Math.round(n / 1000)}k`, mute: false };
    }
  }

  // "400k visitors" / "150k+" / "~400k visitors"
  const kVisitors = lower.match(
    /~?(\d+(?:\.\d+)?)\s*k\+?\s*(?:visitors|attendees|guests|besucher)/,
  );
  if (kVisitors) return { value: `${kVisitors[1]}k`, mute: false };

  // "hundreds of thousands"
  if (/hundreds of thousands/.test(lower))
    return { value: "100k+", mute: false };

  // First "Xk" anywhere, but only if NOT preceded by "exhibitors/stalls" type words
  const anyK = lower.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (anyK) return { value: `${anyK[1]}k`, mute: false };

  // Plain number with thousands separator
  const plainComma = lower.match(/(\d{1,3}(?:,\d{3})+)/);
  if (plainComma) {
    const n = parseInt(plainComma[1].replace(/,/g, ""), 10);
    if (n >= 1000) {
      return { value: `${Math.round(n / 1000)}k`, mute: false };
    }
  }

  // Bare number — skip 4-digit years
  for (const m of s.matchAll(/(\d+(?:[.,]\d+)?)/g)) {
    const n = parseFloat(m[1].replace(",", "."));
    if (n >= 1900 && n <= 2099 && Number.isInteger(n)) continue;
    if (n >= 1000) return { value: `${Math.round(n / 1000)}k`, mute: false };
    return { value: `${n}`, mute: false };
  }

  // No number — show truncated label
  if (s.length <= 14) return { value: s, mute: true };
  return { value: s.slice(0, 12) + "…", mute: true };
}

function parseMinCostFromText(raw: string): number | null {
  const t = (raw || "").toLowerCase();
  if (!t || t === "?" || t === "free") return null;
  const toNum = (s: string) => parseFloat(s.replace(",", "."));
  const isYear = (n: number) => n >= 1900 && n <= 2099 && Number.isInteger(n);

  // 1) Number immediately after € sign
  const afterEuro = t.match(/€\s*(\d+(?:[.,]\d{1,2})?)/);
  if (afterEuro) {
    const n = toNum(afterEuro[1]);
    if (!isYear(n)) return n;
  }
  // 2) Number immediately before € or EUR
  const beforeEuro = t.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur\b)/);
  if (beforeEuro) {
    const n = toNum(beforeEuro[1]);
    if (!isYear(n)) return n;
  }
  // 3) Fallback: first non-year number in the text
  for (const m of t.matchAll(/(\d+(?:[.,]\d{1,2})?)/g)) {
    const n = toNum(m[1]);
    if (!isYear(n) && n > 0) return n;
  }
  return null;
}

function costDisplay(e: EventModel): {
  value: string;
  cls: string;
  mute: boolean;
  hotel: string | null;
} {
  const hotel = e.hotelCost != null ? `+€${e.hotelCost} hotel` : null;
  if (e.booked) {
    const v = e.standCost != null ? `€${e.standCost}` : "booked";
    return { value: v, cls: "c-booked", mute: false, hotel };
  }
  if (e.standCost != null) {
    return { value: `€${e.standCost}`, cls: "", mute: false, hotel };
  }
  const legacy = (e.stallCost || "").trim();
  if (legacy.toLowerCase() === "booked")
    return { value: "booked", cls: "c-booked", mute: false, hotel };
  const parsed = parseMinCostFromText(legacy);
  if (parsed != null) {
    return { value: `from €${parsed}`, cls: "", mute: true, hotel };
  }
  if (!legacy || legacy === "?") {
    return { value: "€?", cls: "", mute: true, hotel };
  }
  if (legacy.toLowerCase() === "free") {
    return { value: "free", cls: "", mute: false, hotel };
  }
  return { value: "€?", cls: "", mute: true, hotel };
}

function distDisplay(e: EventModel): { value: string; cls: string; mute: boolean } {
  if (e.distanceKm == null) {
    return { value: e.distanceBand || "—", cls: "", mute: true };
  }
  const band = e.distanceBand;
  const cls =
    band === "drive 1 day" ? "c-near" :
    band === "weekender" ? "c-mid" :
    band === "far far away" ? "c-far" : "";
  return { value: `${e.distanceKm} km`, cls, mute: false };
}

const POSITIVE_REPLY = new Set([
  "form-link",
  "priced",
  "pdf-pending",
  "asking-more",
]);
const STILL_OURS_TO_ACT = new Set([
  "cold",
  "new",
  "late",
  "form-only",
  "unsure",
  "low-confidence",
]);
const NOT_DEAD_YET = new Set([
  ...STILL_OURS_TO_ACT,
  ...POSITIVE_REPLY,
]);

function attentionFor(
  e: EventModel,
): "urgent" | "reply" | "missed" | null {
  let days: number | null = null;
  if (e.deadline) {
    const d = new Date(e.deadline + "T00:00:00Z").getTime();
    days = Math.round((d - Date.now()) / 86_400_000);
  }
  // urgent: deadline within a week, and we can still act on it
  if (days !== null && days >= 0 && days <= 7 && NOT_DEAD_YET.has(e.status)) {
    return "urgent";
  }
  // reply waiting on us
  if (POSITIVE_REPLY.has(e.status)) return "reply";
  // missed: deadline gone, status still in our court (deal effectively closed by inaction)
  if (days !== null && days < 0 && STILL_OURS_TO_ACT.has(e.status)) {
    return "missed";
  }
  return null;
}

function Card({ e }: { e: EventModel }) {
  const score = scoreEvent(e);
  const tier: Tier = tierForEvent(e, score.total);
  const oi = outreachIcon(e);
  const breakdown = `Crowd ${score.crowd} · Duration ${score.duration} · Fit ${score.fit} · Status ${score.status} · Distance ${score.distance} = ${score.total}`;
  const action = actionFor(e);
  const crowd = crowdDisplay(e.crowdSize);
  const cost = costDisplay(e);
  const dist = distDisplay(e);
  const attention = attentionFor(e);
  const hasPipelineMeta = Boolean(
    e.status !== "cold" || e.deadline || action,
  );
  const noFixedDate = e.dateKind === "unknown" || e.dateKind === "various";
  return (
    <article
      className="card"
      data-tier={tier}
      data-status={e.status}
      data-band={e.distanceBand || "unknown"}
      data-ptier={e.targetTier}
      data-attention={attention ?? undefined}
    >
      <Link
        href={`/admin/events/${e.eventId}`}
        className="card-stretch"
        aria-label={`Edit ${e.event}`}
      />
      {attention === "urgent" ? (
        <span className="card-banner b-urgent">Decide this week</span>
      ) : attention === "reply" ? (
        <span className="card-banner b-reply">Reply — your move</span>
      ) : attention === "missed" ? (
        <span className="card-banner b-missed">Deadline passed</span>
      ) : null}
      <div className="card-top">
        <span className="ename">
          <TierMark t={e.targetTier} />
          <span className="ename-text">{e.event}</span>
        </span>
        <span className="c-flags">
          {e.organiserWebsite ? (
            <a
              href={organiserHref(e.organiserWebsite)}
              target="_blank"
              rel="noopener nofollow"
              className="card-ext"
              title="Open organiser site"
              aria-label="Organiser site"
            >
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          ) : null}
          {(e.notes !== "" && e.notesEn === "") ||
          (e.updates !== "" && e.updatesEn === "") ? (
            <span
              className="card-untranslated"
              title="Notes or updates not yet translated to English"
              aria-label="Untranslated text"
            >
              <Languages size={12} aria-hidden="true" />
            </span>
          ) : null}
          {oi ? (
            <span className={`oicon ${oi.cls}`} title={oi.title}>
              <OutreachGlyph glyph={oi.glyph} />
            </span>
          ) : null}
          <span className={`tier tier-${tier}`} title={breakdown}>
            {tier}
          </span>
          <NotInterestedButton eventId={e.eventId} />
        </span>
      </div>
      <div className="card-sub">
        <span className="city">{e.city}</span>
        <span className="dates">{formatDateRange(e)}</span>
        {noFixedDate && e.organiserWebsite ? (
          <a
            href={organiserHref(e.organiserWebsite)}
            target="_blank"
            rel="noopener nofollow"
            className="card-find-date"
          >
            Find date <ExternalLink size={10} aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <div className="c-decide">
        <div className="c-cell c-crowd">
          <span className="c-lab">Crowd</span>
          <span className={`c-val ${crowd.mute ? "c-mute" : ""}`}>{crowd.value}</span>
          {e.crowdSize && e.crowdSize !== crowd.value ? (
            <span className="c-detail">{e.crowdSize}</span>
          ) : null}
        </div>
        <div className="c-cell c-cost">
          <span className="c-lab">Stall</span>
          <span className={`c-val ${cost.cls} ${cost.mute ? "c-mute" : ""}`}>{cost.value}</span>
          {cost.hotel ? <span className="c-hotel">{cost.hotel}</span> : null}
        </div>
        <div className="c-cell c-dist">
          <span className="c-lab">Distance</span>
          <span className={`c-val ${dist.cls} ${dist.mute ? "c-mute" : ""}`}>{dist.value}</span>
        </div>
      </div>
      {hasPipelineMeta ? (
        <div className="c-pipeline">
          <StatusBadge status={e.status} />
          <WaitingBadge e={e} />
          {e.deadline ? deadlineSpan(e.deadline) : null}
          {action ? <span className="card-action">{action}</span> : null}
        </div>
      ) : null}
      {(() => {
        const notesText = e.notesEn || e.notes;
        const updatesText = e.updatesEn || e.updates;
        if (!notesText && !updatesText) return null;
        return (
          <div className="c-content">
            {notesText ? <p className="c-notes">{notesText}</p> : null}
            {updatesText ? <p className="c-updates">{updatesText}</p> : null}
          </div>
        );
      })()}
    </article>
  );
}

function WeekRow({ w }: { w: WeekWindow }) {
  const tagLabel =
    w.kind === "free" || w.kind === "pipeline"
      ? "Free"
      : w.kind[0].toUpperCase() + w.kind.slice(1);
  const cls = `wrow r-${w.kind}${w.hasConflict ? " r-conflict" : ""}`;
  const deadlines = w.deadlinesDue.map((e) => ({
    event: e,
    days: daysUntil(e.deadline!),
  }));
  const isEmpty = w.events.length === 0;
  return (
    <div className={cls}>
      <div className="wlabel">
        {w.label}
        <span className="iso">Week {w.isoWeek}</span>
      </div>
      <div className="wbody">
        {isEmpty ? (
          <div className="wsum-empty">Free weekend. Find one.</div>
        ) : null}
        {deadlines.length > 0 ? (
          <ul className="wsum-deadlines">
            {deadlines.map((d) => (
              <li key={d.event.eventId}>
                <span className="wsum-lab">Decide:</span>{" "}
                <span className="wsum-val">{d.event.event}</span>{" "}
                <em>
                  ({d.event.deadline}
                  {d.days != null && d.days >= 0 ? `, ${d.days}d` : ""})
                </em>
              </li>
            ))}
          </ul>
        ) : null}
        {!isEmpty ? (
          <div className="cards">
            {w.events.map((e) => (
              <Card key={e.eventId} e={e} />
            ))}
          </div>
        ) : null}
      </div>
      <div>
        {w.hasConflict ? <span className="tag tag-conflict">Conflict</span> : null}
        <span className={`tag tag-${w.kind}`}>{tagLabel}</span>
      </div>
    </div>
  );
}

function Bucket({
  title,
  events,
  extraCls,
}: {
  title: string;
  events: EventModel[];
  extraCls?: string;
}) {
  if (events.length === 0) return null;
  return (
    <section className={`bucket ${extraCls ?? ""}`}>
      <h2>
        {title}{" "}
        <span style={{ color: "#666", fontWeight: 500 }}>({events.length})</span>
      </h2>
      <div className="cards">
        {events.map((e) => (
          <Card key={e.eventId} e={e} />
        ))}
      </div>
    </section>
  );
}

export default async function WeekendPage() {
  const events = await listEvents({});
  const today = new Date();
  const p = buildPipeline(events, today);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PIPELINE_CSS }} />
      <div className="plan">
        <div className="plan-wrap">
          <header className="plan-header">
            <p className="plan-eyebrow">European Heat Council · Admin</p>
            <h1>
              Events pipeline<span className="dot">.</span>
            </h1>
            <p className="plan-lede">
              Week-by-week planner with full event data: crowd, stall cost,
              distance, deadline. Click any card to edit.
            </p>
            <p className="plan-built">
              Live data · Mon–Sun weeks to 31 Dec 2026
            </p>
          </header>

          <div className="plan-funnel">
            <span className="plan-chip chip-waiting">{p.funnel.waiting} waiting</span>
            <span className="plan-chip chip-replied">{p.funnel.replied} replied</span>
            <span className="plan-chip chip-booked">{p.funnel.booked} booked</span>
            <span className="plan-chip chip-inactive">{p.funnel.inactive} inactive</span>
            <span className="plan-chip chip-blocked">
              {p.funnel.blocked} blocked (form/unsure/cold)
            </span>
          </div>

          <div className="plan-filters">
            <label>Tier</label>
            {(["S", "A", "B", "C"] as const).map((t) => (
              <span
                key={t}
                className={`filter-chip active fc-tier-${t}`}
                data-filter="tier"
                data-value={t}
              >
                {t}
              </span>
            ))}
            <label style={{ marginLeft: "18px" }}>Distance</label>
            {(["drive 1 day", "weekender", "far far away", "unknown"] as const).map(
              (b) => (
                <span
                  key={b}
                  className={`filter-chip active fc-band-${b === "far far away" ? "far" : b.replace(/\s/g, "")}`}
                  data-filter="band"
                  data-value={b}
                >
                  {b}
                </span>
              ),
            )}
            <label style={{ marginLeft: "18px" }}>Status</label>
            <span
              className="filter-chip active"
              data-filter="status-group"
              data-value="active"
            >
              active (non-cold)
            </span>
            <span
              className="filter-chip active"
              data-filter="status-group"
              data-value="cold"
            >
              cold
            </span>
            <label style={{ marginLeft: "18px" }}>Pin</label>
            {TARGET_TIERS.map((p) => (
              <span
                key={p}
                className="filter-chip active"
                data-filter="ptier"
                data-value={p}
              >
                {TARGET_TIER_LABELS[p]}
              </span>
            ))}
          </div>

          {p.conflicts.length > 0 ? (
            <div className="plan-urgent conflict">
              <b>Date conflicts with booked events</b>
              <ul>
                {p.conflicts.map((c, i) => (
                  <li key={i}>
                    <b>{c.clash.event}</b> ({formatDateRange(c.clash)}) clashes with
                    booked <b>{c.booked.event}</b> ({formatDateRange(c.booked)})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {p.urgent.length > 0 ? (
            <div className="plan-urgent">
              <b>Urgent — next 14 days</b>
              <ul>
                {p.urgent.map((u, i) => (
                  <li key={i}>
                    <b>{u.event.event}</b> — {u.action}{" "}
                    <span className="d-rel">
                      {u.days}d ({u.event.deadline})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {p.weeks.map((w) => (
            <div key={w.start}>
              {w.monthHead ? <div className="month-head">{w.monthHead}</div> : null}
              <WeekRow w={w} />
            </div>
          ))}

          <Bucket title="Weekly / recurring markets" events={p.weeklyRecurring} />
          <Bucket title="TBC / portfolio / no fixed date" events={p.portfolio} />
          {p.archivedByDeadline.length > 0 ? (
            <details className="bucket archived">
              <summary>
                Archived (deadline passed){" "}
                <span style={{ color: "#666", fontWeight: 500 }}>
                  ({p.archivedByDeadline.length})
                </span>
              </summary>
              <div className="cards" style={{ marginTop: 12 }}>
                {p.archivedByDeadline.map((e) => (
                  <Card key={e.eventId} e={e} />
                ))}
              </div>
            </details>
          ) : null}
          <Bucket
            title="Inactive (declined / withdrawn / closed)"
            events={p.inactive}
            extraCls="inactive"
          />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: FILTER_JS }} />
    </>
  );
}
