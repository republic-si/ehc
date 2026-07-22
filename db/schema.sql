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

-- Optional campaign scope (e.g. 'berlin-chili-fest') so a microsite can show
-- only its own releases. NULL = global / unscoped.
ALTER TABLE releases ADD COLUMN IF NOT EXISTS campaign TEXT;
CREATE INDEX IF NOT EXISTS releases_campaign_idx ON releases (campaign);

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

-- Scoring / brand columns, loaded from coverage.csv (Phase 1 of moving coverage
-- fully into ehc). press_value_eur is the modelled EMV; the mention/link states
-- drive brand-survival; position_of_mention feeds the value formula. In Phase 2
-- these become editable in the admin and computed in-app.
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS press_value_eur      INTEGER;
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS mentions_roh         TEXT NOT NULL DEFAULT '';
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS mentions_ehsa        TEXT NOT NULL DEFAULT '';
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS follow_link_to_roh   TEXT NOT NULL DEFAULT '';
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS follow_link_to_maker TEXT NOT NULL DEFAULT '';
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS position_of_mention  TEXT NOT NULL DEFAULT '';
ALTER TABLE pickups ADD COLUMN IF NOT EXISTS link_ehsa_site       TEXT NOT NULL DEFAULT '';

-- A pickup is an article×maker event: one article covering several makers is
-- several pickups. Key on (article_url, maker_slug) so multi-maker articles
-- aren't collapsed into one. DROP+ADD so it's re-runnable (events pattern).
ALTER TABLE pickups DROP CONSTRAINT IF EXISTS pickups_pkey;
ALTER TABLE pickups ADD CONSTRAINT pickups_pkey PRIMARY KEY (article_url, maker_slug);

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

-- Per-founder decision + availability. Nullable so we can distinguish unset from 'no'.
ALTER TABLE events ADD COLUMN IF NOT EXISTS simon_decision   TEXT NULL
  CHECK (simon_decision   IS NULL OR simon_decision   IN ('yes','no'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS nathan_decision  TEXT NULL
  CHECK (nathan_decision  IS NULL OR nathan_decision  IN ('yes','no'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS simon_available  TEXT NULL
  CHECK (simon_available  IS NULL OR simon_available  IN ('yes','no'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS nathan_available TEXT NULL
  CHECK (nathan_available IS NULL OR nathan_available IN ('yes','no'));

-- Journalist sample requests (Berlin ChiliFest press hub). Gated form on
-- /chilifest writes here; reviewed manually in /admin/sample-requests before
-- anything ships. No PII beyond what a journalist volunteers to receive post.
CREATE TABLE IF NOT EXISTS sample_requests (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  organisation     TEXT NOT NULL DEFAULT '',
  web_or_instagram TEXT NOT NULL DEFAULT '',
  addr_street      TEXT NOT NULL DEFAULT '',
  addr_postcode    TEXT NOT NULL DEFAULT '',
  addr_city        TEXT NOT NULL DEFAULT '',
  addr_country     TEXT NOT NULL DEFAULT '',
  note             TEXT NOT NULL DEFAULT '',
  source           TEXT NOT NULL DEFAULT 'chilifest',
  status           TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new','approved','shipped','declined')),
  reviewed_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS sample_requests_status_idx  ON sample_requests (status);
CREATE INDEX IF NOT EXISTS sample_requests_created_idx ON sample_requests (created_at DESC);

-- Unified request form: one submission can want samples and/or the press
-- evening. Split intent into two flags (was single-valued `source`).
ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS wants_samples       BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS wants_press_evening BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing rows from the old single-valued source. Idempotent: guards
-- on the false default so re-runs are no-ops.
UPDATE sample_requests SET wants_press_evening = true
  WHERE source = 'press-evening' AND wants_press_evening = false;
UPDATE sample_requests SET wants_samples = true
  WHERE source <> 'press-evening' AND wants_samples = false AND wants_press_evening = false;

-- Did they actually turn up to the press evening? Distinct from
-- wants_press_evening (the request). Only meaningful for press-evening rows;
-- toggled by hand in /admin/sample-requests on the night / after.
ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT false;

-- Direct journalist->producer contact form (source='producer-contact'): which
-- maker the message was addressed to. Empty for samples / press-evening rows.
ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS maker TEXT NOT NULL DEFAULT '';

-- Who is asking: 'press', 'influencer' or 'trade'. The industry preview is open
-- to all three; samples only to press + influencer. Empty for legacy rows.
ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT '';
