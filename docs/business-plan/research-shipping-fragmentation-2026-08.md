# Research — Cross-border shipping fragmentation among EHC producers

*Primary evidence for **Lane 5 (joint groupage & cheaper shipping)** and the overall consolidation thesis. Compiled 2026-08-03. Feeds [PLAN.md](./PLAN.md) — does not replace it.*

## The question

If a real consumer in Berlin (ship-to: Südostallee 124, 12487 Berlin, name "Gardner") tries to buy **one bottle** direct from an EHC producer, can they, and what does shipping cost? Run across a random sample of the producer directory to see how discoverable and how cheap cross-border direct-to-consumer actually is today.

## Method

- **Source:** the shared Neon `producers` table (the EHC producer directory — 126 rows, 81 in-scope). Random sample, Ferment Island included by request.
- **Sample size:** 42 producers examined (12 + 30 across two passes), plus a handful of hand-checked extras.
- **Per producer:** locate the official webshop → check whether a *single* bottle is buyable (multipack-only? minimum order?) → get cheapest shipping to the Berlin address → **buy nothing, stop at the shipping figure.**
- **Big caveat on the numbers:** live end-to-end checkout was possible for only ONE shop (MUNNVOLD) — the browser automation's site allowlist blocked every other domain. All other figures are **published rates** read from shops' own shipping/policy pages. Where a shop computes shipping only at checkout with no published rate, it is marked *checkout-only* — that figure is genuinely undiscoverable without entering an order. That undiscoverability is itself the finding.

## Headline result — producers with an actual, obtainable DE shipping price (single bottle)

| Producer | Country | Single price | Shipping to Berlin | Note |
|----------|---------|-------------|--------------------|------|
| Ravensfeuer | 🇩🇪 | from €4 | **€4.90** | flat DE rate |
| Eckart Saucen | 🇩🇪 Berlin | €7.50 | **€5.50** | free over €60 |
| Burnin Benze | 🇩🇪 | single OK | **€6.90** | DE-only |
| Oily Garly Goody | 🇩🇪 Munich | single OK | **€6.99** | DHL flat |
| CZILLI | 🇦🇹 | €6 | **€10.00** | EU; free over €40 |
| FEUERzeug (MV Chili) | 🇦🇹 | — | **€11.45** | free over €100 |
| Big Ginger | 🇬🇧 | £8 | **£12 (~€14)** | Europe, tracked, ≤5 bottles |
| Little Red's | 🇮🇪 | €9 | **€15.00** | Zone 1 — currently sold out |
| MUNNVOLD | 🇳🇴 | 150 kr/100ml | **180 kr (~€15.5)** | ✅ only one verified live in checkout |
| Svilis Pepper Farm | 🇱🇻 | €6 | €5 flat *(tentative — reads as LV-domestic, unconfirmed for DE)* | |

**9 firm published/verified numbers + 1 tentative.** Note the split: the four cheapest (€4.90–6.99) are all **German domestic**. Everything cross-border is either dearer, threshold-gated, or unobtainable.

## Everyone else, by failure mode

**Ships to DE but price is checkout-only (undiscoverable without ordering):**
Chilma (DE, DHL) · Chilli Hills (BG, DHL abroad) · Volim Ljuto (HR, single from €6.45, EU free over threshold) · Ferment Island (MT — see below) · The Chilli Experience (PT) · Torcatha (US) · POHORC (SI) · Yare (CH) · Pandemonic (has a DE subdomain) · Chili Factory (FI).

**Won't ship to Germany — domestic/regional only:**
Achilipú, RIBASTI, TheSauceMan (ES) · Zach's, Gaston Chilli (CZ+SK) · Callaloo (UK) · Nomad (AU) · Spicepunk (CH+LI) · Chili Kjell (NO) · Chilliphoria (RO) · Chillie Vinnie (NL — NL rate only; and it's chili *oil*, not sauce).

**No functioning webshop at all (Instagram / Facebook / DM / empty marketplace):**
Shadow Reapers, Kaathoon, Los Diablitos, ČILI ROŽA, Ornitodrinko, OPG Ljutistra, De Vergulde Tong.

**Seasonally closed at time of research:**
Not That Spicy (Berlin, closed to ~1 Aug 2026) · Kamenica Reaper (summer break). Recheck.

**Minimum-order blocks a true single:**
**Ferment Island (MT)** — €6–10 per bottle but a **€15 minimum order**, so a single bottle cannot be bought at all; smallest valid basket ≈ €15–16 (2 sauces). Shipping still checkout-gated on top.

## Why this matters for EHC (the takeaway)

The sample makes the consolidation case concretely:

1. **Cross-border direct-to-consumer barely functions.** Of 42 producers, a Berlin buyer can obtain a shipping price for well under a quarter of them. The rest are domestic-only, DM-to-order, seasonally shut, have no shop, or hide the cost behind a checkout.
2. **Price transparency collapses the moment you cross a border.** German makers publish clean flat rates (€4.90–6.99). Almost every non-German maker either won't ship to DE or won't tell you what it costs until you've committed to an order. **A consumer literally cannot comparison-shop European hot sauce on shipping.**
3. **Minimum orders and thresholds fragment further** — €15 floors (Ferment Island), €40–100 free-shipping thresholds (CZILLI, FEUERzeug) — each maker's basket economics differ, so there is no coherent way to buy across makers.

**This is the argument for Lane 5.** A single EHC-pooled outbound channel — one carrier contract, one basket spanning many makers, one published rate to any EU address — turns "undiscoverable / won't-ship / €15-minimum-per-maker" into "one cart, one known shipping price." The fragmentation isn't a footnote; it's the demand.

## Open follow-ups

- **Ferment Island shipping to DE** is the one deliberately-sought figure still missing — needs a live checkout (clear the €15 minimum with 2 bottles, set country to Germany + 12487) once the browser allowlist permits `fermentisland.com`.
- The ~10 *checkout-only* shops could all be priced with browser access approved — would convert "ships to DE, unknown cost" into hard numbers and strengthen the table.
- Re-check the two seasonally-closed German makers now that August has started.
