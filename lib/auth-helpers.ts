// Server-side helpers for the session-based admin.
//
// Callers:
//   - proxy.ts: uses `auth()` from ../auth directly for the session check.
//   - server components under /admin/*: `requireRole()` for role-gated access.
//   - server components under /portal/*: `requireProducer()` for producer scope.
//
// Reads from users + user_organizations tables added by
// ~/ehc-press/tools/migrations/20260714_multi_tenant.sql.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/db/client";

type Role = "superadmin" | "admin" | "producer";

const RANK: Record<Role, number> = {
  producer: 1,
  admin: 2,
  superadmin: 3,
};

export interface UserRow {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  is_active: boolean;
}

export interface UserOrgRow {
  id: string;           // uuid
  slug: string;
  name: string;
  kind: "agency" | "client" | "producer";
  role_in_org: "owner" | "editor" | "viewer";
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const rows = (await sql`
    SELECT id, email, name, role, is_active
      FROM users
     WHERE email = ${email}
       AND is_active = TRUE
     LIMIT 1
  `) as UserRow[];
  return rows[0] ?? null;
}

export async function getUserOrgs(userId: number): Promise<UserOrgRow[]> {
  return (await sql`
    SELECT o.id, o.slug, o.name, o.kind, uo.role_in_org
      FROM user_organizations uo
      JOIN organizations o ON o.id = uo.organization_id
     WHERE uo.user_id = ${userId}
       AND o.is_active = TRUE
     ORDER BY o.name
  `) as UserOrgRow[];
}

/**
 * Require any active session. Redirects to /admin/login otherwise.
 * Returns the Auth.js session AND the DB user row.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }
  const user = await getUserByEmail(session.user.email);
  if (!user) {
    // Session references a user that no longer exists / is deactivated.
    redirect("/admin/login?err=user_missing");
  }
  return { session, user };
}

/**
 * Require the caller to have at least the given platform role.
 * Redirects to /admin/login with err=forbidden on insufficient role.
 */
export async function requireRole(minRole: Role) {
  const { session, user } = await requireSession();
  if (RANK[user.role] < RANK[minRole]) {
    redirect("/admin/login?err=forbidden");
  }
  return { session, user };
}

/**
 * Require the caller to be a producer (or higher). Returns their org
 * memberships so producer pages can scope queries by organization_id.
 */
export async function requireProducer() {
  const { session, user } = await requireSession();
  const orgs = await getUserOrgs(user.id);
  if (orgs.length === 0 && user.role !== "superadmin") {
    // No memberships means nothing to show.
    redirect("/admin/login?err=no_org");
  }
  return { session, user, orgs };
}
