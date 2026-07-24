# ehc-site — status

> Last updated: 2026-07-24

> **2026-07-24 — big shipping day: admin refresh + Typeform request form + producers-band redesign (PRs #10, #12, #13, all merged to main).**
> Three chunks, each its own branch/PR, all live on main.
> **(1) Admin refresh (#10):** rethemed the shared table primitives (`app/admin/_layout/Table.tsx`) onto the green design tokens so every admin page reads as one system; renamed "Press DB" → **Contacts** and surfaced the master-contact types (`category` media/influencer/buyer/industry via new `getOutletTypeCounts` + a type-facet on `/admin/outlets`); dashboard rebuilt on `StatTile` with contacts-by-type tiles; sign-offs now show `campaign_slug` (was already scoped, just invisible); **Sends became a two-level rollup** (`/admin/sends` campaigns → `/admin/sends/[campaign]` batch/wave rollup + all sends, tenant-gated like coverage); project switcher rebuilt from a native `<select>` into a themed dropdown that derives active state from the server `scope` (fixes the canonical-token drift) + `router.refresh()`.
> **(2) Chili Fest request form (#12):** rebuilt `RequestForm.tsx` one-thing-per-screen, **pass-first**, progressive-save: name+email commits immediately (partial lead), then role → offer → success + optional enrichment. New `sample_requests` columns (idempotent ALTERs, applied to Neon): `edit_token` (per-row secret; every post-insert patch is gated on it — verified wrong token → 0 rows), `extra_emails[]`, `completed_at`, `guest_of`. Pass guests each become a **linked door-list row** (inherits role/audience, tagged "Pass guest" in admin); **both** enrichments (guests + address) fire a **follow-up notify** to Simon, since the completion email fires before they're entered. Admin gained a **"Leads (incomplete)"** view so partial leads are chaseable. Resilience: retry-with-backoff on every call, `sessionStorage` resume on refresh, mobile-first 16px inputs. Section reframed "Request samples" → **"Get your industry pass"** (EN+DE incl. nav) and moved up under Neil's quote as a full-bleed green band.
> **(3) Producers band redesign (#13):** `/chilifest` "Meet the producers" is now feature-few + strip — three makers featured large with their **own press photos (people, not product)**: Ti Dodo Epicé (Vaanee), Qudo'tjes (Gertjan), Teig & Füllung (Bruno) — the makers who sent usable people shots (sourced from the BCF Press Maker Drive; Vaanee cropped tighter). Each has name/location/EN-DE hook/medal badge/profile link; every other maker sits in a thumbnail strip. **EHSA badge** reuses the makers-page treatment (yellow `#f4c518`) and now carries the **EHSA chili mark** keyed out of the logo (`public/chilifest/ehsa-mark.png`). Added an **Add-to-calendar** button in the preview band → static `public/chilifest-industry-preview.ics` (Fri 4 Sep 2026 **16:30–18:00** Europe/Berlin; same file reused as the email attachment, path stable). All three verified in-browser EN+DE, tsc clean. Test lead id 19 deleted from Neon.
> NB: the site `.ics` commits publicly to a **16:30–18:00** end time, but Todoist task (press-preview .ics) still assumes 16:30–19:30 — end time with Neil still unconfirmed. Remaining makers without people shots: not-that-spicy, luchadoras + the rest (only 5 of 20 uploaded a person shot). `dr-johns-person.jpg` (Albert) staged locally as a ready hero swap.

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
