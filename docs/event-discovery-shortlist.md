# Event discovery sources — shortlist

Decision doc for edit #18 (sweep smaller event sites + Facebook Events for weekday markets). Pick 2-3 sources to scrape; design the scrape architecture as a separate plan.

## Target: close-to-home weekday markets

- Geographic focus: Berlin-Brandenburg first, expand to NRW/Bavaria when bandwidth allows.
- Cadence target: weekly run, drop new candidate events into `events` table at `status='cold'`, `target_tier='potential'`, distance pre-computed.
- Out of scope right now: official chili fests (already tracked), large food fests (already scraped).

## Candidate sources

| Source | Covers | Geo | Access | Cadence |
|---|---|---|---|---|
| **marktcom.de** | Wochenmärkte directory | Germany-wide | HTML scrape, structured listings | static, refresh weekly |
| **marktschwaermer.de** | Producer farm-pickups (Marktschwärmer = Food Assembly) | DE/EU, dense in Berlin | API likely behind login, HTML scrape works | weekly |
| **foodtruckrun.de** | Food-truck rallies + events | Germany-wide | HTML scrape | weekly |
| **berlin.de/events** | Official Berlin city calendar | Berlin only | RSS feed available, JSON endpoint exists | daily |
| **meinestadt.de** | Municipal event aggregator | Germany city-level | HTML scrape per city, slow | weekly |
| **eventbrite.de** | Paid + free events | DE/EU | Official Eventbrite API, requires OAuth | on-demand |
| **evensi.com** | Cross-platform event aggregator | EU-wide | HTML scrape, anti-bot likely | weekly |
| **Facebook Events** | Local/grassroots events not on aggregators | EU | Graph API restricted, scrape needs session, fragile | not recommended |

## Recommended shortlist (Simon to confirm)

**Tier 1 — start here (clean, well-structured, high signal-to-noise):**

1. **berlin.de/events** — RSS feed, official source, no anti-bot. Best for Berlin city events.
2. **marktcom.de** — clean Wochenmarkt directory matching Simon's "weekday markets" ask.

**Tier 2 — add if Tier 1 doesn't fill the calendar:**

3. **foodtruckrun.de** — food-truck rallies are direct fit for ROH stalls.

**Tier 3 — defer:**

- meinestadt.de (slow), evensi (anti-bot), eventbrite (OAuth setup), Facebook Events (fragile).

## Open questions for Simon

- Pick 2-3 sources from the shortlist above.
- Recurring (weekly cron) or one-off discovery sweep?
- Distance cap on ingested events (e.g. drop anything > 500 km from Berlin)?
- Auto-tier candidate events as `potential` or leave at `null` / new sentinel?

Once decided, design scrape architecture in a separate plan (probably `~/ehc-site/scripts/discover-events.ts` mirroring `ingest-events.ts`).
