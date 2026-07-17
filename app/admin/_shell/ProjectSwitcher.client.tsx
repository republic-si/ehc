"use client";

import type { Scope, AllowedProject } from "@/lib/scope";

// STEP 3 stub: shows the current project label only. Made interactive in
// Step 4 (dropdown of the user's orgs/campaigns + setProjectAction).
export function ProjectSwitcher({
  scope,
}: {
  scope: Scope;
  projects: AllowedProject[];
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-white/90 text-[12px]">
      <span className="opacity-60 text-[10px] uppercase tracking-wider">
        Project
      </span>
      <span className="font-medium">{scope.label}</span>
    </span>
  );
}
