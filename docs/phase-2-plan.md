# Phase 2: Auth.js magic-link, replace ADMIN_PASS

Reference: `~/.claude/plans/lazy-puzzling-simon.md`

Status: **LIVE as of 2026-07-17.** Flip committed (`2f56511`), `middleware.ts`
deleted, `ADMIN_PASS`/`DASH_*` retired from code. The flip initially 500'd
every `/admin/*` route on Next 16 (async `auth` export + default `proxy`
export); fixed in `6210dde`. Verified in prod: `/admin/login` renders the
email form (200), `/admin/events` redirects unauthenticated users to
`/admin/login?next=...` (307). Vercel env vars (`AUTH_SECRET`,
`EMAIL_SERVER_*`, `EMAIL_FROM`, `DATABASE_URL`) are set — the login page
resolves `auth()` without erroring. **Outstanding:** the magic-link email
round-trip (send -> click -> land in `/admin`) still needs one manual
end-to-end test from Simon's inbox; and Phases 3-5 (multi-tenant UI,
producer portal, remove the Vercel env vars) remain as follow-ups below.

---

## What's on disk right now (historical draft notes; the flip has since shipped)

New files under ehc-site:

- [`auth.ts`](../auth.ts) — Auth.js v5 config, Neon adapter, Nodemailer/Gmail SMTP provider, DB session strategy
- [`lib/auth-helpers.ts`](../lib/auth-helpers.ts) — `requireSession`, `requireRole`, `requireProducer` + user/org queries
- [`app/api/auth/[...nextauth]/route.ts`](../app/api/auth/[...nextauth]/route.ts) — Auth.js route handlers
- [`proxy.ts`](../proxy.ts) — Next.js 16 middleware replacement (session-based check)

New file under ehc-press:

- `~/ehc-press/tools/emergency_login.py` — safety-net script (inserts a session row directly, prints cookie value)

The live app is still running on `middleware.ts` + ADMIN_PASS. Nothing has changed for real users yet.

---

## Deps to add before flip

In `~/ehc-site/`:

```
pnpm add next-auth@beta @auth/neon-adapter nodemailer@^7 @types/nodemailer@^6
```

Currently installed (verify with `pnpm ls`): none of these three.

---

## Env vars needed (Vercel prod + local `.env.local`)

| Name | Value | Notes |
|---|---|---|
| `AUTH_SECRET` | 32 random bytes, base64 | `openssl rand -base64 32` |
| `EMAIL_SERVER_HOST` | `smtp.gmail.com` | Google Workspace SMTP endpoint |
| `EMAIL_SERVER_PORT` | `587` | STARTTLS |
| `EMAIL_SERVER_USER` | `simon@republicofheat.com` (or another Workspace address) | Google account that owns the app password |
| `EMAIL_SERVER_PASSWORD` | Gmail App Password, 16 chars, no spaces | Generate at `myaccount.google.com/apppasswords`. NOT your Google login password. |
| `EMAIL_FROM` | `"EHC Admin <simon@republicofheat.com>"` or a verified send-as alias like `press@republicofheat.com` | **HARD CONSTRAINT:** Gmail Workspace strictly enforces that this address matches the authenticated user OR one of their verified send-as aliases. Anything else = silent SMTP-level rejection. Test locally before Vercel deploy. |
| `AUTH_URL` (or `NEXTAUTH_URL`) | `https://europeanheatcouncil.eu` | Auto-detected in dev |
| `DATABASE_URL` | Neon DSN | Already set |

### Gmail App Password one-time setup

1. `myaccount.google.com/apppasswords` (must be logged in as the Workspace account listed as `EMAIL_SERVER_USER`).
2. App name: "EHC Admin auth (Vercel prod)". Generate.
3. Google shows a 16-character password once. Copy immediately, paste into `EMAIL_SERVER_PASSWORD` in Vercel + `.env.local`.
4. If lost, revoke and regenerate — no way to view it again.
5. Requires 2-Step Verification enabled on the Google account (which Workspace enforces anyway).

Existing `ADMIN_PASS` / `DASH_USER` / `DASH_PASS` stay for now; Phase 5 removes them.

### File permissions (once emergency_login.py is on disk)

```
chmod 700 ~/ehc-press/tools/emergency_login.py    # only owner may execute
chmod 600 ~/ehc-press/.env                         # only owner may read (contains DSN)
```

The emergency-login script is root-level access to the admin surface. Anyone who can run it + read the DSN can mint a session as the superadmin. Keep both locked down and off shared drives.

---

## Files to modify at flip time

### Delete

- `middleware.ts` — Next.js 16 supersedes it with `proxy.ts`. Having both is a lint error.

### Migrate old-auth callsites

`grep -rE "admin_auth|assertAuth|ADMIN_PASS" ~/ehc-site/app ~/ehc-site/lib` currently returns:

