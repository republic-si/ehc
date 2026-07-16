// Auth.js v5 config for the ehc-site admin surface.
//
// Wired up as part of Phase 2 of the EHC multi-tenant press pivot
// (~/.claude/plans/lazy-puzzling-simon.md). Replaces the fragile
// ADMIN_PASS env-var check that has been lost by Vercel three times.
//
// Stack: next-auth@beta + @auth/neon-adapter + Nodemailer over Gmail
// Workspace SMTP (magic link). Reuses Simon's existing verified Gmail
// sender identities; no new external service.
// Session strategy: database (so the emergency_login.py safety net can
// insert a valid session row directly into Neon when Vercel env vars
// disappear).
//
// Users, sessions, accounts, verification_token tables are seeded by
// ~/ehc-press/tools/migrations/20260714_multi_tenant.sql.

import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Neon serverless expects a Pool per request; DO NOT hoist to module scope.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  return {
    adapter: NeonAdapter(pool),
    providers: [
      Nodemailer({
        server: {
          host: process.env.EMAIL_SERVER_HOST ?? "smtp.gmail.com",
          port: Number(process.env.EMAIL_SERVER_PORT ?? "587"),
          // `secure` intentionally omitted (defaults to false). Port 587 is
          // STARTTLS: connection opens plain, then negotiates TLS. Setting
          // secure:true would force implicit TLS which is port 465, wrong here.
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            // Gmail App Password (16 chars, no spaces). Generate at:
            // https://myaccount.google.com/apppasswords
            // App password is per-Google-account, not per-alias.
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        // MUST be a Gmail Workspace address Simon owns (or a verified
        // send-as alias like press@republicofheat.com). Gmail rejects
        // sends from arbitrary "from" domains.
        from: process.env.EMAIL_FROM ?? "simon@republicofheat.com",
      }),
    ],
    session: {
      strategy: "database",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // Lock the sessionToken cookie name explicitly. Auth.js defaults to
    // "__Secure-authjs.session-token" in production and "authjs.session-token"
    // in dev, but we pin it so tools/emergency_login.py can rely on a stable
    // name regardless of future Auth.js version changes.
    cookies: {
      sessionToken: {
        name:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
    pages: {
      signIn: "/admin/login",
      verifyRequest: "/admin/login/check-email",
    },
    callbacks: {
      // With the database session strategy the adapter passes the DB `user`
      // row into this callback. We surface `user.id` on session.user so
      // downstream helpers (lib/auth-helpers.ts) can look it up cheaply.
      // Guarded so a misconfigured adapter can't crash the callback.
      async session({ session, user }) {
        if (user?.id != null && session.user) {
          (session.user as { id?: string | number }).id = user.id;
        }
        return session;
      },
    },
    trustHost: true,
  };
});
