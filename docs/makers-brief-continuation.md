# Makers-brief — continuation brief

**Written 2026-08-06.** Pick this up in a fresh session. Everything below is **local only** — nothing committed, nothing pushed, PDF not regenerated.

## Where we are

Working file: `public/makers-brief.html` (the HTML *is* the source; `makers-brief.pdf` is generated from it and is currently **stale**).
Regenerate with `scripts/print-strategy-pdf.sh makers-brief` — **not yet, wait until the copy is chopped**.

Evidence lives in `~/ehc-strategy/` — `facts.md`, `STRATEGY.md`, `2-model/founding-80-model.md`, `3-research/shipping-outbound.md`, `3-research/hub-storage.html`.

## The method that worked — reuse it

Every claim gets traced back to a source file in `~/ehc-strategy/` before it stays in the doc. Two claims were tested this session and **both were wrong on first inspection**:

1. **€3.99 postage** — was the DPD ≤2 kg rate, priced in the research as "the 2-bottle unit". The brief applies it to a *five*-bottle basket. Corrected to **€5.19** (GLS ≤5 kg, `shipping-outbound.md:32`).
2. **"shipping can cost more than the sauce"** — true but unquantified. Now **€10.49–11.99** (DHL DE→EU Zone 1, ≤1 kg bracket — *not* the €14.49 2 kg rate).

Remaining claims in the doc are **untested**. Same treatment recommended.

## Applied this session (all local)

- [x] Ownership band rewritten — the old "We never buy your stock" was false. EHC *does* buy, just never ahead of a customer. New headline: *"You own every bottle until we have a customer for it."* VAT/call-off language deliberately **kept out** — sales doc, not contract.
- [x] Home-market line added — "We do not replace you in your home market… every order through the hub is an extra one."
- [x] Turn band at foot of page 1 — *"So how, exactly, are you supposed to grow?"* → *"to make this fucking real."* Profanity is **intentional and confirmed**; it's the only instance in the doc.
- [x] Postage €3.99 → **€5.19** (+ bar width 3.81% → 4.95%, + honesty note naming the five-bottle parcel)
- [x] Cross-border clause now carries **€10.49–11.99**
- [x] All three fee placeholders filled (below)
- [x] Stocking-depth block — "you decide how deep to stock, and you can do the maths yourself"
- [x] **Draft mode CSS**: `.page` → `min-height:297mm` + `overflow:visible`, same in `@media print`. Pages now grow instead of silently clipping. Marker comment sits above the rule.

## Fees, as printed

| Line | Printed | Source |
|---|---|---|
| Membership | €150/year, flat, founding cohort | `STRATEGY.md:142` |
| Storage | €2–3 per carton per month | derived, see below |
| Fulfilment | €3.50–3.70 per parcel | €3.50 `STRATEGY.md:220` vs €3.70 `founding-80-model.md:67` — spread is real, printed as a range |

**The carton is now a defined unit: a standard 400×300 Euro container (VDA 4500 / EN 13626), internal 346×265 mm, holding 48 × 100 ml bottles at ~12 kg.** Chosen over the 600×400 (96 bottles, ~24 kg) on hand-liftable weight. This is a **new decision made this session and is not yet recorded anywhere in `~/ehc-strategy/`.**

Storage maths: research gives **€0.51–0.77 PBPY** (per bottle per year) at the lead sites, 120–150% of rent, `founding-80-model.md:100–107`. × 48 ÷ 12 = **€2.04–3.08/carton/month**.

## Open decisions

- [ ] **Rounding**: printed "€2–3" but research tops at €3.08. Cleaner on the page, understates the ceiling by 8¢. Alternative: "€2.00–3.10".
- [ ] **Part-carton billing rule** — a half-full carton currently costs the same as a full one. Needs settling before this goes to a maker.
- [ ] **Temperature control** — a strong hook for fermented/unpasteurised sauces, but *no assessed site is chilled* ("warm"/"kalt" describe heating). It's a capex line, and it is **not** in the €5k Phase-0 budget. Don't promise it in the brief until confirmed.

## To do on the doc

