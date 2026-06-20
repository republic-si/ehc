import React from "react";

export const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  background: "#fff",
  border: "1px solid #e5e5e5",
};

export const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  background: "#f5f5f5",
  borderBottom: "1px solid #e5e5e5",
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#555",
  fontWeight: 700,
};

export const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #efefef",
  verticalAlign: "top",
};

export const codeStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: 12,
};

export function StatusPill({ status }: { status: string }) {
  const color =
    status === "active"
      ? "#137333"
      : status === "bounced"
        ? "#c5221f"
        : status === "unsubscribed"
          ? "#b06000"
          : "#5f6368";
  return (
    <span
      style={{
        background: color,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: 4,
      }}
    >
      {status}
    </span>
  );
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: "#666", fontSize: 13 }}>{subtitle}</p>
      )}
    </div>
  );
}
