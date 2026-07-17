import { getRecentSends } from "@/lib/admin";
import { resolveScope } from "@/lib/scope";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

export default async function SendsPage() {
  const { scope } = await resolveScope();
  const rows = await getRecentSends(scope, 72, 500);
  return (
    <>
      <PageTitle
        title="Recent sends"
        subtitle={`${rows.length} outlet_sends row${rows.length === 1 ? "" : "s"} in the last 72 hours.`}
      />

      {rows.length === 0 && (
        <p style={{ color: "#666" }}>
          No sends recorded yet. Senders write to outlet_sends after Phase 2.3 wiring;
          older sends only show up via the SENT.log → state_bootstrap.py pass.
        </p>
      )}

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
              <td style={{ ...tdStyle, ...codeStyle }}>{r.makerSlug}</td>
              <td style={tdStyle}>
                <div>{r.outletName || "—"}</div>
                <div style={{ ...codeStyle, color: "#999" }}>{r.outletId}</div>
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>{r.batch || "—"}</td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {r.transport || "—"}
              </td>
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
              <td style={{ ...tdStyle, fontSize: 12, color: "#444" }}>
                {(r.subject || "").slice(0, 90)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
