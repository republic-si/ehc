import React from "react";
import Link from "next/link";

// Shared admin table + page primitives. Colours come from the design tokens in
// app/globals.css (--ink / --paper / --rule / --muted ...) so every admin page
// reads as one system with the AdminShell. Kept as inline style objects (not
// Tailwind classes) so pages can spread them; the values ARE the tokens.

const INK = "#1d3a2a";
const INK_DEEP = "#122a1d";
const RULE = "#d9dcd7";
const RULE_SOFT = "#ecede9";
const MUTED = "#5a6b5f";
const MUTED_SOFT = "#8a958e";
const PAPER = "#ffffff";
const PAPER_GREEN = "#ecefe7";

export const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  background: PAPER,
  border: `1px solid ${RULE}`,
};

export const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  background: PAPER_GREEN,
  borderBottom: `1px solid ${RULE}`,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: MUTED,
  fontWeight: 700,
};

export const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: `1px solid ${RULE_SOFT}`,
  verticalAlign: "top",
};

export const codeStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: 12,
};

export function StatusPill({ status }: { status: string }) {
  // Health status. Green for good, warm/red for problem states, grey otherwise.
  const color =
    status === "active"
      ? "#137333"
      : status === "bounced"
        ? "#c5221f"
        : status === "unsubscribed"
          ? "#b06000"
          : MUTED;
  return (
    <span
      style={{
        background: color,
        color: PAPER,
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

// Contact-type chip for the master contact DB (press_outlets.category).
const CATEGORY_STYLE: Record<string, { bg: string; label: string }> = {
  media: { bg: INK, label: "Press" },
  influencer: { bg: "#7a4bd6", label: "Influencer" },
  buyer: { bg: "#b06000", label: "Buyer" },
  industry: { bg: "#0b6b6b", label: "Industry" },
};

export function TypePill({ category }: { category: string | null }) {
  const meta = category ? CATEGORY_STYLE[category] : undefined;
  const bg = meta?.bg ?? MUTED_SOFT;
  const label = meta?.label ?? (category || "—");
  return (
    <span
      style={{
        background: bg,
        color: PAPER,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
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
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6, color: INK }}>
        {title}
      </h1>
      {subtitle && <p style={{ color: MUTED, fontSize: 13 }}>{subtitle}</p>}
    </div>
  );
}

// A pill-row of links, used for facet/status filters. `active` matches an item's
// `key`. Each item carries the href to navigate to.
export interface TabItem {
  key: string;
  label: string;
  href: string;
  count?: number;
}

export function Tabs({ items, active }: { items: TabItem[]; active: string }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "6px 12px",
              background: on ? INK : PAPER,
              color: on ? "#fff" : INK,
              border: `1px solid ${on ? INK : RULE}`,
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span style={{ opacity: 0.6, marginLeft: 6 }}>{t.count}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

// Dashboard metric card. Optionally a link. Themed on the tokens.
export function StatTile({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: MUTED,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Archivo Black', 'Inter', sans-serif",
          fontSize: 32,
          marginTop: 8,
          marginBottom: 4,
          lineHeight: 1.1,
          color: INK_DEEP,
        }}
      >
        {value}
      </div>
      {sub ? <div style={{ fontSize: 13, color: MUTED }}>{sub}</div> : null}
    </>
  );
  const style: React.CSSProperties = {
    display: "block",
    padding: "20px 24px",
    border: `1px solid ${RULE}`,
    borderRadius: 8,
    background: PAPER,
    color: INK,
    textDecoration: "none",
  };
  return href ? (
    <Link href={href} style={style}>
      {inner}
    </Link>
  ) : (
    <div style={style}>{inner}</div>
  );
}
