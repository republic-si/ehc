import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveScope, reportKeyToCampaign } from "@/lib/scope";
import { getSendBatchRollup, getSendsForCampaign } from "@/lib/admin";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../../_layout/Table";

export const metadata = {
  title: "Sends — EHC Admin",
  robots: { index: false, follow: false },
};

const MUTED = "#5a6b5f";
const MUTED_SOFT = "#8a958e";

export default async function CampaignSendsPage({
  params,
}: {
  params: Promise<{ campaign: string }>;
}) {
  const { campaign } = await params;
  const campaignSlug = reportKeyToCampaign(campaign);

  // Permission gate: sends carry outlet data, so only a superadmin or a member
  // of the campaign's org may view it (independent of the switcher).
  const { projects, user } = await resolveScope();
  const allowed =
    user.role === "superadmin" ||
    projects.some((p) => p.campaignSlug === campaignSlug);
  if (!allowed) notFound();

  const label =
    projects.find((p) => p.campaignSlug === campaignSlug)?.campaignName ??
    campaignSlug;

  const [batches, rows] = await Promise.all([
    getSendBatchRollup(campaignSlug),
    getSendsForCampaign(campaignSlug),
  ]);
  const totalBounced = rows.filter((r) => r.bounced).length;

  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <Link
          href="/admin/sends"
          style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}
        >
          ← All campaigns
        </Link>
      </div>
      <PageTitle
        title={label}
        subtitle={`${rows.length} sends · ${batches.length} wave${batches.length === 1 ? "" : "s"}${totalBounced ? ` · ${totalBounced} bounced` : ""} · ${campaignSlug}`}
      />

      {/* Waves rollup */}
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: MUTED,
          margin: "8px 0",
        }}
      >
        Waves
      </h2>
      <table style={{ ...tableStyle, marginBottom: 28 }}>
        <thead>
          <tr>
            <th style={thStyle}>Batch</th>
            <th style={thStyle}>Sends</th>
            <th style={thStyle}>Makers</th>
            <th style={thStyle}>Bounced</th>
            <th style={thStyle}>First</th>
            <th style={thStyle}>Last</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b.batch}>
              <td style={{ ...tdStyle, ...codeStyle, fontWeight: 600 }}>
                {b.batch}
              </td>
              <td style={tdStyle}>{b.sends}</td>
              <td style={tdStyle}>{b.makers || "—"}</td>
              <td style={tdStyle}>
                {b.bounced ? (
                  <span style={{ color: "#c5221f", fontWeight: 700 }}>
                    {b.bounced}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {b.firstAt?.slice(0, 16) || "—"}
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {b.lastAt?.slice(0, 16) || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* All sends */}
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: MUTED,
          margin: "8px 0",
        }}
      >
        All sends
      </h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Sent</th>
            <th style={thStyle}>Maker</th>
            <th style={thStyle}>Outlet</th>
            <th style={thStyle}>Batch</th>
            <th style={thStyle}>Transport</th>
            <th style={thStyle}>Bounced</th>
            <th style={thStyle}>Subject</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.outletId}-${r.sentAt}-${r.makerSlug}`}>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {r.sentAt.slice(0, 16)}
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>{r.makerSlug || "—"}</td>
              <td style={tdStyle}>
                <div>{r.outletName || "—"}</div>
                <div style={{ ...codeStyle, color: MUTED_SOFT }}>
                  {r.outletId}
                </div>
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>{r.batch || "—"}</td>
              <td style={{ ...tdStyle, ...codeStyle }}>{r.transport || "—"}</td>
              <td style={tdStyle}>
                {r.bounced ? (
                  <span
                    style={{
                      color: "#c5221f",
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                    }}
                  >
                    Bounced
                  </span>
                ) : (
                  ""
                )}
              </td>
              <td style={{ ...tdStyle, fontSize: 12, color: MUTED }}>
                {(r.subject || "").slice(0, 90)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
