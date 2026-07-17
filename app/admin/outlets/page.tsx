import Link from "next/link";
import { getOutletsByStatus, type OutletStatus } from "@/lib/admin";
import { resolveScope } from "@/lib/scope";
import {
  PageTitle,
  StatusPill,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

const TABS: { status: OutletStatus; label: string }[] = [
  { status: "active", label: "Active" },
  { status: "bounced", label: "Bounced" },
  { status: "unsubscribed", label: "Unsubscribed" },
  { status: "dead", label: "Dead" },
  { status: "paused", label: "Paused" },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function OutletsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = (sp.status as OutletStatus) || "bounced";
  const { scope } = await resolveScope();
  const outlets = await getOutletsByStatus(scope, status, 500);

  return (
    <>
      <PageTitle
        title="Outlets"
        subtitle={`${outlets.length} ${status} outlet${outlets.length === 1 ? "" : "s"}`}
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {TABS.map((t) => {
          const active = t.status === status;
          return (
            <Link
              key={t.status}
              href={`/admin/outlets?status=${t.status}`}
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
              {t.label}
            </Link>
          );
        })}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Outlet</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Country / Lang</th>
            <th style={thStyle}>Scope</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Last DSN</th>
            <th style={thStyle}>DSNs</th>
          </tr>
        </thead>
        <tbody>
          {outlets.map((o) => (
            <tr key={o.outletId}>
              <td style={tdStyle}>
                <div style={{ fontWeight: 600 }}>{o.outletName}</div>
                {o.editorName && (
                  <div style={{ fontSize: 11, color: "#666" }}>
                    {o.editorName}
                  </div>
                )}
                <div style={{ ...codeStyle, color: "#999" }}>{o.outletId}</div>
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {o.emailPrimary || "—"}
              </td>
              <td style={tdStyle}>
                {o.country || "—"}
                {o.language ? ` · ${o.language}` : ""}
              </td>
              <td style={tdStyle}>{o.scope || "—"}</td>
              <td style={tdStyle}>
                <StatusPill status={o.status} />
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {o.lastDsnAt?.slice(0, 16) || "—"}
              </td>
              <td style={tdStyle}>{o.dsnCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
