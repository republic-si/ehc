// Coverage reports available on disk, committed under content/coverage/ by
// ~/ehc-press/tools/publish_coverage_to_ehc.py. Keyed by REPORT KEY (hyphenated,
// which is also the URL segment); the DB campaign slug is the underscore form
// (ehsa_2026) — convert with campaignToReportKey/reportKeyToCampaign in lib/scope.

export interface CoverageReport {
  label: string;
  file: string;
  summary?: string;
}

export const REPORTS: Record<string, CoverageReport> = {
  "ehsa-2026": {
    label: "EHSA 2026",
    file: "ehsa-2026.html",
    summary: "ehsa-2026-summary.html",
  },
};
