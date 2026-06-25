CREATE TABLE IF NOT EXISTS releases (
  slug TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  subhead TEXT NOT NULL DEFAULT '',
  dateline_raw TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  iso_date DATE,
  is_draft BOOLEAN NOT NULL DEFAULT false,
  lead TEXT NOT NULL DEFAULT '',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS releases_iso_date_idx ON releases (iso_date DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS releases_country_idx ON releases (country);
CREATE INDEX IF NOT EXISTS releases_is_draft_idx ON releases (is_draft);

CREATE TABLE IF NOT EXISTS pickups (
  article_url TEXT PRIMARY KEY,
  date_spotted DATE,
  outlet_name TEXT NOT NULL DEFAULT '',
  outlet_url TEXT NOT NULL DEFAULT '',
  maker_slug TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL DEFAULT '',
  medium TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  est_reach INTEGER,
  monthly_visits_est INTEGER,
  domain_authority TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  is_false_positive BOOLEAN NOT NULL DEFAULT false,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pickups_date_idx ON pickups (date_spotted DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS pickups_maker_idx ON pickups (maker_slug);
CREATE INDEX IF NOT EXISTS pickups_fp_idx ON pickups (is_false_positive);

CREATE TABLE IF NOT EXISTS events (
  event_id          TEXT PRIMARY KEY,
  event             TEXT NOT NULL,
  city              TEXT NOT NULL DEFAULT '',
  date_2026         TEXT NOT NULL DEFAULT '',
  start_date        DATE,
  end_date          DATE,
  date_kind         TEXT NOT NULL DEFAULT 'unknown' CHECK (date_kind IN ('single','span','weekly','seasonal','various','unknown')),
  weekday           TEXT NOT NULL DEFAULT '',
  organiser_website TEXT NOT NULL DEFAULT '',
  email             TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'cold',
  target_tier       TEXT NOT NULL DEFAULT 'watching' CHECK (target_tier IN ('watching','target','locked','skip')),
  stall_cost        TEXT NOT NULL DEFAULT '',
  crowd_size        TEXT NOT NULL DEFAULT '',
  last_contact      DATE,
  priority          INTEGER,
  notes             TEXT NOT NULL DEFAULT '',
  deadline          DATE,
  distance_km       INTEGER,
  distance_band     TEXT NOT NULL DEFAULT '',
  ingested_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_start_date_idx ON events (start_date NULLS LAST);
CREATE INDEX IF NOT EXISTS events_status_idx     ON events (status);
CREATE INDEX IF NOT EXISTS events_tier_idx       ON events (target_tier);
CREATE INDEX IF NOT EXISTS events_dist_band_idx  ON events (distance_band);

-- A1: tier rename (watching/target/locked/skip -> potential/priority_for_us/we_want_to_go/not_interested)
-- Idempotent: re-running is a no-op because CASE only matches old values which are gone after first run.
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_target_tier_check;

UPDATE events SET target_tier = CASE target_tier
  WHEN 'locked'   THEN 'we_want_to_go'
  WHEN 'target'   THEN 'priority_for_us'
  WHEN 'watching' THEN 'potential'
  WHEN 'skip'     THEN 'not_interested'
  ELSE target_tier
END;

ALTER TABLE events ALTER COLUMN target_tier SET DEFAULT 'potential';

ALTER TABLE events ADD CONSTRAINT events_target_tier_check
  CHECK (target_tier IN ('we_want_to_go','priority_for_us','potential','not_interested'));

-- A2: split booking off tier, add numeric costs, add notes_en
ALTER TABLE events ADD COLUMN IF NOT EXISTS booked     BOOLEAN       NOT NULL DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS stand_cost NUMERIC(10,2);
ALTER TABLE events ADD COLUMN IF NOT EXISTS hotel_cost NUMERIC(10,2);
ALTER TABLE events ADD COLUMN IF NOT EXISTS notes_en   TEXT          NOT NULL DEFAULT '';

UPDATE events SET booked = true
  WHERE booked = false
    AND (status = 'confirmed' OR stall_cost ILIKE 'booked%');

-- (Removed: initial notes_en = notes copy backfill. Empty notes_en is the canonical
-- "untranslated" signal; E2 hook + translate:notes script populate it on demand.)

-- D2/D3 auto-rules (applied as one-shot UPDATEs, idempotent because of the tier guards)
UPDATE events SET target_tier = 'not_interested'
  WHERE event ILIKE ANY (ARRAY['%lollapalooza%','%rock am ring%','%hurricane%','%wacken%'])
    AND target_tier <> 'we_want_to_go';

-- Auto-lock Neil's chili-fest portfolio only (Berlin Chili Fest x2 + ICF Cork).
-- The earlier broad chili/chilli regex grabbed unrelated events (Stuttgart Chili
-- Fest, Pflanzenraritätenmarkt, Grillcamp Hamburg, Master of Peppers, HOT and
-- SPICY food festival) that aren't Neil's. Explicit list keeps it tight.
UPDATE events SET target_tier = 'we_want_to_go'
  WHERE event_id IN (
    'icf-cork',
    'berlin-chili-fest-spring-event',
    'berlin-chili-fest-harvest-event'
  )
    AND target_tier IN ('potential','priority_for_us');

-- Split notes from updates: notes = what the event IS, updates = email/contact log.
ALTER TABLE events ADD COLUMN IF NOT EXISTS updates    TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS updates_en TEXT NOT NULL DEFAULT '';
