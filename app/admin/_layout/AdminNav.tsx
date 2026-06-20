import Link from "next/link";

const items: { href: string; label: string }[] = [
  { href: "/admin", label: "Home" },
  { href: "/admin/outlets", label: "Outlets" },
  { href: "/admin/bounces", label: "Bounces" },
  { href: "/admin/signoffs", label: "Signoffs" },
  { href: "/admin/sends", label: "Recent sends" },
  { href: "/admin/events", label: "Events" },
];

export function AdminNav() {
  return (
    <nav
      style={{
        background: "#111",
        borderBottom: "2px solid #F5C518",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "8px 24px",
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#F5C518",
            fontFamily: "'Archivo Black', 'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "6px 12px",
          }}
        >
          EHSA 2026 admin
        </span>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            style={{
              color: "#F5C518",
              opacity: 0.65,
              fontFamily: "'Archivo Black', 'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "6px 12px",
              textDecoration: "none",
            }}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