- `app/admin/events/actions.ts` — `assertAuth()` at lines 28, 65, 137, 160 reads `ADMIN_PASS` cookie
- `app/admin/login/actions.ts` — `loginAction` reads `ADMIN_PASS`
- `app/admin/login/page.tsx` — password-based form

All three flip in the same commit. `app/admin/events/actions.ts` gets a new helper:

```ts
"use server";
import { requireSession } from "@/lib/auth-helpers";
// remove the old assertAuth() function entirely
// replace `await assertAuth();` with `await requireSession();` at every callsite
```

The rest of `events/actions.ts` (updateEvent, addPickup, saveNotes, etc.) stays unchanged — only the auth guard swaps.

### Replace

- `app/admin/login/page.tsx` — password field becomes an email field:

```tsx
import { signIn } from "@/auth";

export const metadata = {
  title: "Admin login — EHC",
  robots: { index: false, follow: false },
};

type SP = Promise<{ next?: string; err?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/admin/events";
  const err = sp.err;

  return (
    <main className="min-h-[80vh] bg-paper-green flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-muted mb-3">
          European Heat Council · Admin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Sign in
        </h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Enter your email. We'll send a one-click sign-in link.
        </p>

        <form
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", {
              email: String(formData.get("email") ?? ""),
              redirectTo: next,
            });
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-muted">
              Email
            </span>
            <input
              type="email"
              name="email"
              autoFocus
              autoComplete="email"
              required
              className="mt-2 w-full bg-white border border-rule px-3 py-2 text-base text-ink rounded-sm focus:outline-none focus:border-ink"
            />
          </label>

          {err === "forbidden" ? (
            <p className="text-sm text-[#c8261c]">You don't have access to this area.</p>
          ) : err === "user_missing" ? (
            <p className="text-sm text-[#c8261c]">Session expired. Sign in again.</p>
          ) : err === "no_org" ? (
            <p className="text-sm text-[#c8261c]">Your account has no organisations yet.</p>
          ) : err === "config" ? (
            <p className="text-sm text-[#c8261c]">Auth not configured (EMAIL_SERVER_* or DATABASE_URL missing).</p>
          ) : null}

          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm font-medium bg-ink text-white rounded-sm hover:bg-ink-deep transition-colors"
          >
            Send sign-in link
          </button>
        </form>
      </div>
    </main>
  );
}
```

- `app/admin/login/actions.ts` — password check goes away, replaced by Auth.js signIn (handled inline in the page above). File can be deleted, or kept for `logoutAction`:

```ts
"use server";
import { signOut } from "@/auth";

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
```

### Layout-level session enforcement

