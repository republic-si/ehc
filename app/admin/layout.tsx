import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — EHSA 2026",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", color: "#111" }}>
      <main
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "24px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        {children}
      </main>
    </div>
  );
}
