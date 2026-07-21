import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveScope, reportKeyToCampaign, type Scope } from "@/lib/scope";
import {
  getCoverageStats,
  getCoverageByMaker,
  getCoverageByScope,
  getBrandSurvival,
  getCoverageRows,
} from "@/lib/coverage";
import { PageTitle, tableStyle, thStyle, tdStyle } from "../../_layout/Table";
import { deletePickupAction, toggleFpAction } from "../actions";

const actionBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  color: "#a33",
  cursor: "pointer",
  fontSize: 12,
  textDecoration: "underline",
};

export const metadata = {
  title: "Coverage — EHC Admin",
  robots: { index: false, follow: false },
};

const card: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fff",
  padding: "16px 18px",
};
const cardLabel: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#666",
  fontWeight: 700,
};
const cardValue: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginTop: 6,
  lineHeight: 1.1,
  fontVariantNumeric: "tabular-nums",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#555",
  margin: "28px 0 10px",
};

function eur(n: number): string {
  return "€" + n.toLocaleString("en-GB");
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function Meter({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const pct = total ? Math.round((100 * value) / total) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#666", fontVariantNumeric: "tabular-nums" }}>
          {value}/{total} · {pct}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "#ecefe7",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: "#2c6b40" }} />
      </div>
    </div>
  );
}

