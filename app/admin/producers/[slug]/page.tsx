import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducerDetail } from "@/lib/producers-admin";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../../_layout/Table";
import { ClassBadges } from "../badges";

interface Props {
  params: Promise<{ slug: string }>;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: "1px solid #ecede9" }}>
      <div
        style={{
          width: 150,
          flexShrink: 0,
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#5a6b5f",
          fontWeight: 700,
          paddingTop: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13 }}>{value || <span style={{ color: "#8a958e" }}>—</span>}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <h2
        style={{
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#1d3a2a",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function yesNo(v: boolean): string {
  return v ? "Yes" : "No";
}

export default async function ProducerDetailPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProducerDetail(slug);
  if (!p) notFound();

  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <Link href="/admin/producers" style={{ fontSize: 12, color: "#5a6b5f" }}>
          ← Producers
        </Link>
      </div>
      <PageTitle title={p.brand} subtitle={p.slug} />

      <div style={{ marginBottom: 20 }}>
        <ClassBadges
          growsChilis={p.growsChilis}
          makesSauce={p.makesSauce}
          isMember={p.isMember}
        />
      </div>

      <Section title="Record">
        <div style={{ maxWidth: 720 }}>
          <Field label="Contact" value={p.contactName} />
          <Field
            label="Email"
            value={p.email ? <span style={codeStyle}>{p.email}</span> : null}
          />
          <Field label="Country" value={p.country} />
          <Field label="Town" value={p.town} />
          <Field label="Region" value={p.region} />
          <Field label="Cohort" value={p.cohort} />
          <Field label="In scope" value={yesNo(p.inScope)} />
          <Field label="Anchor" value={yesNo(p.isAnchor)} />
          <Field label="Grows chilis" value={yesNo(p.growsChilis)} />
          <Field label="Makes sauce" value={yesNo(p.makesSauce)} />
          <Field label="EHC member" value={yesNo(p.isMember)} />
          <Field label="Maker folder" value={yesNo(p.hasMakerFolder)} />
          <Field
            label="Drive"
            value={
              p.driveUrl ? (
                <a href={p.driveUrl} target="_blank" rel="noreferrer" style={{ color: "#0b6b6b" }}>
                  {p.driveUrl}
                </a>
              ) : null
            }
          />
          <Field label="Company desc" value={p.companyDesc} />
          <Field label="Notes" value={p.notes} />
          <Field label="Updated" value={p.updatedAt?.slice(0, 16)} />
        </div>
      </Section>

      <Section title={`Campaigns (${p.campaigns.length})`}>
        {p.campaigns.length ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Campaign</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {p.campaigns.map((c) => (
                <tr key={c.campaignSlug}>
                  <td style={tdStyle}>
                    {c.name || c.campaignSlug}
                    <div style={{ ...codeStyle, color: "#8a958e" }}>{c.campaignSlug}</div>
                  </td>
                  <td style={tdStyle}>{c.status}</td>
                  <td style={{ ...tdStyle, ...codeStyle }}>{c.joinedAt?.slice(0, 10) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#8a958e", fontSize: 13 }}>No campaign participation recorded.</p>
        )}
      </Section>

      <Section title={`Sauces & awards (${p.awards.length})`}>
        {p.awards.length ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sauce</th>
                <th style={thStyle}>Award</th>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Score</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Region</th>
              </tr>
            </thead>
            <tbody>
              {p.awards.map((a, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    {a.sauceName || "—"}
                    {a.sauceCode && (
                      <div style={{ ...codeStyle, color: "#8a958e" }}>{a.sauceCode}</div>
                    )}
                  </td>
                  <td style={tdStyle}>{a.award || "—"}</td>
                  <td style={tdStyle}>{a.rank ?? "—"}</td>
                  <td style={tdStyle}>{a.score ?? "—"}</td>
                  <td style={tdStyle}>{a.category || "—"}</td>
                  <td style={tdStyle}>{a.region || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#8a958e", fontSize: 13 }}>No awards recorded.</p>
        )}
      </Section>

      <Section title="Materials & coverage">
        <div style={{ maxWidth: 720 }}>
          <Field label="Coverage pickups" value={String(p.coverageCount)} />
          {p.materials ? (
            <>
              <Field label="Reply status" value={p.materials.replyStatus} />
              <Field label="Photos in" value={p.materials.photosIn == null ? null : yesNo(p.materials.photosIn)} />
              <Field label="Quote in" value={p.materials.quoteIn == null ? null : yesNo(p.materials.quoteIn)} />
              <Field label="Quote" value={p.materials.quoteText} />
            </>
          ) : (
            <Field label="Materials" value={null} />
          )}
        </div>
      </Section>
    </>
  );
}
