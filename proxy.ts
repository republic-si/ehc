// Next.js 16 proxy (formerly middleware).
//
// Phase 2 replacement for the ADMIN_PASS-based middleware.ts that keeps
// getting locked out when Vercel loses env vars. Reads Auth.js sessions
// directly from the DB (via the auth() export from ~/ehc-site/auth.ts),
// so an emergency session row inserted by ~/ehc-press/tools/emergency_login.py
// unblocks access even if RESEND_API_KEY / AUTH_SECRET disappear.
//
// SHIP CHECKLIST BEFORE DELETING middleware.ts:
//   1. `pnpm add next-auth@beta @auth/neon-adapter nodemailer@^7 @types/nodemailer@^6`
//   2. Vercel env vars set: AUTH_SECRET, EMAIL_SERVER_HOST, EMAIL_SERVER_PORT,
//      EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD (Gmail App Password),
//      EMAIL_FROM, AUTH_URL.
//   3. Local `pnpm build` passes.
//   4. Emergency-login script tested end-to-end against prod DB.
//   5. Delete middleware.ts (or Next.js 16 will complain about both).

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/strategy.html"],
};

// Shared-password gate for the distilled strategy doc. It's a static file in
// public/, so the only place to gate it is here. HTTP Basic Auth (native
// browser prompt, no login page) against a HARDCODED password — deliberately
// not an env var, because Vercel has silently dropped this site's env vars 3×.
// Low-stakes noindex doc; fail-closed if the header is missing/wrong.
const STRATEGY_PASS = "chilioil2026";

// Next.js 16 proxy files are loaded via the named `proxy` export (the
// loader reads `mod.proxy` first and only falls back to `mod.default`,
// which the edge bundle drops). A default export 500s with
// "must export a function named `proxy`". Auth.js `auth(cb)` returns an
// async handler function, so the named const satisfies the loader.
export const proxy = auth((req) => {
  const path = req.nextUrl.pathname;

  // Strategy doc: shared-password Basic Auth, resolved before any Auth.js
  // session logic so it never touches the admin/portal magic-link flow.
  if (path === "/strategy.html") {
    const hdr = req.headers.get("authorization") ?? "";
    const [scheme, encoded] = hdr.split(" ");
    let ok = false;
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded); // "user:pass"
      ok = decoded.slice(decoded.indexOf(":") + 1) === STRATEGY_PASS;
    }
    if (!ok) {
      return new NextResponse("Authentication required.", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="EHC Strategy", charset="UTF-8"',
        },
      });
    }
    return NextResponse.next();
  }

  // Set x-pathname so server layouts can read it via headers() and skip
  // the requireSession() call on login pages (avoids a redirect loop).
  const forward = new Headers(req.headers);
  forward.set("x-pathname", path);

  // Login page + magic-link check-email page are matched by the config below
  // but must be reachable without a session.
  if (
    path === "/admin/login" ||
    path === "/admin/login/check-email" ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next({ request: { headers: forward } });
  }

  // No session -> bounce to login, remember where they wanted to go.
  if (!req.auth?.user?.email) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers: forward } });
});
