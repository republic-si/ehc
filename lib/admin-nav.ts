// Single source of truth for admin navigation.
//
// The admin is organised as two tiers:
//   - Areas    (Press | Events | Requests) — the top-level worlds of work
//   - Sections — the pages within the active area
//
// Merging a new admin tool = adding an entry here, so nothing gets orphaned.
// The AdminShell renders both tiers from this list and highlights the active
// area/section using the pure helpers below.

export interface NavSection {
  label: string;
  href: string;
}

export interface NavArea {
  key: "press" | "events" | "requests";
  label: string;
  href: string; // area landing page
  /** Press is scoped by the project switcher; Events/Requests are not. */
  projectScoped: boolean;
  sections: NavSection[];
}

export const ADMIN_NAV: NavArea[] = [
  {
    key: "press",
    label: "Press",
    href: "/admin",
    projectScoped: true,
    sections: [
      { label: "Dashboard", href: "/admin" },
      { label: "Press DB", href: "/admin/outlets" },
      { label: "Sends", href: "/admin/sends" },
      { label: "Sign-offs", href: "/admin/signoffs" },
      { label: "Bounces", href: "/admin/bounces" },
      { label: "Coverage", href: "/admin/coverage" },
    ],
  },
  {
    key: "events",
    label: "Events",
    href: "/admin/events",
    projectScoped: false,
    sections: [
      { label: "Pipeline", href: "/admin/events" },
      { label: "Deadlines", href: "/admin/events/deadlines" },
      { label: "Table", href: "/admin/events/table" },
    ],
  },
  {
    key: "requests",
    label: "Requests",
    href: "/admin/sample-requests",
    projectScoped: false,
    sections: [{ label: "Sample requests", href: "/admin/sample-requests" }],
  },
];

/** True when `href` is `path` itself or a parent segment of it. */
function isPrefix(href: string, path: string): boolean {
  return path === href || path.startsWith(href + "/");
}

/**
 * The active area is the one whose href is the longest matching prefix of the
 * current path. Longest-match so `/admin/events/deadlines` resolves to Events
 * (href `/admin/events`) rather than Press (href `/admin`).
 */
export function activeArea(pathname: string): NavArea | undefined {
  let best: NavArea | undefined;
  for (const area of ADMIN_NAV) {
    if (isPrefix(area.href, pathname)) {
      if (!best || area.href.length > best.href.length) best = area;
    }
  }
  return best;
}

/** The active section within an area, by the same longest-prefix rule. */
export function activeSection(
  pathname: string,
  area: NavArea | undefined = activeArea(pathname),
): NavSection | undefined {
  if (!area) return undefined;
  let best: NavSection | undefined;
  for (const section of area.sections) {
    if (isPrefix(section.href, pathname)) {
      if (!best || section.href.length > best.href.length) best = section;
    }
  }
  return best;
}
