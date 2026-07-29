import { sql } from "@/db/client";

// Data access for the admin Producers directory. Reads the real `producers`
// table (the EHSA/BCF press DB, source of truth) plus everything hanging off it
// by producer_slug: awards/sauces, campaign participation, coverage, materials.
// Distinct from lib/producers.ts, which fakes a public producer list from
// release slugs — this is the full DB record.

export interface ProducerListRow {
  slug: string;
  brand: string;
  contactName: string | null;
  email: string | null;
  country: string | null;
  town: string | null;
  cohort: string | null;
  inScope: boolean;
  isAnchor: boolean;
  hasMakerFolder: boolean;
  growsChilis: boolean;
  makesSauce: boolean;
  isMember: boolean;
  awardCount: number;
  campaigns: string[];
}

export interface ProducerCounts {
  total: number;
  growers: number;
  makers: number;
  members: number;
  countries: number;
}

export type ProducerFacet = "all" | "growers" | "makers" | "members";

export async function getProducerCounts(): Promise<ProducerCounts> {
  const [r] = (await sql`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE grows_chilis)::int AS growers,
           count(*) FILTER (WHERE makes_sauce)::int  AS makers,
           count(*) FILTER (WHERE is_member)::int    AS members,
           count(DISTINCT country) FILTER (WHERE country IS NOT NULL AND country <> '')::int AS countries
      FROM producers
  `) as Record<string, number>[];
  return {
    total: r.total,
    growers: r.growers,
    makers: r.makers,
    members: r.members,
    countries: r.countries,
  };
}

export async function getProducers(facet: ProducerFacet = "all"): Promise<ProducerListRow[]> {
  const filter =
    facet === "growers"
      ? "WHERE p.grows_chilis"
      : facet === "makers"
        ? "WHERE p.makes_sauce"
        : facet === "members"
          ? "WHERE p.is_member"
          : "";
  const rows = (await sql.query(
    `SELECT p.slug, p.brand, p.contact_name, p.email, p.country, p.town,
            p.cohort, p.in_scope, p.is_anchor, p.has_maker_folder,
            p.grows_chilis, p.makes_sauce, p.is_member,
            COALESCE(aw.n, 0)::int AS award_count,
            COALESCE(cp.campaigns, ARRAY[]::text[]) AS campaigns
       FROM producers p
       LEFT JOIN (SELECT producer_slug, count(*) AS n
                    FROM awards GROUP BY producer_slug) aw ON aw.producer_slug = p.slug
       LEFT JOIN (SELECT producer_slug, array_agg(campaign_slug ORDER BY campaign_slug) AS campaigns
                    FROM campaign_producers GROUP BY producer_slug) cp ON cp.producer_slug = p.slug
       ${filter}
      ORDER BY p.brand`,
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    slug: r.slug as string,
    brand: r.brand as string,
    contactName: (r.contact_name as string) ?? null,
    email: (r.email as string) ?? null,
    country: (r.country as string) ?? null,
    town: (r.town as string) ?? null,
    cohort: (r.cohort as string) ?? null,
    inScope: r.in_scope as boolean,
    isAnchor: r.is_anchor as boolean,
    hasMakerFolder: r.has_maker_folder as boolean,
    growsChilis: r.grows_chilis as boolean,
    makesSauce: r.makes_sauce as boolean,
    isMember: r.is_member as boolean,
    awardCount: r.award_count as number,
    campaigns: (r.campaigns as string[]) ?? [],
  }));
}

export interface ProducerDetail {
  slug: string;
  brand: string;
  contactName: string | null;
  email: string | null;
  country: string | null;
  town: string | null;
  region: string | null;
  driveUrl: string | null;
  cohort: string | null;
  inScope: boolean;
  isAnchor: boolean;
  hasMakerFolder: boolean;
  growsChilis: boolean;
  makesSauce: boolean;
  isMember: boolean;
  companyDesc: string | null;
  notes: string | null;
  updatedAt: string | null;
  awards: AwardRow[];
  campaigns: CampaignRow[];
  coverageCount: number;
  materials: MaterialsRow | null;
}

