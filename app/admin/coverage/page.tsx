import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveScope, campaignToReportKey, pushScope } from "@/lib/scope";
import { sql } from "@/db/client";

export const metadata = {
  title: "Coverage — EHC Admin",
  robots: { index: false, follow: false },
};

// Coverage index — follows the project switcher. "Has coverage" = the campaign
// has priced pickups in the DB. Redirects to the single in-scope campaign,
// lists them if several, or shows an empty state.
export default async function CoverageIndex() {
  const { scope } = await resolveScope();

  const where = ["is_false_positive = false AND press_value_eur > 0"];
  const params: unknown[] = [];
  pushScope(scope, where, params, "send", "p.campaign_slug");
  const rows = (await sql.query(
    `SELECT p.campaign_slug AS slug, c.name AS name, count(*)::int AS n
       FROM pickups p JOIN campaigns c ON c.slug = p.campaign_slug
      WHERE ${where.join(" AND ")}
      GROUP BY p.campaign_slug, c.name
      ORDER BY c.name`,
    params,
  )) as { slug: string; name: string; n: number }[];

  if (rows.length === 1) {
    redirect(`/admin/coverage/${campaignToReportKey(rows[0].slug)}`);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Coverage
        <span style={{ color: "#888", fontWeight: 400 }}> · {scope.label}</span>
      </h1>
      {rows.length === 0 ? (
        <p style={{ color: "#666", fontSize: 14, maxWidth: "60ch" }}>
          No priced coverage for this project yet. Add pickups to the ledger and
          refresh (<code>pnpm ingest:coverage</code>).
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {rows.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/admin/coverage/${campaignToReportKey(r.slug)}`}
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
                {r.name}
                <span style={{ color: "#888", fontWeight: 400 }}>
                  {" "}
                  · {r.n} pickups
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
