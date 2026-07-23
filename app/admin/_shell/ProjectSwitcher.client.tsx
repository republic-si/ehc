"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Scope, AllowedProject } from "@/lib/scope";
import { setProject } from "./actions";

// The project switcher: a themed dropdown giving the two-level Org > Campaign
// structure. Selecting calls setProject (validates + sets the ehc_project
// cookie + revalidates), then router.refresh() so every server component
// re-renders under the new scope. The active row is derived from the server
// `scope.token` prop each render, so the button label can never drift from the
// real scope (the old native <select> did — it showed the requested token while
// the cookie held the canonical one).
export function ProjectSwitcher({
  scope,
  projects,
}: {
  scope: Scope;
  projects: AllowedProject[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Group the flat allowed-project rows into orgs with their campaigns.
  const orgs: {
    slug: string;
    name: string;
    campaigns: { slug: string; name: string }[];
  }[] = [];
  for (const p of projects) {
    let org = orgs.find((o) => o.slug === p.orgSlug);
    if (!org) {
      org = { slug: p.orgSlug, name: p.orgName, campaigns: [] };
      orgs.push(org);
    }
    if (p.campaignSlug) {
      org.campaigns.push({
        slug: p.campaignSlug,
        name: p.campaignName ?? p.campaignSlug,
      });
    }
  }

  function choose(token: string) {
    setOpen(false);
    if (token === scope.token) return;
    startTransition(async () => {
      await setProject(token);
      router.refresh();
    });
  }

  // A single menu row. `depth` indents campaigns under their org.
  function Row({
    token,
    label,
    depth = 0,
  }: {
    token: string;
    label: string;
    depth?: number;
  }) {
    const active = token === scope.token;
    return (
      <button
        type="button"
        role="menuitemradio"
        aria-checked={active}
        onClick={() => choose(token)}
        className={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] transition-colors ${
          active
            ? "bg-paper-green font-semibold text-ink"
            : "text-ink hover:bg-rule-soft"
        }`}
        style={{ paddingLeft: 10 + depth * 14 }}
      >
        <span
          className="w-3 shrink-0 text-[11px]"
          aria-hidden
        >
          {active ? "✓" : ""}
        </span>
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded px-2.5 py-1 text-[12px] text-white transition-colors ${
          open ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
        } ${pending ? "opacity-60" : ""}`}
      >
        <span className="text-[10px] uppercase tracking-wider opacity-60">
          Project
        </span>
        <span className="max-w-[160px] truncate font-medium">
          {scope.label}
        </span>
        <span className="text-[9px] opacity-70" aria-hidden>
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 max-h-[70vh] w-64 overflow-auto rounded-lg border border-rule bg-paper py-1 text-ink shadow-xl"
        >
          <Row token="all" label="All projects" />
          {orgs.map((o) => (
            <div key={o.slug} className="mt-1 border-t border-rule-soft pt-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {o.name}
              </div>
              <Row token={`org:${o.slug}`} label="All of this org" depth={1} />
              {o.campaigns.map((c) => (
                <Row
                  key={c.slug}
                  token={`campaign:${c.slug}`}
                  label={c.name}
                  depth={1}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
