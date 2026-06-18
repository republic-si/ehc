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
