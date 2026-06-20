import { getRecentDsns, getRecentUnsubscribes } from "@/lib/admin";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function BouncesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = sp.tab === "unsubs" ? "unsubs" : "bounces";

  return (
    <>
      <PageTitle
        title="Inbox events"
        subtitle="Bounces (DSN) and unsubscribe replies from Gmail."
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        <TabLink href="/admin/bounces" active={tab === "bounces"}>
          Bounces (14d)
        </TabLink>
        <TabLink href="/admin/bounces?tab=unsubs" active={tab === "unsubs"}>
          Unsubscribes (90d)
        </TabLink>
      </div>

      {tab === "bounces" ? <BounceTable /> : <UnsubTable />}
    </>
  );
}

async function BounceTable() {
  const rows = await getRecentDsns(14, 300);
  return (
    <>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        {rows.length} DSN(s) in the last 14 days.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Received</th>
            <th style={thStyle}>Recipient</th>
            <th style={thStyle}>Code</th>
            <th style={thStyle}>Class</th>
            <th style={thStyle}>Outlet</th>
            <th style={thStyle}>Diagnostic</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {r.receivedAt.slice(0, 16)}
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>{r.recipientEmail}</td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {r.statusCode || "—"}
              </td>
              <td style={tdStyle}>
                <span
                  style={{
                    color:
                      r.classification === "permanent"
                        ? "#c5221f"
                        : r.classification === "transient"
                          ? "#b06000"
                          : "#5f6368",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {r.classification}
                </span>
              </td>
              <td style={{ ...tdStyle, ...codeStyle, color: "#666" }}>
                {r.outletId || "—"}
              </td>
              <td style={{ ...tdStyle, fontSize: 12, color: "#666" }}>
                {(r.diagnosticText || "").slice(0, 200)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

async function UnsubTable() {
  const rows = await getRecentUnsubscribes(90, 200);
  return (
    <>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        {rows.length} unsubscribe(s) in the last 90 days.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Received</th>
            <th style={thStyle}>From</th>
            <th style={thStyle}>Phrase</th>
            <th style={thStyle}>Outlet</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {r.receivedAt.slice(0, 16)}
              </td>
              <td style={tdStyle}>
                <div style={codeStyle}>{r.fromEmail}</div>
                {r.fromName && (
                  <div style={{ fontSize: 11, color: "#666" }}>
                    {r.fromName}
                  </div>
                )}
              </td>
              <td style={{ ...tdStyle, ...codeStyle, color: "#c5221f" }}>
                {r.matchedPhrase}
              </td>
              <td style={{ ...tdStyle, ...codeStyle, color: "#666" }}>
                {r.outletId || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 700,
        padding: "6px 12px",
        background: active ? "#111" : "#fff",
        color: active ? "#F5C518" : "#111",
        border: "1px solid #111",
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}
