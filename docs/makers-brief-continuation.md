# Makers-brief — continuation brief

**Rewritten 2026-08-06 (session 2).** Session 1's entries are folded in below. Working tree is **local only** — nothing committed this session, nothing pushed, PDF still stale.

## Where we are

Working file: `public/makers-brief.html` (the HTML *is* the source; `makers-brief.pdf` is generated from it and is **stale — it predates both sessions**).
Regenerate with `scripts/print-strategy-pdf.sh makers-brief` — **not yet, wait until the copy is chopped**.

Evidence lives in `~/ehc-strategy/` — `facts.md`, `STRATEGY.md`, `2-model/founding-80-model.md`, `3-research/shipping-outbound.md`, `3-research/hub-storage.html`. **PPWR/EPR evidence now lives in its own repo — `~/ehc-regulation/PPWR/` (created 6 Aug 2026, consolidating PPWR material that had scattered across `ehc-press`, `ehc-strategy` and `ehc-site`).**

**Overflow is deliberate.** Simon's call: build first, chop once at the end. Draft-mode CSS stays until then.
Current: **p1 +142px, p2 +311px, p3 exact.**

## The method — it keeps working

Every claim gets traced back to a source file before it stays. **Four claims have now been tested and failed:**

1. **€3.99 postage** (s1) — was the DPD ≤2 kg 2-bottle rate applied to a five-bottle basket. → **€5.19** GLS ≤5 kg, `shipping-outbound.md:32`.
2. **"shipping can cost more than the sauce"** (s1) — true but unquantified. → **€10.49–11.99** DHL DE→EU Zone 1 ≤1 kg.
3. **The 69% Ferment Island stat** (s2) — the numbers were all real but added up an order nobody can place: €9 + €20 ignores the **€15 minimum order** (`producer-fragmentation.md:48`), and `:62` still lists the FI shipping figure as an unclosed follow-up. → rebuilt on the real floor: **€35**.
4. **"40% empty space from 12 August 2026"** (s2) — wrong number *and* wrong date. Art. 24(1) of Reg. (EU) 2025/40 says **50%**, and **"by 1 January 2030 or 3 years from the entry into force of the implementing acts, whichever is the latest"**. Art. 10 minimisation is also 2030, not 2026. → card rebuilt on penalties; 50%/2030 moved to the note.

**Rule learned the hard way:** two law firms (Greenberg Traurig, Gleiss Lutz) published the wrong dates on this. Cite EUR-Lex directly, never a summary. Full correction record in `~/ehc-regulation/PPWR/analysis/packaging-epr.md`.

## Applied session 2 (all local, all in `makers-brief.html`)

- [x] Ferment Island card **69% → €35** — the smallest order a Berlin customer can actually place
- [x] EPR card 3 **"And your box" → "And the penalties"**, €200,000 correctly attributed to German **VerpackG**, not PPWR
- [x] EPR note gains the **50%-from-2030** empty-space point, honestly dated
- [x] visitBerlin **"launch with" → "launch for 2027, with visitBerlin behind them"** — drops the co-launch implication
- [x] Part-carton rule applied in **both** places that promised "the shelf you actually use" — now **billed by the carton, rounded up**
- [x] "about €22 a month" → **€16–24** (was quoting the top of the range as the middle)
- [x] Contact placeholder filled — **contact@republicofheat.com**, temporary, see parked items

## Written outside this repo this session

- **`~/ehc-regulation/PPWR/analysis/packaging-epr.md`** — the EPR evidence base that didn't exist, which is how the 40% error got in. Primary Art. 24/Art. 10 quotes, day-one vs 2030 duties, VerpackG costs, correction record. Written into `ehc-strategy` first, then moved to its proper home.
- **`~/ehc-regulation/PPWR/internal/open-items.md`** — three of the PPWR campaign's open verification items answered from primary text, plus one new blocker raised (Art. 44(1) keys the national registers to the overdue Art. 44(14) implementing act, which cuts both ways for the campaign).
- **`2-model/founding-80-model.md`** — carton defined + rounding rule + PBPY reconciliation (€0.70 PBPY = €2.80/carton/month).
- **`EHSA-VISITBERLIN-CALL-BRIEF.md`** — call outcome logged.

## Open decisions — all three now settled

- [x] **Rounding — print "€2–3".** 8¢ below the €3.08 ceiling, accepted knowingly. **The membership terms must carry the true ceiling.**
- [x] **Part-carton billing — round up.** A part-full carton is still a carton; it prices the slot, not the contents. Protects the storage line against shallow-stocking Berlin locals.
- [x] **Temperature control — do not promise it.** No assessed site is chilled ("warm"/"kalt" describe heating), it's capex, and it's not in the €5k Phase-0 budget.

