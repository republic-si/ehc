# EHC Business Plan Artifact — 5-Lane Restructure

## Context

The EHC × ROH business-plan artifact (claude.ai artifact `2f033ee1…`, single self-contained HTML, tabbed left-rail, green/habanero/cream brand) opens with a generic "we store/ship/sell" hero. Today Simon unlocked the real revenue framing after months: **EHC makes money from 5 lanes**, and the front page must show them. Deep-dive detail must survive, redistributed. The doc has zero diagrams; it gets 8 inline SVGs + a Canva prompt per diagram. **Decision made by Simon: full restructure — the doc spine becomes the 5 lanes.** Republish to the SAME artifact URL.

## The 5 lanes (source of truth, Simon 2026-07-30)

1. **Storage & fulfilment** — Phase 1 = storage + fulfilment; Phase 2 = eventually production facility + shared kitchen.
2. **Wholesale** — sauces to anywhere; one mixed pallet of ~30 different sauces, supermarket-style display stand included (minor detail).
3. **B2B events** — high value, low volume. Internorga etc., €10–15k/show, members cover ~90%; EHC takes a % of first 2 years of sales when a member lands a supermarket via a show contact (% undecided; attribution needs managing). **Year-1 honesty: exactly ONE mid-size supermarket sale expected; anything more is a guess.**
4. **Group purchasing** — bottles, chilis, ingredients bought collectively.
5. **Joint groupage & cheaper shipping** — pooled freight in (supplier pays on invoice) and out (EHC pays, re-bills), plus cheaper B2C carrier rates (DHL or similar).

## Vocabulary (resolves the naming collision)

