---
type: backlog
owner: Simon
priority: low
---

# DB cleanup backlog

## Open

### Drop legacy `stall_cost` TEXT column from `events`
- Routed from `~/ea/inbox.md` 2026-06-25.
- New numeric `stand_cost` column already in place.
- Wait until numeric `stand_cost` is populated on the events that matter, then drop the legacy text column.
- Low priority — no current breakage.

## Done
- (nothing yet)
