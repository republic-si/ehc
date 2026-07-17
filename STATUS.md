# ehc-site — status

> Last updated: 2026-07-17

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
- **Coverage:** `/admin/coverage` follows the switcher; reports are pre-generated
  HTML committed under `content/coverage/` and shown in an iframe (short-term).

## Open threads

- Coverage report: rebuild as a native, project-styled page rendered from data
  (not an embedded HTML blob). Needs a plan.
- Remove dead `ADMIN_PASS`/`DASH_*` env vars from Vercel.
- Producer `/portal/` (read-only) — not started.

## Notes

- Multiple Claude sessions sometimes run here — see `AGENTS.md` (stage by name,
  no `git add -A`).