- **Lanes** = how EHC earns (1–5, front page, Simon's words).
- **Routes** = how a bottle physically moves (Route A: EHC→external store · Route B: EHC→ROH · Route C: maker's own sale, EHC fulfils). Renamed from the old "three lanes".
- **Plays** = which box a Route-C parcel ships in (A own box / B ROH box — unchanged).
- One glossary strip on the front page states all three.
- **Sweep required:** "three lanes" also lives in prose — flag #2, build-order panel, numbers dials ("Lane split 35/30/35"), View A row labels, maker-nets table. All become Routes.

## New tab architecture (12 tabs)

```
◆ Overview — the five lanes            front page: what EHC is + lane money map
⚖ Solo vs EHC                          worked example, kept (wording swept to routes)
L1 Lane 1 · Storage & fulfilment       absorbs: fulfilment panel, Play A/B, storage pricing, Route C, 3PL roadmap, Phase-2 kitchen→facility
L2 Lane 2 · Wholesale                  absorbs: Routes A/B, €3.00→€0.40 curve, mixed pallet + stand, "consolidation is the moat", catalogue cross-link
L3 Lane 3 · B2B events                 NEW: show mechanics, cost/coverage, %-of-2yr flag, one-sale honesty
L4 Lane 4 · Group purchasing           NEW
L5 Lane 5 · Joint shipping             NEW: 3 legs (inbound/outbound/B2C), who pays each
·  The engines behind the lanes        membership (floor), EHSA/AHSA (funnel), catalogue (Lane-2 demand-gen) — not lanes, feed the lanes
·  Structure & rules                   two entities + five-rule revenue test, merged
05 Build order                         phases reconciled (2a/2b)
06 The numbers                         Founding-80 dials + Views A/B/C, rows re-labelled by lane
!  Flags & decisions                   existing + new flags
```

Dissolved containers (content survives): "The play" → Overview + Lane 2; "Three lanes" → Routes in L1/L2; "Revenue lines" table → lane deep-dives + Engines panel; candidate-lines table → Flags (except 3PL→L1 roadmap, kitchen→L1 Phase 2, events→L3 — but see the sidebar caveat below).

### Mapping gaps — explicit homes (found by walking the original panel-by-panel)

Items the redistribution above would silently drop or leave homeless. Each gets the home stated here (source line refs are into `artifact-extracted-text.txt`):

- **"For makers / For buyers / For shoppers" rows** (Overview, ln 22–27) → fold as one-liners into the compressed hero (front-page item 1). Don't drop: they're the three-audience pitch in miniature.
- **Euro-note** ("We open on roughly €5k… A rented kitchen and a shopfront come later", ln 34) → stays on Overview, reworded to Phase 2a/2b language (kitchen *access* first, facility gated).
- **ROH explainer one-liner** ("Republic of Heat is our own consumer channel…", ln 35) → attach to the glossary strip; it's the fourth term readers need.
- **Cannibalisation paragraph** ("Lanes 1 and 2 do not cannibalise Lane 3…", ln 128) → L2, swept to Routes wording ("Routes A/B don't cannibalise Route C"), cross-linked from L1.
- **"Berlin milk-run" van detail** (ln 120) and **rate-1 definition** (ln 127) → both L2; rate-1 is a glossary-strip candidate too.
- **Solo-vs-EHC roadmap cross-ref** ("See candidate line a · 3PL-as-a-service under Revenue lines", ln 58) → dangling once Revenue lines dissolves; retarget to "see the 3PL roadmap in Lane 1".
- **Two-entities "Books" list** (ln 72 enumerates the old 8 revenue lines) → reword to lanes+engines in the merged Structure & rules panel. Added to the sweep list.
- **Revenue-lines takeaway beats** ("catalogue = biggest B2B lever, awards = cheapest acquisition", ln 167) → become the Engines panel's two key beats.
- **Candidate line e caution**: "Events and tastings — ticketed Sauce Sessions" (ln 164) is a **consumer/ROH** activity, not Lane 3's B2B trade shows. In L3 it appears only as a clearly-marked "adjacent, not this lane" sidebar so the B2B lane doesn't blur into consumer tastings.
- **Candidate-lines residue, explicit**: Insights (▲), Sponsored placement (▲), and EHC own-brand (✕) all land in Flags **with their test verdicts intact** — the ✕ especially, as the worked example of a line failing the five-rule test.
- **Double-count audit** (beyond the Lane-5 caveat already below): inserts book only under L1 (Play B); membership €12k only under Engines; catalogue only as an engine (it's outside the €147,760 gross anyway); ROH-box fulfilment income (View A, L1) and ROH's ~€0.93/btl box-shipping cost (View B) are the same money seen from both sides — keep both, they must stay numerically consistent. No other double-counts found.

## Front page (Overview), top to bottom

1. Compressed hero: keep "We store hot sauce. We ship it. We make it easier to sell." + one line: EHC earns five ways, each opt-in, each paying its own way.
2. **D1 Lane Map** SVG (hub + 5 lanes fanning out, money arrows back).
3. **Five lane cards**, identical structure: number/name/one-line pitch · **who pays** · **when it earns** · size-vs-certainty badge · phase tag. L3 card carries "high value · low volume · long payback — year 1: one supermarket sale."
4. Glossary strip (Lanes / Routes / Plays, + the one-line ROH explainer per the mapping-gaps list).
5. Stat band (80 · ~€83k · 80,000 · ~€5k) + caveat: lanes 3–5 are upside not yet in the €83k.
6. "The part that makes it safe" (no inventory) — kept verbatim.
7. Rewritten "In one line": five lanes, one hub — L1 pays the rent from week one, L2 scales it, L3–5 are member-side wins that pay their own way.

## New lane content (3/4/5) — key beats

- **L3 Events:** shared stand €10–15k, members ~90%, EHC ~10% as stake in the outcome; % of first-2-years supermarket sales, **% = open flag**; feature the one-sale honesty line, don't bury it; pre-empt the revenue-test tension (90% covers cost, the % is the value fee); takeaway: "one show, one shared stand, one honest number."
- **L4 Group purchasing:** quarterly pooled orders — glass/caps first (highest commonality), then chilis, vinegar, labels; take model TBD (flat admin fee vs % of captured discount — flag); rule: maker always pays less than solo after EHC's cut or the order doesn't run; honest: needs ~20+ makers per SKU, bottles proven, ingredients speculative.
- **L5 Joint shipping:** three legs — inbound groupage (supplier pays on invoice), outbound (EHC pays, re-bills as pass-through), B2C rates (€4.90 vs €6.90, already the courier line in Solo-vs-EHC — surface as the proof point). Mostly pass-through, thin/zero margin — say so: "Lane 5 earns little directly and that's fine — it's the discount that makes every other lane's price work." **Anti-double-count caveat:** its B2C leg is already inside Lane 1's numbers.

## Phase-2 reconcile (Build order + L1)

- **Phase 2a — kitchen access, rent-first** (current plan, zero capex): the utilisation test.
- **Phase 2b — production facility & shared kitchen** (earned end-state): commits only on sustained 2a utilisation (threshold = open flag). "The facility is not a Phase-2 purchase; it is Phase 2a's graduation certificate."
- Amend the Locked list entry accordingly (currently "kitchen rent-and-charge-for-access, Phase 2").
- **Lane switch-on timing (new, found in review):** the original Build order puts "Retail + events" in Phase 3, but L3 carries year-1 expectations and every lane card carries a phase tag — so the Build order panel gains a **"when each lane switches on" strip** (L1/L2 + L5's B2C leg: week one · L4: once ~20+ makers pool a SKU · L3: first show when member funding covers ~90% · L5 groupage legs: when inbound volume justifies). The Phase-3 "events" reference is reconciled to mean the retail/storefront end-state only; if Simon wants events gated later than "first funded show", that's the new flag below.

## Diagrams (8 inline SVGs, palette-matched, print-safe; Canva prompt appendix per diagram)

1. **D1 Lane Map** (Overview) — maker pallet → hub → five lanes fanning to endpoints; thin money arrows back to hub labelled with fee type. **Feasibility fix:** stroke weight ∝ year-1 revenue share breaks — lanes 3–5 model at ≈€0, so proportional strokes render invisible. Use **three discrete weight bands** (heavy = L1, medium = L2, hairline = L3–5) with a legend line "hairline = upside, not yet in the model". ~20 labelled elements: keep lane labels ≤3 words, viewBox ≈ 760×480.
2. **D2 Size-vs-certainty quadrant** (Overview) — x certainty, five lane-colored dots; L3 top-left with "1 expected supermarket sale" callout. The honesty diagram. **Feasibility fix:** the y-axis must read **"size of the prize (steady state)"**, not "year-1 size" — L3's year-1 *realised* size is one sale, so a year-1 axis would contradict its top-left placement and undermine the very honesty the diagram exists to show. The year-1 truth lives in the callout, the axis carries the potential.
3. **D3 Three routes** (L2, thumbnail cross-link in L1) — one shelf of producer-owned stock → Route A/B/C arrows with fee tags; bottle ownership color-coded so "we never own stock except the instant of sale" is visible. **Feasibility note:** the ownership flip needs a small legend (producer-green / EHC-moment / buyer) plus a tick-mark on Routes A/B labelled "EHC owns it for this instant only" — colour alone won't carry it in print.
4. **D4 Wholesale volume curve** (L2) — €3.00→€0.40 step curve, Metro-ladder annotations, €9-SRP/45%-off worked dot (~€0.45 of room, near the floor). **Feasibility fix:** the ladder breakpoints are literally in Still-to-pin — draw an indicative 4-step ladder and caption it **"breakpoints illustrative — the Metro ladder is an open flag"**, cross-refed to Flags. Step positions hand-placed (1 / 5–10 / 100 order sizes), no real axis scale implied.
5. **D5 Mixed pallet** (L2) — 30 sauce silhouettes in one pallet → display stand icon; "one pallet, 30 makers, one invoice." **Feasibility note:** one `<symbol>` bottle + 30 `<use>` refs (tinted via fill) keeps it a few hundred bytes; cheapest of the eight.
6. **D6 Events funnel** (L3) — show (€10–15k, ~90% member-funded) → contacts → meetings → listings, narrowing to one highlighted bottle "1 mid-size supermarket · year 1"; dashed grey "2+? a guess, not a plan"; 2-year %-window timeline below with "% TBD" marker. **Feasibility fix:** densest spec of the eight — compose as **two stacked bands in one viewBox** (~760×560): funnel band above, timeline strip below, thin divider. Label budget: 4 funnel stages + 1 cost callout + 1 ghost branch + 3 timeline markers, nothing more.
7. **D7 Play A vs B fee stacks** (L1) — two bars building €4.75 vs €3.70; existing table stays below. **Feasibility fix:** Play B's stack contains a **negative** segment (−€0.45 insert discount), which a naive stacked bar can't show — use a **waterfall treatment**: base €3.50 → +€0.65 mailer → −€0.45 notch pulling the total down to €3.70 (Play A: base → +€1.25 premium → €4.75). EHC's insert income (~€0.75) is EHC-side money, not a maker fee: render it as a **separate micro-bar beside Play B**, never inside the fee stack.
8. **D8 Build-order staircase** (Build order) — Phase 1 (€5k) → 2a (rent) → 2b (gated: padlock + utilisation trigger) → 3 (retail); each riser labelled "paid for by" the step below. **Feasibility note:** draw the padlock as a vector path, not an emoji glyph — emoji fonts vary wildly across platforms and print.

**Global SVG rules (all eight):** `viewBox` + `width:100%; height:auto`; no `foreignObject`, no external images/fonts/refs (artifact CSP blocks them and print can't fetch them); `font-family: inherit` (the doc's Helvetica stack); label text ≥13 viewBox-units at viewBox width ≤ ~760 so print at sheet width (~1080px) stays legible. Dense diagrams (D1, D4, D6, D7) get a `min-width: 560px` + `overflow-x: auto` figure wrapper so a 360px phone scrolls them instead of shrinking labels to ~6px; D2/D5/D8 scale freely. Brand palette only — the doc pins a light scheme (`:root{color-scheme:light}`), so no dark-mode variants. Each SVG gets `<title>` + `aria-label`. Canva prompt blocks are `<details>` styled as appendix and **hidden under `@media print`** — they're regeneration tooling for Simon, not content for financing partners.

## Consistency fixes (must-do, found in review)

1. **Engines reconciliation:** membership (€12k), catalogue, awards belong to no lane — the front page must say "five lanes plus three engines" or View A's €147,760 gross stops reconciling.
2. **Events terms contradiction:** Flags panel currently LOCKS "event brokerage 10→5→0 declining", conflicting with the new undecided %. Resolution: move to Still-to-pin, present **10% yr-1 → 5% yr-2 → 0** as the leading candidate structure for the 2-year window, pending sign-off. Never show both as settled.
3. **Lanes 4/5 in the numbers:** add explicit "not modelled — upside" rows to View A rather than silently omitting headline lanes.
4. **Lane 5 double-count caveat** (above).
5. **Routes sweep** across all prose/tables.
6. **Dangling cross-refs:** every pointer into a dissolved container must be retargeted — known instances: Solo-vs-EHC's "see candidate line a … under Revenue lines" → L1 roadmap. Grep the rebuilt doc for "Revenue lines", "candidate line", "The play", "Three lanes" as link/reference text.
7. **Entities Books list:** the Structure & rules merge must reword EHC's "Books" from the old 8-line enumeration to lanes+engines vocabulary (and keep it consistent with View A's row labels).
8. **Lane switch-on timing:** Build order's "when each lane switches on" strip (see Phase-2 reconcile) must agree with every lane card's phase tag, and Phase 3's "events" mention must be reconciled to retail-only.
9. **B2B vs consumer events:** L3's Sauce-Sessions sidebar must state the distinction (trade shows = Lane 3; ticketed consumer tastings = ROH activity) so the lane never absorbs consumer events by drift.

## New flags to add

- Events take-rate % + structure (flat vs declining over the 2-year window).
- Events attribution/management: how a "show contact" sale is tracked.
- Events cash exposure: EHC fronts deposits before member contributions land; founder hours per show.
- Group-purchasing take model + minimum-pool threshold.
- Groupage margin policy: pure pass-through vs thin margin (revenue-test rule 2).
- Phase-2b utilisation trigger + facility capex envelope.
- Display-stand economics (who pays, amortised vs charged) — minor.
- Lane switch-on gates for L3–L5 (proposed in Build order strip: L3 first funded show · L4 ~20+ makers/SKU · L5 groupage on volume) — Simon signs off or adjusts the gates.
- Carry forward unchanged: #1 liability/UG, #2 capacity, #3 dwell-time storage, bottle-size minor.

## Execution steps

Sources are now in-repo: text `docs/business-plan/artifact-extracted-text.txt`, full HTML `docs/business-plan/artifact-original.html` (the old scratchpad/tool-results paths are gone). Build in this order:

1. **Working copy:** copy `artifact-original.html` into the session scratchpad; all edits happen there until publish.
2. **Shell:** rebuild the rail to the 12 tabs (new `id`/`aria-controls`/`data-target` per panel). The tab JS is generic over `.tab`/`.panel` (verified) — no script changes. Keep the existing CSS wholesale; add only the new blocks needed: lane-card grid, glossary strip, engines cards, SVG figure wrapper (incl. the mobile `overflow-x` variant), Canva `<details>` appendix styling + its `@media print` hide.
3. **Overview panel** per the 7-item front-page spec, with empty `<figure>` placeholders for D1/D2. Fold in the mapping-gap items that live here (for-makers/buyers/shoppers one-liners, reworded euro-note, ROH glossary line).
4. **Remaining panels, in dependency order:** Structure & rules (merge two-entities + revenue test; reword Books list) → Solo vs EHC (sweep + retarget roadmap ref) → L1 → L2 → L3 → L4 → L5 → Engines → Build order (2a/2b + switch-on strip) → Numbers (rows relabelled by lane; L3–L5 "not modelled — upside" rows; footnote reworded) → Flags (moves + new flags + candidate-line residue with verdicts).
5. **Consistency-fixes pass:** work the 9-item list above against the assembled doc.
6. **Routes sweep:** grep the working file for `three lanes`, `Lane 1`, `Lane 2`, `Lane 3` (old route sense), `lane split` — every hit either a legitimate revenue-lane use or rewritten to Routes.
7. **Diagrams:** build D1–D8 per the amended specs, replacing placeholders. Order of attack: D8, D5, D2 (simple) → D3, D7 (medium) → D1, D4, D6 (dense).
8. **Canva prompts:** one `<details>` block per diagram, adjacent to it, describing the diagram for Canva regeneration.
9. **Self-verify:** run the full Verification checklist below against the working file before publishing.
10. **Publish** with `Artifact` using `url:` of the existing artifact (same favicon, link stays stable). Re-fetch the published page and re-run the text-level checks (V-a, V-b facts, V-c greps) on what actually shipped.

## Verification

**V-a · Numbers reconciliation (View A under lanes+engines).** The relabelled View A must reproduce these exact subtotals — if any row moves lanes, this table catches it:

| Bucket | Rows | € (×80) |
|---|---|---|
| Lane 1 | storage 25,600 + fulfilment 56,800 + inserts 10,160 | **92,560** |
| Lane 2 | Route A margin 33,600 + Route B (ROH) toll 9,600 | **43,200** |
| Engines | membership | **12,000** |
| Lanes 3–5 | explicit "not modelled — upside" rows | **0** |
| **Gross** | = €1,847/maker × 80 (per-maker: L1 €1,157 · L2 €540 · engines €150) | **147,760** |

Then: 147,760 + ~5,000 EHSA/AHSA (engine, below the gross line) − 52,500 run floor − ~17,000 = **€83,260 ≈ €83k** — matching the stat band. The old footnote "Events and catalogue are upside, not yet counted" must be reworded to the new framing (events = the Lane 3 row; catalogue = an engine). Front-page caveat "lanes 3–5 are upside not yet in the €83k" must agree with the €0 rows.

**V-b · Content survival.** Walk the old→new mapping including every "Mapping gaps" item above (each has a named destination — check it arrived). Then sweep the fact inventory — every number in the original must appear exactly once in its new home: €150/yr · €0.40/btl/yr storage · €3.00→€0.40 curve · €0.40 ROH flat · €4.75 / €3.70 plays · €0.75 insert = 3 × €0.25 · €15/pallet-pos/mo box storage · €4.90 vs €6.90 courier · €10–15k/show, ~90% member-funded · 10→5→0 (as candidate only) · €9 SRP / €4.95 / 45% off · ~€1.20 blended margin · €2.45 / €2.45 / €5.27 maker nets · ~€2/btl all-in vs ~€2.50 production · ~€0.15 membership/btl · €1.58 / €1.23 · €2.13 / €1.78 · €6.28 / €2.72 / ~€65k / 24,000 btl (View B) · 80 / 800 / 1,000 / 80,000 · 35/30/35 (as Routes) · ~192 and ~169 parcels · €5k open · 52,500 / ~17,000 · 1,200 parcels / 12 min / 240 h / six weeks / €25/hr / €8.00 / €8.60 / ~€13.00 / €0.80 box / €30+/mo (Solo vs EHC) · UG: €1 capital, 25% retention to €25k.

**V-c · Vocabulary greps** (on rendered text, working file **and** re-fetched published page): `three lanes` → zero hits; `Lane [1-5]` → only revenue-lane sense; `Route A/B/C` and `Play A/B` used correctly and defined in the glossary strip; no dangling references to "Revenue lines", "candidate line", or the dissolved "The play"/"Three lanes" tabs.

**V-d · Structure & UX.** 12 tabs render, click + arrow-key/Home/End nav works, exactly one panel active. Print preview: all 12 panels print page-broken (`page-break-before`), SVGs scale to sheet width, Canva `<details>` blocks hidden. Mobile 360px: rail collapses to the horizontal scroll strip, lane cards stack, dense SVGs (D1/D4/D6/D7) scroll inside their wrappers rather than shrinking. Each SVG has `<title>`/`aria-label`; no `foreignObject`; no external refs.

**V-e · Flags coherence.** "10 → 5 → 0" appears exactly once — in Still-to-pin as the leading candidate (consistency fix #2), gone from Locked. Locked band's kitchen entry reads Phase 2a. All new flags present (events %, attribution, cash exposure, group-purchasing take, groupage margin policy, 2b trigger + capex, display stand, lane switch-on gates); carried-forward flags #1–#3 + bottle-size intact with verdict badges; candidate-line residue (Insights ▲, Sponsored ▲, own-brand ✕) present with verdicts.