- `app/admin/layout.tsx` — wrap every admin route in a session check at the layout level. This guarantees `is_active` is validated on every request (a deactivated user can't slip through by hitting a route whose page component forgot to call `requireSession()`):

```tsx
import type { Metadata } from "next";
import { requireSession } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "Admin — EHC",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-component enforcement. Redirects to /admin/login if no
  // session, if the session's user no longer exists, or if is_active
  // has been flipped to FALSE. Runs on every /admin/* request via
  // Next.js layout inheritance.
  await requireSession();

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", color: "#111" }}>
      <main
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "24px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        {children}
      </main>
    </div>
  );
}
```

Note: `/admin/login` and `/admin/login/check-email` are children of `/admin/layout.tsx`. To prevent the redirect loop, either:
1. Make login pages a route group `(auth)` that opts out of the parent layout, OR
2. Add a guard inside `AdminLayout` that skips `requireSession()` for `/admin/login*` paths (needs `headers()` to read the pathname).

Option 1 is the Next.js idiom. Route groups don't appear in URLs, so we can use `app/admin/(no-auth)/login/*` (nested group inside admin) — URL stays `/admin/login`, and the nested group can define its own layout that skips `requireSession()`. Structure:

```
app/admin/
  layout.tsx                    # calls await requireSession() — protects real admin pages
  page.tsx                      # /admin (behind session)
  events/, outlets/, sends/     # /admin/events, /admin/outlets, etc. (behind session)
  (no-auth)/                    # route group — pages inherit THIS group's layout, not app/admin/layout.tsx
    layout.tsx                  # empty passthrough, no session check
    login/
      page.tsx                  # /admin/login (accessible without session)
      check-email/page.tsx      # /admin/login/check-email
```

Verify Next.js 16 route-group behaviour before shipping: does a nested `(group)` inside a parent segment really opt out of the parent's `layout.tsx`? If not, use the pathname header guard alternative (below).

**Fallback if nested groups don't opt out cleanly:** put a pathname check inside `app/admin/layout.tsx` reading `headers().get("x-pathname")` (set from proxy.ts if needed) and skip `requireSession()` when path starts with `/admin/login`.

### New page (for magic-link verify-request step)

- `app/admin/login/check-email/page.tsx` — Auth.js redirects here after sending the magic link:

```tsx
export const metadata = { title: "Check your email — EHC" };
export default function CheckEmail() {
  return (
    <main className="min-h-[80vh] bg-paper-green flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-ink mb-3">Check your email</h1>
        <p className="text-sm text-muted leading-relaxed">
          A one-click sign-in link is on its way. It works for 24 hours.
          If it doesn't arrive in a couple of minutes, check spam or try again.
        </p>
      </div>
    </main>
  );
}
```

---

## Deployment sequence

1. **Local install.** `pnpm add next-auth@beta @auth/neon-adapter nodemailer@^7 @types/nodemailer@^6`. Confirm no peer-dep warnings (Auth.js v5 requires `nodemailer@^7`, not @9).
2. **Delete `middleware.ts`.** Next.js 16 supports one control file per project; keeping both fails the build. This is the point of no return — from here the local build reflects the new auth logic.
3. **Local build.** `pnpm build`. Must pass green before any Vercel deploy.
4. **Generate the Gmail App Password** (per one-time setup above). Confirm you can send a test email via any SMTP client using host/port/user/password before Vercel sees it.
5. **Add env vars to Vercel** (Settings → Environment Variables → Production). `AUTH_SECRET`, `EMAIL_SERVER_*`, `EMAIL_FROM`, `AUTH_URL` (optional but recommended: explicit `https://europeanheatcouncil.eu`; auto-detected via `X-Forwarded-Host` if omitted). Verify `DATABASE_URL` is still there.
6. **Test emergency-login script** against prod DB, cookie-paste, confirm we're in via `/admin/events` **before** the flip lands on Vercel.
7. **Commit the flip**: delete `middleware.ts`, replace `login/page.tsx`, replace `login/actions.ts` (keep only `logoutAction`), add `login/check-email/page.tsx`. One commit.
8. **Deploy to prod.** Vercel picks up the change.
9. **Verify magic-link flow end-to-end**: incognito browser → `/admin/events` → redirects to `/admin/login` → enter email → receive Gmail SMTP link within ~30s → click → land at `/admin/events`. If the redirect from `signIn()` misbehaves and the user is stuck on `/admin/login`, check that `pages.verifyRequest` is being honoured by the Email flow (Auth.js v5 should redirect to `/admin/login/check-email` automatically). If the email never arrives, first check the sender's Gmail Sent folder — SMTP send success but delivery failure is diagnostic.
10. **Verify emergency-login again post-flip** so we know it still works with the new proxy active.
11. **Verify Vercel-lost-creds recovery**: remove `EMAIL_SERVER_*` from Vercel prod, redeploy, confirm magic link fails BUT emergency-login still works end-to-end. Restore the key.

---

## Failure modes and the DB single-point-of-failure trade-off

After Phase 2, the failure surface changes shape:

| What's lost in Vercel prod | Today's behaviour | Phase 2 behaviour |
|---|---|---|
| `ADMIN_PASS` / `DASH_USER` / `DASH_PASS` | 503, full lockout, no recovery | Not read anymore; irrelevant |
| `AUTH_SECRET` | n/a | Auth.js throws per-request 500. Emergency script still works. |
| `EMAIL_SERVER_*` | n/a | Magic link fails to send. Emergency script still works. |
| `DATABASE_URL` | Queries fail everywhere (whole app broken) | Same, plus emergency script cannot connect. Full lockout. |

**Explicit trade-off:** Phase 2 makes `DATABASE_URL` a single-point-of-failure for both normal login and the emergency backstop. That's acceptable only because:

1. `DATABASE_URL` powers every page in the app already. If it's lost, the app is broken regardless of auth. Losing auth on top of that is a rounding error.
2. Neon's own availability is a stronger dependency than Vercel's env-var sync (which has failed three times), which is why we're pivoting to DB-backed auth in the first place.
3. Neon has PITR (point-in-time recovery) and daily backups; even if the DSN itself is wiped from Vercel, restoring it is a one-line paste from `~/ehc-press/.env`.

If Neon itself goes down (SLA event), no auth path works. That's genuinely worse than today's ADMIN_PASS setup if you consider only auth. But we're already betting the app on Neon for every page load, so this doesn't add new risk in practice.

**Verification of the trade-off before flip:** step 11 of the deployment sequence explicitly removes `EMAIL_SERVER_*` and confirms emergency-login still works. Do NOT test by removing `DATABASE_URL` — that would take the whole app down.

## Rollback

If step 6 or later goes sideways:

- Revert the flip commit: `git revert HEAD` in `~/ehc-site/`, push. Vercel redeploys the old `middleware.ts` + password login.
- `sessions` table stays populated but unused (no cost).
- `users`, `organizations`, `user_organizations` stay populated (foundation for retry).
- No data loss anywhere.

---

## Follow-ups (not Phase 2)

- Phase 3: multi-tenant admin UI (campaign / org filter on `/admin/outlets`)
- Phase 4: producer portal at `/portal/coverage`
- Phase 5: retire ADMIN_PASS + DASH_USER + DASH_PASS + `/2026-ehsa-press/*` env-var auth
