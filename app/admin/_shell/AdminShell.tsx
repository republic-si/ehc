import Link from "next/link";
import { ADMIN_NAV, activeArea, activeSection } from "@/lib/admin-nav";
import { logoutAction } from "@/app/admin/login/actions";
import type { Scope, AllowedProject } from "@/lib/scope";
import { ProjectSwitcher } from "./ProjectSwitcher.client";

// The shared admin shell. Two tiers driven by lib/admin-nav.ts:
//   Tier 1 — Areas (Press | Events | Requests) + the project switcher (Press
//            only), sign-out, and a link back to the public site.
//   Tier 2 — the active area's sections (hidden when an area has only one).
// Every /admin/* page inherits this via app/admin/layout.tsx, so no page hand-
// writes navigation.

export function AdminShell({
  pathname,
  scope,
  projects,
  children,
}: {
  pathname: string;
  scope: Scope;
  projects: AllowedProject[];
  children: React.ReactNode;
}) {
  const area = activeArea(pathname) ?? ADMIN_NAV[0];
  const section = activeSection(pathname, area);
  const showSections = area.sections.length > 1;

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Tier 1 — areas */}
      <div className="bg-ink text-white text-[12px]">
        <div className="max-w-[1480px] mx-auto px-6 h-11 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <span className="tracking-[0.2em] uppercase text-[10px] opacity-70 font-semibold whitespace-nowrap">
              EHC · Admin
            </span>
            <nav className="flex">
              {ADMIN_NAV.map((a) => {
                const on = a.key === area.key;
                return (
                  <Link
                    key={a.key}
                    href={a.href}
                    className={`px-3 h-11 flex items-center border-b-2 transition-colors ${
                      on
                        ? "border-white text-white font-medium"
                        : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    {a.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4 whitespace-nowrap">
            {area.projectScoped ? (
              <ProjectSwitcher scope={scope} projects={projects} />
            ) : null}
            <Link href="/" className="text-white/60 hover:text-white hidden sm:inline">
              Site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-white/60 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tier 2 — sections of the active area */}
      {showSections ? (
        <div className="bg-paper-green border-b border-rule">
          <div className="max-w-[1480px] mx-auto px-6 h-10 flex items-center gap-5 overflow-x-auto">
            {area.sections.map((s) => {
              const on = s.href === section?.href;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`text-[13px] whitespace-nowrap ${
                    on
                      ? "text-ink font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <main className="max-w-[1480px] mx-auto px-6 py-6 text-[14px] leading-relaxed">
        {children}
      </main>
    </div>
  );
}
