import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveScope, campaignToReportKey } from "@/lib/scope";
import { REPORTS } from "./reports";

export const metadata = {
  title: "Coverage — EHC Admin",
  robots: { index: false, follow: false },
};

// Coverage index — follows the project switcher. Redirects to the single
// in-scope report, lists them if several, or shows an empty state.
export default async function CoverageIndex() {
  const { scope } = await resolveScope();
  const keys = [
    ...new Set(scope.campaignSlugs.map(campaignToReportKey)),
  ].filter((k) => k in REPORTS);

  if (keys.length === 1) {
    redirect(`/admin/coverage/${keys[0]}`);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Coverage
        <span style={{ color: "#888", fontWeight: 400 }}> · {scope.label}</span>
      </h1>
      {keys.length === 0 ? (
        <p style={{ color: "#666", fontSize: 14, maxWidth: "60ch" }}>
          No coverage report has been published for this project yet. Reports are
          generated in <code>~/ehc-press</code> and published with{" "}
          <code>python3 tools/publish_coverage_to_ehc.py</code>.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {keys.map((k) => (
            <li key={k}>
              <Link
                href={`/admin/coverage/${k}`}
                style={{
                  display: "block",
                  padding: "14px 18px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#fff",
                  color: "#111",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                {REPORTS[k].label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