## To do on the doc

- [ ] **Chop back to 3pp** — p1 +142, p2 +311. Measure with `scratchpad/measure.sh` or headless Chrome, never by eye.
- [ ] **Restore fixed-height CSS** once chopped — `height:297mm` + `overflow:hidden`, both in `.page` and the print block.
- [ ] p1's cheapest cut is still the **packing-bench image placeholder** (136px). **Simon has not agreed — it's his image slot**, and it's also the only image in the doc.
- [ ] Regenerate the PDF after the chop.

## Parked — named, not chased

- [x] **`app/positions/07-packaging-ppwr/page.tsx` — corrected 2026-08-06.** Carried the 40%/12-August-2026 error in Finding 3 and Position item 3. **Not yet live**, so it was updated, not publicly corrected — no revision marker, no correction note. Root cause: its own source 9 was the Greenberg Traurig article carrying the error. Primary EUR-Lex text added as source 10.
- [ ] `contact@republicofheat.com` is a ROH address on an EHC doc whose own footer separates the two companies. Fine "for now" per Simon; wants an `@europeanheatcouncil.eu` address before this goes wide.
- [ ] `producer-fragmentation.md:27` flags **Little Red's as "currently sold out"** — the p1 five-maker table presents it as a live basket.
- [ ] **"a small maker's licensing can be under €100 a year"** is unverified — no published dual-system rate sourced. Flagged 🟡 in `~/ehc-regulation/PPWR/analysis/packaging-epr.md`.
- [ ] visitBerlin: get Alexander's surname/role/email, and convert goodwill into a named support instrument with a date.

## Stale claims in the OTHER docs — FIXED 2026-08-06

These two are **live**, which is why they jumped the queue ahead of the draft brief's chop.

- [x] `public/strategy-makers.html:868` — "EHC never buys your stock" → **"EHC never buys stock it has not already sold"**. Smallest change that makes it true and keeps the sentence.
- [x] **€3.99 → €5.19** in both files, with the stale **3.81% pooled bar width → 4.95%** that came with it (`.basket-postage--pooled`, line 165 of each). `strategy-makers.html` 701/703/789, `strategy.html` 635/637. Both captions now name the five-bottle parcel and the published-rate basis, matching the brief. Zero residual €3.99 in either file.

## Model findings — belong in `~/ehc-strategy`, NOT the brief

Carried forward from session 1, still unactioned except where noted:

1. **Range width ≠ stock depth.** `founding-80-model.md:141` assumes 350 bottles/member. At one carton per SKU an average member holds ~134, and storage then covers **63% of rent instead of 150%**. The model quietly depends on depth.
2. **Inbound freight is ~€1/kg at 250 kg** — but 250 kg ≈ 833 bottles ≈ 2.4× what an average member holds, so **a maker can't reach that rate alone.** Inbound consolidation is sellable, like outbound pooling.
3. **Deep stocking wins if a consignment carries >~€33 of fixed cost.** Storage is cheap enough that almost any real pickup charge clears the bar.
4. **Self-driving locals break that** — Berlin/Brandenburg makers have ~€10 fixed cost and rationally stock shallow. *(Now partly answered — the round-up rule prices the slot rather than the contents.)*
5. **The festival is the inbound freight run.** ~2 useful windows/year. Great for the maker, *bad* for the storage line — free freight destroys the deep-stock incentive.
6. **Stock depth is cash-limited, not freight-limited.** Six months of stock is ~52 kg, four boxes. €4,000 of inventory is the real constraint.
7. **The inbound handling fee is load-bearing.** `founding-80-model.md:67` scopes €3.70 to pick/pack/materials only — receiving and shelving is unpaid labour.
8. **"We're your warehouse" beats "we're your export shelf" for locals.** Berlin maker in self-storage: €1,031/yr for ~500 bottles vs ~€370 at the hub *with* pick/pack.
9. **Hohenschönhausen is underrated** — €840/mo *kalt* → **€0.54–0.68 PBPY vs Zossen's €0.51–0.64**. A Berlin shed at Brandenburg prices. Caveats: 84 m² vs 230, not chilled. Supersedes the read that Adlershof was the price of a Berlin site.

## Hard rules carried over

- **Local only.** No commit, no push, no PDF regen until Simon says so.
- Don't quote the **€150–300 Riga→Berlin pallet** figure to makers — `STRATEGY.md:244` tags it desk-research grade, no live quote.
- `~/ehc-site` is a **parallel-session repo** — `git status` first, stage files by name, never `git add -A` (see `AGENTS.md`).
- Measurement harness: `scratchpad/measure.sh <file>` prints per-page px past A4. Rebuild it if the scratchpad is gone — headless Chrome + `--dump-dom`, A4 = 1122.52px.
