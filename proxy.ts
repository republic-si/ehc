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
  matcher: ["/admin/:path*", "/portal/:path*"],
};

export default auth((req) => {
  const path = req.nextUrl.pathname;

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
