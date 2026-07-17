# ehc-site — status

> Last updated: 2026-07-18

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
  `(article_url, maker_slug)`. `OPR_API_KEY` is set in Vercel prod. The CSV +
  coverage Python (`fetch_authority`, `build_coverage_report`, `scan_articles`,
  `import_scan`, `add_sighting`, ingest seed) are retired/archival.

## Open threads

- Pickup **bookmarklet** (was `import_scan.py` → CSV) needs re-pointing to POST
  into the DB, or captures get re-keyed via the Add-pickup form.
- Remove dead `ADMIN_PASS`/`DASH_*` env vars from Vercel.
- Producer `/portal/` (read-only) — not started.
- Re-home RSS auto-discovery (`~/ehc-press/tools/poll_alerts.py`) if still wanted.

## Notes

- Multiple Claude sessions sometimes run here — see `AGENTS.md` (stage by name,
  no `git add -A`).