export interface AwardRow {
  region: string | null;
  category: string | null;
  rank: number | null;
  award: string | null;
  sauceName: string | null;
  sauceCode: string | null;
  score: number | null;
  notes: string | null;
}

export interface CampaignRow {
  campaignSlug: string;
  name: string | null;
  status: string;
  joinedAt: string | null;
}

export interface MaterialsRow {
  replyStatus: string | null;
  photosIn: boolean | null;
  quoteIn: boolean | null;
  quoteText: string | null;
}

export async function getProducerDetail(slug: string): Promise<ProducerDetail | null> {
  const [p] = (await sql`
    SELECT slug, brand, contact_name, email, country, town, region, drive_url,
           cohort, in_scope, is_anchor, has_maker_folder,
           grows_chilis, makes_sauce, is_member, company_desc, notes,
           updated_at::text AS updated_at
      FROM producers WHERE slug = ${slug}
  `) as Record<string, unknown>[];
  if (!p) return null;

  const awards = (await sql`
    SELECT region, category, rank, award, sauce_name, sauce_code, score, notes
      FROM awards WHERE producer_slug = ${slug}
     ORDER BY score DESC NULLS LAST, sauce_name
  `) as Record<string, unknown>[];

  const campaigns = (await sql`
    SELECT cp.campaign_slug, c.name, cp.status, cp.joined_at::text AS joined_at
      FROM campaign_producers cp
      LEFT JOIN campaigns c ON c.slug = cp.campaign_slug
     WHERE cp.producer_slug = ${slug}
     ORDER BY cp.campaign_slug
  `) as Record<string, unknown>[];

  const [cov] = (await sql`
    SELECT count(*)::int AS n FROM coverage WHERE producer_slug = ${slug}
  `) as Record<string, number>[];

  const [mat] = (await sql`
    SELECT reply_status, photos_in, quote_in, quote_text
      FROM materials WHERE producer_slug = ${slug}
  `) as Record<string, unknown>[];

  return {
    slug: p.slug as string,
    brand: p.brand as string,
    contactName: (p.contact_name as string) ?? null,
    email: (p.email as string) ?? null,
    country: (p.country as string) ?? null,
    town: (p.town as string) ?? null,
    region: (p.region as string) ?? null,
    driveUrl: (p.drive_url as string) ?? null,
    cohort: (p.cohort as string) ?? null,
    inScope: p.in_scope as boolean,
    isAnchor: p.is_anchor as boolean,
    hasMakerFolder: p.has_maker_folder as boolean,
    growsChilis: p.grows_chilis as boolean,
    makesSauce: p.makes_sauce as boolean,
    isMember: p.is_member as boolean,
    companyDesc: (p.company_desc as string) ?? null,
    notes: (p.notes as string) ?? null,
    updatedAt: (p.updated_at as string) ?? null,
    awards: awards.map((a) => ({
      region: (a.region as string) ?? null,
      category: (a.category as string) ?? null,
      rank: (a.rank as number) ?? null,
      award: (a.award as string) ?? null,
      sauceName: (a.sauce_name as string) ?? null,
      sauceCode: (a.sauce_code as string) ?? null,
      score: (a.score as number) ?? null,
      notes: (a.notes as string) ?? null,
    })),
    campaigns: campaigns.map((c) => ({
      campaignSlug: c.campaign_slug as string,
      name: (c.name as string) ?? null,
      status: c.status as string,
      joinedAt: (c.joined_at as string) ?? null,
    })),
    coverageCount: cov?.n ?? 0,
    materials: mat
      ? {
          replyStatus: (mat.reply_status as string) ?? null,
          photosIn: (mat.photos_in as boolean) ?? null,
          quoteIn: (mat.quote_in as boolean) ?? null,
          quoteText: (mat.quote_text as string) ?? null,
        }
      : null,
  };
}
