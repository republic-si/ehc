import { getPendingSignoffs } from "@/lib/admin";
import { resolveScope } from "@/lib/scope";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

export default async function SignoffsPage() {
  const { scope } = await resolveScope();
  const rows = await getPendingSignoffs(scope);
  // When viewing across projects, show which campaign each signoff belongs to.
  const showCampaign = scope.isAll || scope.campaignSlugs.length > 1;

  const buckets = new Map<string, typeof rows>();
  for (const r of rows) {
    const k = r.ackStatus || "sent";
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(r);
  }
  const order = ["ack_with_edits", "needs_followup", "sent"];
  const sections = order
    .filter((k) => buckets.get(k)?.length)
    .map((k) => ({ key: k, rows: buckets.get(k)! }));

  return (
    <>
      <PageTitle
        title="Sign-offs"
        subtitle={`${rows.length} pending across makers · ${scope.label}`}
      />

      {sections.length === 0 && (
        <p style={{ color: "#5a6b5f" }}>
          No pending sign-offs for {scope.label}.
        </p>
      )}

      {sections.map(({ key, rows }) => (
        <section key={key} style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#1d3a2a",
              marginBottom: 8,
            }}
          >
            {labelFor(key)} ({rows.length})
          </h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Maker</th>
                {showCampaign && <th style={thStyle}>Campaign</th>}
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Sent</th>
                <th style={thStyle}>Due</th>
                <th style={thStyle}>Subject</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.producerSlug + r.sentAt}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{r.brand}</div>
                    <div style={{ ...codeStyle, color: "#8a958e" }}>
                      {r.producerSlug}
                    </div>
                  </td>
                  {showCampaign && (
                    <td style={{ ...tdStyle, ...codeStyle }}>
                      {r.campaignSlug || "—"}
                    </td>
                  )}
                  <td style={{ ...tdStyle, ...codeStyle }}>
                    {r.email || "—"}
                  </td>
                  <td style={{ ...tdStyle, ...codeStyle }}>
                    {r.sentAt.slice(0, 10)}
                  </td>
                  <td style={{ ...tdStyle, ...codeStyle }}>
                    {r.dueAt?.slice(0, 10) || "—"}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: "#5a6b5f" }}>
                    {(r.subject || "").slice(0, 90)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
}

function labelFor(key: string): string {
  switch (key) {
    case "ack_with_edits":
      return "Ack with edits";
    case "needs_followup":
      return "Needs follow-up";
    case "sent":
      return "Sent, awaiting reply";
    default:
      return key;
  }
}