- [ ] **Chop back to 3pp.** Current spill: **p1 +129px, p2 +314px** past A4 (p3 exact). Measure with headless Chrome, don't eyeball it.
- [ ] **Restore the fixed-height CSS** once chopped — `height:297mm` + `overflow:hidden`, both in `.page` and the print block.
- [ ] Cheapest p1 cut identified: the **packing-bench image placeholder** (129px → 5px). Its caption duplicates the 41–47% stat already stated twice, and the turn band now does that job harder. **Simon has not agreed to this** — it's his image slot.
- [ ] Stress-test the remaining claims against `~/ehc-strategy/`.
- [ ] Fill the remaining placeholders: contact address, image slots.

## Stale claims in the OTHER docs

Both still carry the copy we corrected here. Not touched this session:

- [ ] `public/strategy-makers.html:868` — "EHC never buys your stock"
- [ ] `public/strategy-makers.html:701,703,789` and `public/strategy.html:635,637` — the **€3.99** on the five-maker basket

## Model findings — belong in `~/ehc-strategy/`, NOT the brief

These came out of stress-testing and affect the business case, not the doc:

1. **Range width ≠ stock depth.** `founding-80-model.md:141` assumes 350 bottles/member. At one carton per SKU an average member holds ~134, and storage then covers **63% of rent instead of 150%**. The model quietly depends on depth.
2. **Inbound freight is ~€1/kg at 250 kg** (Simon, from experience) — but 250 kg ≈ 833 bottles ≈ 2.4× what an average member holds, so **a maker can't reach that rate alone.** Inbound consolidation is a sellable service, exactly like outbound pooling.
3. **Deep stocking wins if a consignment carries >~€33 of fixed cost** (>~€11 vs monthly). Storage is so cheap that almost any real pickup/handling charge clears the bar. No quote needed to settle the direction.
4. **Self-driving locals break that** — Berlin/Brandenburg makers have ~€10 fixed cost, so they rationally stock shallow (~€50/yr storage vs €269 for a deep stocker). Prague ~350 km and Kraków ~570 km are *not* self-drive.
5. **The festival is the inbound freight run.** Makers travel to Berlin anyway; stock rides along at zero marginal cost. Realistically **2 useful windows/year** (the third is small, indoor, local). Great for the maker (~€50 total vs €239), *bad* for the storage line — free freight destroys the deep-stock incentive.
6. **Stock depth is cash-limited, not freight-limited.** Six months of stock is ~52 kg — four boxes, trivially carryable. If makers don't bring more it's because €4,000 of inventory is a lot of money. Plan the storage line on modest depth.
7. **The inbound handling fee is load-bearing, not optional.** `founding-80-model.md:67` scopes the €3.70 to picking, packing and materials only — **receiving, checking and shelving is unpaid labour**, and it's the only way to price the inbound leg when freight is free.
8. **"We're your warehouse" beats "we're your export shelf" for locals.** A Berlin maker in self-storage pays €1,031/yr for ~500 bottles; the same stock at the hub is ~€370 *with* pick/pack. That's ~5.5× the storage revenue of an export-shelf member. Own-shop D2C fulfilment is already modelled at `producer-economics-worked-example.md:27`.
   Counter-arguments that survived: **access friction** (Kreuzberg maker, Zossen stock, Saturday market), small-batch makers holding little average stock, and counterparty risk.
9. **Site: Hohenschönhausen (Berlin-Lichtenberg) is underrated.** €840/mo *kalt* → ~€1,050 warm-equivalent, so **€0.54–0.68 PBPY against Zossen's €0.51–0.64** — a Berlin shed at Brandenburg prices, which keeps the "we're your warehouse" pitch alive. Currently flagged "Backup" in `hub-storage.html`. Caveats: 84 m² vs Zossen's 230 (holds ~67k bottles = 2.4× founding-80 day-one need, but little room to grow), and not chilled.
   This **supersedes** the earlier read that Adlershof (€2,340/mo) was the price of a Berlin site.

## Hard rules carried over

- **Local only.** No commit, no push, no PDF regen until Simon says so.
- Don't quote the **€150–300 Riga→Berlin pallet** figure to makers — `STRATEGY.md:244` tags it desk-research grade, no live quote. It'd be the only unverified number in the doc.
- `~/ehc-site` is a **parallel-session repo** — run `git status` first, stage files by name, never `git add -A` (see `AGENTS.md`).