export default async function CoveragePage({
  params,
}: {
  params: Promise<{ campaign: string }>;
}) {
  const { campaign } = await params;
  const campaignSlug = reportKeyToCampaign(campaign);

  // Permission gate: reports contain outlet data, so only a superadmin or a
  // member of the report's org may view it (independent of the switcher).
  const { projects, user } = await resolveScope();
  const allowed =
    user.role === "superadmin" ||
    projects.some((p) => p.campaignSlug === campaignSlug);
  if (!allowed) notFound();

  const label =
    projects.find((p) => p.campaignSlug === campaignSlug)?.campaignName ??
    campaign;

  // Scope every query to THIS campaign (the page's own slug), not the ambient
  // switcher selection — /admin/coverage/<x> always shows <x>.
  const pageScope: Scope = {
    kind: "campaign",
    campaignSlug,
    campaignSlugs: [campaignSlug],
    isAll: false,
    token: `campaign:${campaignSlug}`,
    label,
  };

  const [stats, byMaker, byScope, brand, rows] = await Promise.all([
    getCoverageStats(pageScope),
    getCoverageByMaker(pageScope),
    getCoverageByScope(pageScope),
    getBrandSurvival(pageScope),
    getCoverageRows(pageScope),
  ]);

  if (rows.length === 0) {
    return (
      <>
        <PageTitle title={`${label} coverage`} />
        <p style={{ color: "#666", fontSize: 14, maxWidth: "60ch" }}>
          No pickups logged for this project yet.{" "}
          <Link
            href={`/admin/coverage/${campaign}/pickup`}
            style={{ color: "#1d3a2a" }}
          >
            Add the first one →
          </Link>
        </p>
      </>
    );
  }

  const span =
    stats.dateFrom && stats.dateTo
      ? `${stats.dateFrom} – ${stats.dateTo}`
      : "—";

  return (
    <>
      <PageTitle
        title={`${label} coverage`}
        subtitle={`${rows.length} pickups · ${eur(stats.totalEur)} priced value`}
      />

      {/* Hero stats */}
      <section
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <div style={card}>
          <div style={cardLabel}>Press value</div>
          <div style={cardValue}>{eur(stats.totalEur)}</div>
        </div>
        <div style={card}>
          <div style={cardLabel}>Pickups</div>
          <div style={cardValue}>{rows.length}</div>
          {stats.pickupCount < rows.length ? (
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {stats.pickupCount} priced
            </div>
          ) : null}
        </div>
        <div style={card}>
          <div style={cardLabel}>Makers</div>
          <div style={cardValue}>{stats.makerCount}</div>
        </div>
        <div style={card}>
          <div style={cardLabel}>Span</div>
          <div style={{ ...cardValue, fontSize: 15, fontWeight: 600 }}>{span}</div>
        </div>
      </section>

      {/* Brand survival */}
      <div style={sectionTitle}>Brand survival</div>
      <div style={{ ...card, maxWidth: 440 }}>
        <Meter label="EHSA named" value={brand.ehsaNamed} total={brand.total} />
        <Meter label="ROH named" value={brand.rohNamed} total={brand.total} />
        <Meter
          label="ROH do-follow link"
          value={brand.rohLinked}
          total={brand.total}
        />
      </div>

      {/* By maker + by scope */}
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "start",
        }}
      >
        <div>
          <div style={sectionTitle}>By maker</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Maker</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Pickups</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {byMaker.map((m) => (
                <tr key={m.makerSlug}>
                  <td style={tdStyle}>{m.label}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.count}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {eur(m.eur)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div style={sectionTitle}>By scope</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Scope</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Pickups</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {byScope.map((s) => (
                <tr key={s.scope}>
                  <td style={{ ...tdStyle, textTransform: "capitalize" }}>
                    {s.scope}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.count}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {eur(s.eur)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All pickups */}
      <div
        style={{
          ...sectionTitle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>All pickups</span>
        <Link
          href={`/admin/coverage/${campaign}/pickup`}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#1d3a2a",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          + Add pickup
        </Link>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Outlet</th>
              <th style={thStyle}>Maker</th>
              <th style={thStyle}>Scope</th>
              <th style={thStyle}>Pos</th>
              <th style={thStyle}>ROH</th>
              <th style={thStyle}>EHSA</th>
              <th style={thStyle}>Link</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Value</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.articleUrl + i}>
                <td
                  style={{ ...tdStyle, whiteSpace: "nowrap", color: "#666" }}
                >
                  {r.date}
                </td>
                <td style={tdStyle}>
                  {r.articleUrl ? (
                    <a
                      href={r.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1d3a2a" }}
                    >
                      {r.outletName || hostname(r.articleUrl)}
                    </a>
                  ) : (
                    r.outletName
                  )}
                </td>
                <td style={tdStyle}>{r.makerLabel}</td>
                <td style={{ ...tdStyle, textTransform: "capitalize" }}>
                  {r.scope}
                </td>
                <td style={{ ...tdStyle, color: "#666" }}>{r.position}</td>
                <td style={{ ...tdStyle, color: "#666" }}>{r.rohMention}</td>
                <td style={{ ...tdStyle, color: "#666" }}>{r.ehsaMention}</td>
                <td style={{ ...tdStyle, color: "#666" }}>{r.rohLink}</td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                  }}
                >
                  {r.eur ? eur(r.eur) : <span style={{ color: "#bbb" }}>—</span>}
                </td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  <Link
                    href={`/admin/coverage/${campaign}/pickup?url=${encodeURIComponent(r.articleUrl)}&maker=${encodeURIComponent(r.makerSlug)}`}
                    style={{ color: "#1d3a2a", marginRight: 10 }}
                  >
                    edit
                  </Link>
                  <form action={toggleFpAction} style={{ display: "inline" }}>
                    <input type="hidden" name="campaign_slug" value={campaignSlug} />
                    <input type="hidden" name="article_url" value={r.articleUrl} />
                    <input type="hidden" name="maker_slug" value={r.makerSlug} />
                    <input type="hidden" name="is_false_positive" value="true" />
                    <button
                      type="submit"
                      style={{ ...actionBtn, color: "#b06000", marginRight: 10 }}
                    >
                      fp
                    </button>
                  </form>
                  <form action={deletePickupAction} style={{ display: "inline" }}>
                    <input type="hidden" name="campaign_slug" value={campaignSlug} />
                    <input type="hidden" name="article_url" value={r.articleUrl} />
                    <input type="hidden" name="maker_slug" value={r.makerSlug} />
                    <button type="submit" style={actionBtn}>
                      del
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
