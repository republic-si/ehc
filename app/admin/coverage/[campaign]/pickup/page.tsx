import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/db/client";
import { resolveScope, reportKeyToCampaign } from "@/lib/scope";
import { getPickup, type PickupInput } from "@/lib/coverage";
import { savePickupAction } from "../../actions";

export const metadata = {
  title: "Pickup — EHC Admin",
  robots: { index: false, follow: false },
};

const MEDIUM = ["web", "print", "tv", "radio"];
const SCOPE = ["hyperlocal", "local", "regional", "national", "trade", "pan-eu", "unknown"];
const POSITION = ["lede", "body", "quote", "footer", "boilerplate", "passing"];
const MENTION = ["full", "acronym", "name", "no", "unknown-paywall"];
const LINK = ["yes", "partial", "no", "unknown", "unknown-paywall"];

const label: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#666",
  marginBottom: 4,
};
const field: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: "7px 9px",
  fontSize: 14,
  background: "#fff",
};
const row: React.CSSProperties = { marginBottom: 14 };

function Field({
  name,
  title,
  value,
  type = "text",
}: {
  name: string;
  title: string;
  value: string;
  type?: string;
}) {
  return (
    <div style={row}>
      <label style={label} htmlFor={name}>
        {title}
      </label>
      <input id={name} name={name} defaultValue={value} type={type} style={field} />
    </div>
  );
}

function SelectField({
  name,
  title,
  value,
  options,
}: {
  name: string;
  title: string;
  value: string;
  options: string[];
}) {
  const opts = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <div style={row}>
      <label style={label} htmlFor={name}>
        {title}
      </label>
      <select id={name} name={name} defaultValue={value} style={field}>
        <option value="">—</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default async function PickupFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ campaign: string }>;
  searchParams: Promise<{ url?: string; maker?: string }>;
}) {
  const { campaign } = await params;
  const { url, maker } = await searchParams;
  const campaignSlug = reportKeyToCampaign(campaign);

  const { projects, user } = await resolveScope();
  const allowed =
    user.role === "superadmin" ||
    projects.some((p) => p.campaignSlug === campaignSlug);
  if (!allowed) notFound();

  const editing = Boolean(url && maker);
  const existing =
    editing && url && maker ? await getPickup(url, maker) : null;

  // Blank template for "add".
  const p: PickupInput =
    existing ?? {
      articleUrl: "",
      makerSlug: "",
      outletName: "",
      outletUrl: "",
      dateSpotted: null,
      language: "",
      country: "",
      medium: "web",
      scope: "",
      position: "",
      monthlyVisits: null,
      mentionsEhsa: "",
      mentionsRoh: "",
      linkEhsaSite: "",
      followLinkRoh: "",
      domainAuthority: "",
      notes: "",
      isFalsePositive: false,
      campaignSlug,
    };

  const producers = (await sql`
    SELECT slug, brand FROM producers ORDER BY brand
  `) as { slug: string; brand: string | null }[];
  const makerOpts =
    p.makerSlug && !producers.some((m) => m.slug === p.makerSlug)
      ? [{ slug: p.makerSlug, brand: p.makerSlug }, ...producers]
      : producers;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
          {editing ? "Edit pickup" : "Add pickup"}
        </h1>
        <Link href={`/admin/coverage/${campaign}`} style={{ fontSize: 13, color: "#666" }}>
          ← back to coverage
        </Link>
      </div>

      <form action={savePickupAction}>
        <input type="hidden" name="campaign_slug" value={campaignSlug} />
        {editing ? (
          <>
            <input type="hidden" name="old_article_url" value={url} />
            <input type="hidden" name="old_maker_slug" value={maker} />
            <input type="hidden" name="domain_authority" value={p.domainAuthority} />
          </>
        ) : null}

        <Field name="article_url" title="Article URL" value={p.articleUrl} type="url" />

        <div style={row}>
          <label style={label} htmlFor="maker_slug">Maker</label>
          <select id="maker_slug" name="maker_slug" defaultValue={p.makerSlug} style={field}>
            <option value="">—</option>
            {makerOpts.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.brand || m.slug}
              </option>
            ))}
          </select>
        </div>

        <Field name="outlet_name" title="Outlet name" value={p.outletName} />
        <Field name="outlet_url" title="Outlet URL (drives domain authority)" value={p.outletUrl} type="url" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field name="date_spotted" title="Date spotted" value={p.dateSpotted ?? ""} type="date" />
          <Field name="monthly_visits_est" title="Monthly visits (traffic)" value={p.monthlyVisits?.toString() ?? ""} type="number" />
          <SelectField name="medium" title="Medium" value={p.medium} options={MEDIUM} />
          <SelectField name="scope" title="Scope" value={p.scope} options={SCOPE} />
          <SelectField name="position_of_mention" title="Position" value={p.position} options={POSITION} />
          <Field name="country" title="Country" value={p.country} />
          <SelectField name="mentions_ehsa" title="EHSA mention" value={p.mentionsEhsa} options={MENTION} />
          <SelectField name="mentions_roh" title="ROH mention" value={p.mentionsRoh} options={MENTION} />
          <SelectField name="link_ehsa_site" title="EHSA link" value={p.linkEhsaSite} options={LINK} />
          <SelectField name="follow_link_to_roh" title="ROH link" value={p.followLinkRoh} options={LINK} />
        </div>

        <div style={row}>
          <label style={label} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" defaultValue={p.notes} rows={2} style={field} />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, margin: "6px 0 20px" }}>
          <input type="checkbox" name="is_false_positive" defaultChecked={p.isFalsePositive} />
          False positive (exclude from value)
        </label>

        <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
          Press value and domain authority are computed on save.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              padding: "9px 18px",
              fontSize: 14,
              fontWeight: 600,
              background: "#1d3a2a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {editing ? "Save changes" : "Add pickup"}
          </button>
          <Link
            href={`/admin/coverage/${campaign}`}
            style={{ padding: "9px 18px", fontSize: 14, color: "#666" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
