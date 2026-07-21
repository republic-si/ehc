// Board-ready coverage rollup for one campaign — the /press-report deliverable.
// Reuses the SAME scoped queries the admin uses (lib/coverage.ts), so the
// numbers match /admin/coverage exactly. Self-press is auto-excluded (VALUED =
// press_value_eur > 0, and self-press is priced at 0).
//
// Run:  pnpm tsx --env-file=.env.local scripts/coverage-report.ts ehsa_2026
//   (defaults to ehsa_2026 if no arg)
//
// Read-only. Prints markdown to stdout — pipe to a file or paste to the board.

import {
  getCoverageStats,
  getCoverageByMaker,
  getCoverageByScope,
  getBrandSurvival,
} from "../lib/coverage.ts";
import type { Scope } from "../lib/scope.ts";

const campaign = process.argv[2] || "ehsa_2026";

// Minimal campaign-kind scope. pushScope only reads isAll + campaignSlugs.
const scope = {
  kind: "campaign",
  campaignSlug: campaign,
  campaignSlugs: [campaign],
  isAll: false,
  token: `campaign:${campaign}`,
} as Scope;

const eur = (n: number) => "€" + n.toLocaleString("en-GB");

async function main() {
  const [stats, byMaker, byScope, survival] = await Promise.all([
    getCoverageStats(scope),
    getCoverageByMaker(scope),
    getCoverageByScope(scope),
    getBrandSurvival(scope),
  ]);

  const L: string[] = [];
  L.push(`# Coverage report — ${campaign}`);
  L.push("");
  L.push(`> Valued pickups only (real, priced, not false positives). Self-press excluded.`);
  L.push("");
  L.push(`- **Total press value: ${eur(stats.totalEur)}**`);
  L.push(`- Pickups: ${stats.pickupCount} across ${stats.makerCount} makers`);
  if (stats.dateFrom) L.push(`- Window: ${stats.dateFrom} to ${stats.dateTo}`);
  L.push("");

  L.push(`## By maker`);
  L.push("");
  L.push(`| Maker | Pickups | Value |`);
  L.push(`| --- | ---: | ---: |`);
  for (const m of byMaker) L.push(`| ${m.label} | ${m.count} | ${eur(m.eur)} |`);
  L.push("");

  L.push(`## By reach`);
  L.push("");
  L.push(`| Scope | Pickups | Value |`);
  L.push(`| --- | ---: | ---: |`);
  for (const s of byScope) L.push(`| ${s.scope} | ${s.count} | ${eur(s.eur)} |`);
  L.push("");

  L.push(`## Brand survival`);
  L.push("");
  L.push(`- Of ${survival.total} pickups: ${survival.ehsaNamed} name EHSA, ${survival.rohNamed} name ROH, ${survival.rohLinked} link ROH.`);
  L.push("");

  console.log(L.join("\n"));
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
