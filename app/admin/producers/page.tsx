import Link from "next/link";
import {
  getProducers,
  getProducerCounts,
  type ProducerFacet,
} from "@/lib/producers-admin";
import {
  PageTitle,
  StatTile,
  Tabs,
  type TabItem,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";
import { ClassBadges } from "./badges";

const FACETS: { key: ProducerFacet; label: string }[] = [
  { key: "all", label: "All" },
  { key: "growers", label: "Growers" },
  { key: "makers", label: "Makers" },
  { key: "members", label: "Members" },
];

interface Props {
  searchParams: Promise<{ facet?: string }>;
}

export default async function ProducersAdminPage({ searchParams }: Props) {
  const sp = await searchParams;
  const facet: ProducerFacet =
    sp.facet && FACETS.some((f) => f.key === sp.facet)
      ? (sp.facet as ProducerFacet)
      : "all";

  const [producers, counts] = await Promise.all([
    getProducers(facet),
    getProducerCounts(),
  ]);

  const tabs: TabItem[] = FACETS.map((f) => ({
    key: f.key,
    label: f.label,
    href: f.key === "all" ? "/admin/producers" : `/admin/producers?facet=${f.key}`,
    count:
      f.key === "all"
        ? counts.total
        : f.key === "growers"
          ? counts.growers
          : f.key === "makers"
            ? counts.makers
            : counts.members,
  }));

  return (
    <>
      <PageTitle
        title="Producers"
        subtitle={`${producers.length} shown · the master maker directory (${counts.total} total)`}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatTile label="Producers" value={counts.total} />
        <StatTile label="Growers" value={counts.growers} sub="grow chilis" />
        <StatTile label="Members" value={counts.members} sub="pay EHC" />
        <StatTile label="Countries" value={counts.countries} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs items={tabs} active={facet} />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Producer</th>
            <th style={thStyle}>Classification</th>
            <th style={thStyle}>Contact</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Cohort</th>
            <th style={thStyle}>Campaigns</th>
            <th style={thStyle}>Awards</th>
          </tr>
        </thead>
        <tbody>
          {producers.map((p) => (
            <tr key={p.slug}>
              <td style={tdStyle}>
                <Link
                  href={`/admin/producers/${p.slug}`}
                  style={{ fontWeight: 600, color: "#1d3a2a" }}
                >
                  {p.brand}
                </Link>
                <div style={{ ...codeStyle, color: "#8a958e" }}>{p.slug}</div>
              </td>
              <td style={tdStyle}>
                <ClassBadges
                  growsChilis={p.growsChilis}
                  makesSauce={p.makesSauce}
                  isMember={p.isMember}
                />
              </td>
              <td style={tdStyle}>
                {p.contactName && <div>{p.contactName}</div>}
                <div style={{ ...codeStyle, color: "#5a6b5f" }}>{p.email || "—"}</div>
              </td>
              <td style={tdStyle}>
                {[p.town, p.country].filter(Boolean).join(", ") || "—"}
              </td>
              <td style={tdStyle}>
                {p.cohort || "—"}
                {p.isAnchor ? " · anchor" : ""}
              </td>
              <td style={{ ...tdStyle, ...codeStyle, color: "#5a6b5f" }}>
                {p.campaigns.length ? p.campaigns.join(", ") : "—"}
              </td>
              <td style={tdStyle}>{p.awardCount || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
