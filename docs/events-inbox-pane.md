# Events email log — proposal for Nathan

**Problem.** Per event, Simon can't see at a glance what's been said, by whom, and whether the ball is on our court. Gmail is one source, `reply_state.json` another, admin card a third. Result: threads rot and organisers ping "besteht noch Interesse?" (as Wörner did on the DGM Fulda thread today).

**Fix.** On each event card, a chronological thread list. Red bell = latest message is inbound and we haven't replied. That's all.

---

## Data model

One table, colocated with `events`:

```sql
create table event_messages (
  message_id   text primary key,          -- Gmail message id
  thread_id    text not null,
  event_id     text references events(event_id),
  direction    text not null,             -- 'in' | 'out'
  from_email   text,
  from_name    text,
  subject      text,
  snippet      text,                      -- 200 chars, plaintext
  sent_at      timestamptz not null,
  gmail_url    text                       -- deep link to thread
);
create index on event_messages (event_id, sent_at desc);
create index on event_messages (thread_id);
```

Bell rule (materialised in the query, not the schema):

```sql
select event_id
from event_messages
where (event_id, sent_at) in (
  select event_id, max(sent_at) from event_messages group by event_id
)
and direction = 'in';
```

Optional refinement later: exclude auto-replies, exclude "declined" threads. Not needed for v1.

---

## Two moving parts

### 1. Gmail sync worker (Python)

- Runs every ~15 min via cron.
- Gmail search: `(Standanfrage OR "Re: Standanfrage") (in:inbox OR in:sent)`.
- For each message: map subject → event_id using the existing EVENTS dict in `~/roh-events/tools/build_event_drafts.py`.
- Direction = `'out'` if from `simon@republicofheat.com`, else `'in'`.
- Upsert into `event_messages` keyed on `message_id`.
- `gmail_url` = `https://mail.google.com/mail/u/0/#inbox/<thread_id>`.

Lives at `~/roh-events/tools/sync_event_messages.py`. Reuses Gmail MCP creds. **No Google OAuth added to Next.js.**

### 2. Event card thread list (Next.js)

- New helper `getEventMessages(eventId)` in `lib/events.ts`.
- New helper `getEventsAwaitingReply()` returns a `Set<eventId>` for the bell.
- Render on `/admin/events/[id]/page.tsx`: table of messages, newest at top, `→` for outbound `←` for inbound, from · date · snippet. Row is a link to Gmail.
- Bell (red dot) rendered next to event title anywhere it shows: event card, `/admin/events` table, `pipeline.html` if we regenerate it.

---

## Phased build

**Phase 1 — data (half day)**
- [ ] Migration: `event_messages` table + indexes.
- [ ] `sync_event_messages.py` — first run dry-run, then live.
- [ ] Cron entry, 15 min.

**Phase 2 — UI (half day)**
- [ ] Thread list section on `/admin/events/[id]/page.tsx`.
- [ ] Red-dot bell component + `getEventsAwaitingReply()` helper.
- [ ] Bell wired into `/admin/events` table + event card header.

Ship both same day if uninterrupted.

**Phase 3 (later, only if needed)**
- [ ] Bell for threads unreplied > N days (chase reminder).
- [ ] Snooze/dismiss on a thread ("waiting on maker, not us").
- [ ] Multi-event threads (Jüttner-style sprawl).

---

## Open questions for Nathan

1. **Sync-loop vs. live Gmail API.** Sync-loop above is simpler and reuses working Python. Live API needs Google OAuth in the admin. Vote?
2. **Bell scope** — event card only, or also on the pipeline and every table row? Simon leans "everywhere it appears" so a rot event never hides.
3. **Sent-folder search.** Current outbound goes from `simon@republicofheat.com` — does the Gmail MCP account already see `in:sent` for that address, or do we need a separate index?

---

## What Nathan doesn't need to do

- No frontend work in `packages/web`.
- No Gmail auth plumbing (unless we go live-API route).
- Backend surface = one Postgres table + one Python worker (~100 lines).

Simon builds the Next.js side. Nathan owns the table schema + reviews the sync worker.
