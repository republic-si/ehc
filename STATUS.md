# ehc-site — status

> Last updated: 2026-07-21

> **2026-07-21 — coverage: auto-add API + fixed two real admin bugs; press-evening attendance.**
> New `POST /api/coverage/pickup` (`app/api/coverage/pickup/route.ts`) — headless twin of `savePickupAction` (same `fetchAuthority` → `upsertPickup`), gated by a bearer `COVERAGE_API_TOKEN` (set in Vercel prod+preview **and** `~/.config/ea/secrets.env`) instead of the Auth.js session. Lets `/coverage-log` add pickups without driving the form. **Bug fixed:** every coverage query gated on `press_value_eur > 0`, so any pickup with no traffic estimate (null value) was silently invisible — 21 of 66 hidden in ehsa_2026. `getCoverageRows` now lists all non-FP rows (unpriced render "—", sorted NULLS LAST); only the value aggregates stay priced-only. **Bug fixed:** admin sub-menu went stale on client-side area switch (Next.js doesn't re-render the server layout on nav) — `AdminShell` is now a client component reading `usePathname()`. Also: `sample_requests.attended` column + admin toggle for press-evening turnout. A nav scroll-pin was tried then reverted. Shipped as PRs #1–#4, #6.

> **2026-07-20 — chilifest makers: added Julie's Chili (now 20 makers) + 3 Nightjar photos.**
> New maker `julies-chili` (Yellow Habanero, 3/10, Hot sauces segment) added to `makers.ts` + `makers.de.ts` + `SEGMENT_OF` in `app/chilifest/makers/page.tsx`; photo `public/chilifest/makers/julies-chili.jpg`. Set Momo Haus photo (`momo-haus.jpg`, was null) and swapped Teig's to the Nightjar version (`teig-fullung.jpg`). Bumped the hardcoded "nineteen/neunzehn" maker count to "twenty/zwanzig" in `copy.ts` (the `{n}` CTA is dynamic). NB: typecheck was not run before commit — watch the Vercel deploy. Still missing photos: harissa-co, roots-radicals, yak-thai, dr-john-s, salsa-boy (makers never sent one).

Next.js 16 / React 19 app on Vercel (`republic-si/ehc`), Neon Postgres shared
with `~/ehc-press`. Public site (europeanheatcouncil.eu) + the internal `/admin`.

## Admin architecture (current)

- **Auth:** Auth.js v5 magic-link, session gate in `proxy.ts` + `app/admin/layout.tsx`.
  `ADMIN_PASS`/`DASH_*` retired from code. Recovery: `~/ehc-press/tools/emergency_login.py`.
- **Nav = a registry** (`lib/admin-nav.ts`): two tiers — Areas (Press | Events |
  Requests) + Sections. One shared shell (`app/admin/_shell/AdminShell.tsx`).
  Add a tool = add a registry entry.
- **Project scoping** (`lib/scope.ts`): a persistent project switcher (`ehc_project`
  cookie) scopes the Press area by Org > Campaign, gated to the user's orgs.
  "All projects" = cross-campaign. Applied to read queries via `pushScope()`.
  Events is orthogonal (no campaign column) — switcher hidden there.
- **Coverage:** `/admin/coverage` is a native, project-scoped page and **the DB
  is the source of truth**. Manage pickups in the admin ("Add pickup" form +
  per-row edit/delete/mark-FP); press value is computed in-app
  (`lib/coverage-value.ts`, ported EMV formula) and domain authority fetched via
  OpenPageRank (`lib/authority.ts`) on save. `pickups` keyed by
  `(article_url, maker_slug)`. `OPR_API_KEY` is set in Vercel prod.
  **Headless ingest:** `POST /api/coverage/pickup` (bearer `COVERAGE_API_TOKEN`)
  reuses the same `fetchAuthority` → `upsertPickup` path for programmatic adds
  (`/coverage-log`, future alert-polling) — no form/session needed. The CSV +
  coverage Python (`fetch_authority`, `build_coverage_report`, `scan_articles`,
  `import_scan`, `add_sighting`, ingest seed) are retired/archival.

## Open threads

- Pickup **bookmarklet** (was `import_scan.py` → CSV) needs re-pointing to POST
  into the DB — target now exists: `POST /api/coverage/pickup`. (Todoist: EHC.)
- Remove dead `ADMIN_PASS`/`DASH_*` env vars from Vercel.
- Producer `/portal/` (read-only) — not started.
- Re-home RSS auto-discovery (`~/ehc-press/tools/poll_alerts.py`) if still wanted.

## Notes

- Multiple Claude sessions sometimes run here — see `AGENTS.md` (stage by name,
  no `git add -A`).
- Public site now has a stylised-habanero favicon (`app/favicon.ico` +
  `icon.png` + `apple-icon.png`, App Router file convention). ChiliFest makers
  page carries a Republic of Heat partner block (EN/DE).
