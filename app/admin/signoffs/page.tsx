import { getPendingSignoffs } from "@/lib/admin";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

export default async function SignoffsPage() {
  const rows = await getPendingSignoffs();

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
        title="Signoffs"
        subtitle={`${rows.length} pending signoff${rows.length === 1 ? "" : "s"} across makers.`}
      />

      {sections.length === 0 && (
        <p style={{ color: "#666" }}>No pending signoffs.</p>
      )}

      {sections.map(({ key, rows }) => (
        <section key={key} style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#111",
              marginBottom: 8,
            }}
          >
            {labelFor(key)} ({rows.length})
          </h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Maker</th>
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
                    <div style={{ ...codeStyle, color: "#999" }}>
                      {r.producerSlug}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, ...codeStyle }}>
                    {r.email || "—"}
                  </td>
                  <td style={{ ...tdStyle, ...codeStyle }}>
                    {r.sentAt.slice(0, 10)}
                  </td>
                  <td style={{ ...tdStyle, ...codeStyle }}>
                    {r.dueAt?.slice(0, 10) || "—"}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: "#444" }}>
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
