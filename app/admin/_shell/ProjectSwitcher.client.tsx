"use client";

import { useRef } from "react";
import type { Scope, AllowedProject } from "@/lib/scope";
import { setProjectAction } from "./actions";

// The project switcher: a native <select> with optgroups giving the two-level
// Org > Campaign structure. Selecting auto-submits the form, which calls
// setProjectAction (validates + sets the ehc_project cookie + revalidates the
// admin). Native select degrades without JS (the change just won't auto-submit;
// a browser that shows a submit button still works).
export function ProjectSwitcher({
  scope,
  projects,
}: {
  scope: Scope;
  projects: AllowedProject[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

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
      org.campaigns.push({ slug: p.campaignSlug, name: p.campaignName ?? p.campaignSlug });
    }
  }

  return (
    <form action={setProjectAction} ref={formRef}>
      <label className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-[12px] text-white/90">
        <span className="text-[10px] uppercase tracking-wider opacity-60">
          Project
        </span>
        <select
          name="token"
          defaultValue={scope.token}
          onChange={() => formRef.current?.requestSubmit()}
          aria-label="Current project"
          className="bg-transparent font-medium text-white outline-none [&>*]:text-ink"
        >
          <option value="all">All projects</option>
          {orgs.map((o) => (
            <optgroup key={o.slug} label={o.name}>
              <option value={`org:${o.slug}`}>{o.name} — all</option>
              {o.campaigns.map((c) => (
                <option key={c.slug} value={`campaign:${c.slug}`}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
    </form>
  );
}
