import Link from "next/link";
import { getAdminSummary } from "@/lib/admin";

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: "20px 24px",
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fff",
  color: "#111",
  textDecoration: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#666",
  fontWeight: 700,
};

const valueStyle: React.CSSProperties = {
  fontFamily: "'Archivo Black', 'Inter', sans-serif",
  fontSize: 32,
  marginTop: 8,
  marginBottom: 4,
  lineHeight: 1.1,
};

export default async function AdminHome() {
  const s = await getAdminSummary();
  const total = s.outlets.reduce((acc, o) => acc + o.count, 0);
  const byStatus: Record<string, number> = {};
  for (const o of s.outlets) byStatus[o.status] = o.count;

  return (
    <>
      <h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 600 }}>
        EHSA 2026 admin
      </h1>

      <section
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 32,
        }}
      >
        <Link href="/admin/outlets" style={cardStyle}>
          <div style={labelStyle}>Outlets total</div>
          <div style={valueStyle}>{total}</div>
          <div style={{ fontSize: 13, color: "#666" }}>
            {byStatus.active ?? 0} active · {byStatus.bounced ?? 0} bounced ·{" "}
            {byStatus.unsubscribed ?? 0} unsub
          </div>
        </Link>

        <Link href="/admin/bounces" style={cardStyle}>
          <div style={labelStyle}>Bounces (7d)</div>
          <div style={valueStyle}>{s.bounces7d}</div>
          <div style={{ fontSize: 13, color: "#666" }}>From Gmail DSNs</div>
        </Link>

        <Link href="/admin/bounces?tab=unsubs" style={cardStyle}>
          <div style={labelStyle}>Unsubscribes (30d)</div>
          <div style={valueStyle}>{s.unsubs30d}</div>
          <div style={{ fontSize: 13, color: "#666" }}>Inbox replies</div>
        </Link>

        <Link href="/admin/sends" style={cardStyle}>
          <div style={labelStyle}>Sends (24h)</div>
          <div style={valueStyle}>{s.sends24h}</div>
          <div style={{ fontSize: 13, color: "#666" }}>outlet_sends rows</div>
        </Link>

        <Link href="/admin/signoffs" style={cardStyle}>
          <div style={labelStyle}>Signoffs open</div>
          <div style={valueStyle}>{s.signoffsPending}</div>
          <div style={{ fontSize: 13, color: "#666" }}>
            sent / needs_followup / ack_with_edits
          </div>
        </Link>
      </section>

      <p style={{ color: "#888", fontSize: 13 }}>
        Source of truth: Neon press_outlets / outlet_sends / dsn_log /
        unsubscribe_log / signoff_sends. Python pipeline + this dashboard share
        the same DB.
      </p>
    </>
  );
}
