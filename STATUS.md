# ehc-site — status

> Last updated: 2026-07-23

> **2026-07-23 — admin login + form-notification outage: revoked Gmail App Password. Fixed.**
> Symptom reported as "the chilifest form is broken — sent myself a message, got nothing." Real chain: the form **works** (submissions save to Neon; test lead id 16 was safe all along) but (a) admin defaults to the **Samples** tab, which filters `wants_samples=true` and so hides preview-only requests — Simon's test was industry-preview-only, so it sat invisibly under the **Press evening** tab; and (b) **admin login itself was down** — `/api/auth/error?error=Configuration` 500. Root cause (from Vercel runtime logs): `[auth][error] Invalid login: 535-5.7.8 Username and Password not accepted` — the **Gmail App Password for `simon@republicofheat.com` had been revoked**, so Nodemailer/SMTP couldn't send the magic link *or* the form notification (`lib/mailer` uses the same creds). Env vars were all present on Vercel — not a missing-env case this time. **Fix:** minted a fresh App Password, updated `EMAIL_SERVER_PASSWORD` in `.env.local` **and** Vercel prod, redeployed prod (`dpl_EFj2XGnhV5K5Hbpujo9hejg2ACc3`). **Verified:** SMTP login OK, live login now shows the "Check your email" verify-request page (no 500), and the sign-in email arrives. Stopgap during the fix: minted an emergency Neon session via `~/ehc-press/tools/emergency_login.py` (30-day). Follow-ups filed in Todoist/EHC: migrate transactional email to **Resend** (ends this recurring failure class), fix the public form button stuck on "Sending…" (no success confirmation), and stop the admin Samples default tab hiding preview-only requests.

> **2026-07-22 — chilifest: reframed the press evening as an "Industry Preview" + added press/influencer/trade roles to both contact forms.**
> Trade and press now share one event. Copy across the hub, fact panels, and the `PRESS_EVENING` blurb (`lib/chilifest/copy.ts` + `media.ts`, EN + DE) went from "accredited press only" → **Industry Preview** (DE *Fachvorschau*), "for press, influencers & trade". Both forms — the samples/press-pass form (`RequestForm.tsx`) and the direct producer-contact form (`ProducerContactForm.tsx`) — gained a **Press / Influencer / Trade** picker. **Trade can't request posted sample packs:** the "Send me samples" toggle is hidden client-side when Trade is selected *and* enforced in the `submitPressRequest` server action (`wants_samples && role !== "trade"`). Role is persisted: new idempotent `role` column on `sample_requests` (migration + data layer in `lib/sample-requests.ts`), shown as its own column in `/admin/sample-requests`, selectable on the manual-add form, and included in both notification emails (subject + body). tsc clean, build green, migration applied to Neon, browser-verified (Trade collapses samples to just the preview pass). Commit `2ab829c`, pushed to main.

> **2026-07-22 — structured-data pass: fixed press-hub cannibalisation + scoped a NewsMediaOrganization publisher for Google News.**
> Three schema changes. (1) **`/chilifest` was emitting a top-level `Event`** — a press hub claiming to *be* the Berlin Chili Fest, competing with the real event site (chilifest.eu) for the event rich result. Swapped for a `CollectionPage` whose event lives under `about` with `url → chilifest.eu`, so crawl authority flows *out* to the canonical event page instead of being claimed here. (2) **Homepage had no identity schema** — added an `Organization` + `WebSite` `@graph` (`app/page.tsx`); kept type `Organization` (convening body), not `NewsMediaOrganization`, since EHC isn't a news outlet. No `sameAs` yet (no social URLs in repo). (3) **Google-News groundwork:** every release's `NewsArticle.publisher` now references a single `newsPublisher` entity in `lib/site.ts` — typed `NewsMediaOrganization`, stable `@id`, `foundingDate` 2026, `publishingPrinciples`/`correctionsPolicy` → `/about`. News identity is scoped to the press function only; homepage entity stays a plain Organization. News sitemap (`news-sitemap.xml`, release-only, 48h) + `NewsArticle` schema were already correct. **Next (Simon's move, not code): create the publication in Google Publisher Center + confirm each release shows a clear byline/date.** tsc clean, build green.

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
