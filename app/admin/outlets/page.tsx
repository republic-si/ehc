import {
  getOutletsByStatus,
  getOutletTypeCounts,
  type OutletCategory,
  type OutletStatus,
} from "@/lib/admin";
import { resolveScope } from "@/lib/scope";
import {
  PageTitle,
  StatusPill,
  Tabs,
  TypePill,
  type TabItem,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

// Primary facet: contact type (press_outlets.category). Secondary: health status.
const TYPES: { key: string; category?: OutletCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "media", category: "media", label: "Press" },
  { key: "influencer", category: "influencer", label: "Influencers" },
  { key: "buyer", category: "buyer", label: "Buyers" },
  { key: "industry", category: "industry", label: "Industry" },
];

const STATUSES: { status: OutletStatus; label: string }[] = [
  { status: "active", label: "Active" },
  { status: "bounced", label: "Bounced" },
  { status: "unsubscribed", label: "Unsubscribed" },
  { status: "dead", label: "Dead" },
  { status: "paused", label: "Paused" },
];

interface Props {
  searchParams: Promise<{ status?: string; type?: string }>;
}

function hrefFor(type: string, status: string): string {
  const p = new URLSearchParams();
  if (type !== "all") p.set("type", type);
  if (status !== "active") p.set("status", status);
  const qs = p.toString();
  return qs ? `/admin/outlets?${qs}` : "/admin/outlets";
}

export default async function OutletsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = (sp.status as OutletStatus) || "active";
  const typeKey = sp.type && TYPES.some((t) => t.key === sp.type) ? sp.type : "all";
  const category = TYPES.find((t) => t.key === typeKey)?.category;

  const { scope } = await resolveScope();
  const [outlets, typeCounts] = await Promise.all([
    getOutletsByStatus(scope, status, 500, category),
    getOutletTypeCounts(scope),
  ]);

  const countFor = (key: string) =>
    key === "all"
      ? typeCounts.reduce((a, c) => a + c.count, 0)
      : (typeCounts.find((c) => c.category === key)?.count ?? 0);

  const typeTabs: TabItem[] = TYPES.map((t) => ({
    key: t.key,
    label: t.label,
    href: hrefFor(t.key, status),
    count: countFor(t.key),
  }));
  const statusTabs: TabItem[] = STATUSES.map((s) => ({
    key: s.status,
    label: s.label,
    href: hrefFor(typeKey, s.status),
  }));

  const typeLabel = TYPES.find((t) => t.key === typeKey)?.label ?? "All";

  return (
    <>
      <PageTitle
        title="Contacts"
        subtitle={`${outlets.length} ${status} · ${typeLabel} · ${scope.label}`}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        <Tabs items={typeTabs} active={typeKey} />
        <Tabs items={statusTabs} active={status} />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Contact</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Country / Lang</th>
            <th style={thStyle}>Format / Tier</th>
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
                  <div style={{ fontSize: 11, color: "#5a6b5f" }}>
                    {o.editorName}
                  </div>
                )}
                <div style={{ ...codeStyle, color: "#8a958e" }}>{o.outletId}</div>
              </td>
              <td style={tdStyle}>
                <TypePill category={o.category} />
                {o.platform && (
                  <div style={{ fontSize: 11, color: "#5a6b5f", marginTop: 3 }}>
                    {o.platform}
                  </div>
                )}
              </td>
              <td style={{ ...tdStyle, ...codeStyle }}>
                {o.emailPrimary || "—"}
              </td>
              <td style={tdStyle}>
                {o.country || "—"}
                {o.language ? ` · ${o.language}` : ""}
              </td>
              <td style={tdStyle}>
                {o.format || "—"}
                {o.tier ? ` · T${o.tier}` : ""}
              </td>
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
