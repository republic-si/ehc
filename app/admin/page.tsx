import { getAdminSummary, getOutletTypeCounts } from "@/lib/admin";
import { resolveScope } from "@/lib/scope";
import { StatTile, TypePill } from "./_layout/Table";

const TYPE_ORDER: { key: "media" | "influencer" | "buyer" | "industry"; label: string }[] = [
  { key: "media", label: "Press" },
  { key: "influencer", label: "Influencers" },
  { key: "buyer", label: "Buyers" },
  { key: "industry", label: "Industry" },
];

export default async function AdminHome() {
  const { scope } = await resolveScope();
  const [s, typeCounts] = await Promise.all([
    getAdminSummary(scope),
    getOutletTypeCounts(scope),
  ]);
  const total = s.outlets.reduce((acc, o) => acc + o.count, 0);
  const byStatus: Record<string, number> = {};
  for (const o of s.outlets) byStatus[o.status] = o.count;
  const countFor = (key: string) =>
    typeCounts.find((c) => c.category === key)?.count ?? 0;

  return (
    <>
      <h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 600, color: "#1d3a2a" }}>
        Contacts &amp; Press
        <span style={{ color: "#8a958e", fontWeight: 400 }}> · {scope.label}</span>
      </h1>

      {/* Contact DB by type — the master contact DB is no longer press-only. */}
      <section
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginBottom: 14,
        }}
      >
        {TYPE_ORDER.map((t) => (
          <StatTile
            key={t.key}
            label={t.label}
            value={countFor(t.key)}
            sub={<TypePill category={t.key} />}
            href={`/admin/outlets?type=${t.key}`}
          />
        ))}
      </section>

      {/* Health + activity. */}
      <section
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 32,
        }}
      >
        <StatTile
          label="Contacts total"
          value={total}
          sub={`${byStatus.active ?? 0} active · ${byStatus.bounced ?? 0} bounced · ${byStatus.unsubscribed ?? 0} unsub`}
          href="/admin/outlets"
        />
        <StatTile
          label="Bounces (7d)"
          value={s.bounces7d}
          sub="From Gmail DSNs · all projects"
          href="/admin/bounces"
        />
        <StatTile
          label="Unsubscribes (30d)"
          value={s.unsubs30d}
          sub="Inbox replies · all projects"
          href="/admin/bounces?tab=unsubs"
        />
        <StatTile
          label="Sends (24h)"
          value={s.sends24h}
          sub="outlet_sends rows"
          href="/admin/sends"
        />
        <StatTile
          label="Signoffs open"
          value={s.signoffsPending}
          sub="sent / needs_followup / ack_with_edits"
          href="/admin/signoffs"
        />
      </section>

      <p style={{ color: "#8a958e", fontSize: 13 }}>
        Source of truth: Neon press_outlets / outlet_sends / dsn_log /
        unsubscribe_log / signoff_sends. Python pipeline + this dashboard share
        the same DB.
      </p>
    </>
  );
}
