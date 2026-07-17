// Project (campaign) scoping for the Press admin.
//
// A single persistent "current project" — held in the `ehc_project` cookie —
// scopes the whole Press area. The value is one of:
//   all                 -> All projects (cross-campaign; superadmin sees every row)
//   org:<orgSlug>       -> a whole org (all its campaigns)
//   campaign:<slug>     -> one campaign
//
// resolveScope() reads the cookie, VALIDATES it against what the logged-in user
// is allowed to see (this is the tenant gate), and expands it to a concrete
// campaign allow-list. Query functions apply it via pushScope(), which appends
// the right predicate for the two different table shapes:
//   - send/coverage tables carry a scalar `campaign_slug`  -> `= ANY($n)`
//   - press_outlets carries a `campaigns TEXT[]`           -> `&& $n` (overlap)
//
// The Python pipeline write-side (--campaign send plumbing) is a deferred
// follow-up; this file is read-side only.

import { cache } from "react";
import { cookies } from "next/headers";
import { sql } from "@/db/client";
import { requireSession, type UserRow } from "@/lib/auth-helpers";

export const PROJECT_COOKIE = "ehc_project";

export type ScopeKind = "all" | "org" | "campaign";

export interface Scope {
  kind: ScopeKind;
  orgSlug?: string;
  campaignSlug?: string;
  /** Fully-resolved campaigns this scope expands to. Empty ⇒ matches nothing. */
  campaignSlugs: string[];
  /** True only for a superadmin viewing "all": apply NO campaign predicate. */
  isAll: boolean;
  /** Canonical cookie token this scope corresponds to. */
  token: string;
  /** Human label for the switcher button. */
  label: string;
}

export interface AllowedProject {
  orgSlug: string;
  orgName: string;
  campaignSlug: string | null;
  campaignName: string | null;
}

interface ProjectRow {
  org_slug: string;
  org_name: string;
  campaign_slug: string | null;
  campaign_name: string | null;
}

/**
 * Every org (and its campaigns) the user may see. Superadmin sees all orgs;
 * everyone else only orgs they belong to. LEFT JOIN so campaign-less orgs
 * (e.g. roh, ehc) still appear as selectable org rows.
 */
export async function getUserProjects(user: UserRow): Promise<AllowedProject[]> {
  const rows =
    user.role === "superadmin"
      ? ((await sql`
          SELECT o.slug AS org_slug, o.name AS org_name,
                 c.slug AS campaign_slug, c.name AS campaign_name
            FROM organizations o
            LEFT JOIN campaigns c ON c.organization_id = o.id
           WHERE o.is_active = TRUE
           ORDER BY o.name, c.name
        `) as ProjectRow[])
      : ((await sql`
          SELECT o.slug AS org_slug, o.name AS org_name,
                 c.slug AS campaign_slug, c.name AS campaign_name
            FROM user_organizations uo
            JOIN organizations o ON o.id = uo.organization_id
            LEFT JOIN campaigns c ON c.organization_id = o.id
           WHERE uo.user_id = ${user.id} AND o.is_active = TRUE
           ORDER BY o.name, c.name
        `) as ProjectRow[]);

  return rows.map((r) => ({
    orgSlug: r.org_slug,
    orgName: r.org_name,
    campaignSlug: r.campaign_slug,
    campaignName: r.campaign_name,
  }));
}

function campaignsOf(projects: AllowedProject[]): string[] {
  return [
    ...new Set(
      projects
        .map((p) => p.campaignSlug)
        .filter((s): s is string => s !== null),
    ),
  ];
}

function defaultScope(user: UserRow, projects: AllowedProject[]): Scope {
  const orgs = [...new Set(projects.map((p) => p.orgSlug))];
  if (user.role === "superadmin") {
    return {
      kind: "all",
      campaignSlugs: campaignsOf(projects),
      isAll: true,
      token: "all",
      label: "All projects",
    };
  }
  if (orgs.length === 1) {
    const org = projects[0];
    return {
      kind: "org",
      orgSlug: org.orgSlug,
      campaignSlugs: campaignsOf(projects),
      isAll: false,
      token: `org:${org.orgSlug}`,
      label: org.orgName,
    };
  }
  // Multiple orgs, non-superadmin: "all" but still constrained to their campaigns.
  return {
    kind: "all",
    campaignSlugs: campaignsOf(projects),
    isAll: false,
    token: "all",
    label: "All projects",
  };
}

/**
 * Turn a raw cookie token into a validated Scope, gated to the user's allowed
 * set. Invalid / out-of-scope tokens fall back to the default (never leak).
 */
export function scopeFromToken(
  token: string | null | undefined,
  user: UserRow,
  projects: AllowedProject[],
): Scope {
  if (!token || token === "all") return defaultScope(user, projects);

  if (token.startsWith("campaign:")) {
    const slug = token.slice("campaign:".length);
    const match = projects.find((p) => p.campaignSlug === slug);
    if (match) {
      return {
        kind: "campaign",
        orgSlug: match.orgSlug,
        campaignSlug: slug,
        campaignSlugs: [slug],
        isAll: false,
        token,
        label: match.campaignName ?? slug,
      };
    }
  } else if (token.startsWith("org:")) {
    const orgSlug = token.slice("org:".length);
    const inOrg = projects.filter((p) => p.orgSlug === orgSlug);
    if (inOrg.length > 0) {
      return {
        kind: "org",
        orgSlug,
        campaignSlugs: campaignsOf(inOrg),
        isAll: false,
        token,
        label: inOrg[0].orgName,
      };
    }
  }

  // Unknown / not permitted -> default.
  return defaultScope(user, projects);
}

/**
 * Read the cookie, resolve + gate it, and also return the allowed project list.
 * Wrapped in React cache() so the layout and the page in the same request share
 * one session + project lookup instead of re-querying.
 */
export const resolveScope = cache(
  async (): Promise<{
    scope: Scope;
    projects: AllowedProject[];
    user: UserRow;
  }> => {
    const { user } = await requireSession();
    const projects = await getUserProjects(user);
    const store = await cookies();
    const token = store.get(PROJECT_COOKIE)?.value ?? null;
    const scope = scopeFromToken(token, user, projects);
    return { scope, projects, user };
  },
);

/**
 * Append the campaign predicate to a dynamic `where[]` / `params[]` builder
 * (the house pattern used in lib/events.ts). No-op when the scope is "all"
 * for a superadmin (isAll). `kind`:
 *   "send"   -> scalar `campaign_slug = ANY($n)`
 *   "outlet" -> array   `campaigns && $n` (overlap, GIN-indexed)
 */
export function pushScope(
  scope: Scope,
  where: string[],
  params: unknown[],
  kind: "send" | "outlet",
  col?: string,
): void {
  if (scope.isAll) return;
  const column = col ?? (kind === "outlet" ? "campaigns" : "campaign_slug");
  const idx = params.length + 1;
  if (kind === "outlet") {
    where.push(`${column} && $${idx}::text[]`);
  } else {
    where.push(`${column} = ANY($${idx}::text[])`);
  }
  params.push(scope.campaignSlugs);
}

// Coverage report files are keyed with hyphens (ehsa-2026) while DB campaign
// slugs use underscores (ehsa_2026). Normalise in one place.
export function campaignToReportKey(slug: string): string {
  return slug.replace(/_/g, "-");
}
export function reportKeyToCampaign(key: string): string {
  return key.replace(/-/g, "_");
}
