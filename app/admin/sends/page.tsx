import Link from "next/link";
import { getSendCampaignRollup } from "@/lib/admin";
import { resolveScope, campaignToReportKey } from "@/lib/scope";
import { PageTitle } from "../_layout/Table";

const INK = "#1d3a2a";
const RULE = "#d9dcd7";
const MUTED = "#5a6b5f";

function span(first: string | null, last: string | null): string {
  const f = first?.slice(0, 10);
  const l = last?.slice(0, 10);
  if (!f && !l) return "—";
  if (f === l) return f ?? "—";
  return `${f} → ${l}`;
}

export default async function SendsIndex() {
  const { scope } = await resolveScope();
  const campaigns = await getSendCampaignRollup(scope);
  const totalSends = campaigns.reduce((a, c) => a + c.sends, 0);

  return (
    <>
      <PageTitle
        title="Sends"
        subtitle={`${totalSends} sends across ${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"} · ${scope.label}`}
      />

      {campaigns.length === 0 && (
        <p style={{ color: MUTED }}>
          No sends recorded for {scope.label} yet. Senders write to outlet_sends;
          older sends surface via the SENT.log → state_bootstrap.py pass.
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {campaigns.map((c) => (
          <li key={c.campaignSlug}>
            <Link
              href={`/admin/sends/${campaignToReportKey(c.campaignSlug)}`}
              style={{
                display: "block",
                padding: "16px 20px",
                border: `1px solid ${RULE}`,
                borderRadius: 8,
                background: "#fff",
                color: INK,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {c.campaignName ?? c.campaignSlug}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 12,
                      color: MUTED,
                      marginLeft: 8,
                    }}
                  >
                    {c.campaignSlug}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Archivo Black', 'Inter', sans-serif",
                    fontSize: 24,
                    color: INK,
                  }}
                >
                  {c.sends}
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 400 }}>
                    {" "}
                    sends
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>
                {c.batches} wave{c.batches === 1 ? "" : "s"}
                {c.makers ? ` · ${c.makers} makers` : ""}
                {c.bounced ? ` · ${c.bounced} bounced` : ""} ·{" "}
                {span(c.firstAt, c.lastAt)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
