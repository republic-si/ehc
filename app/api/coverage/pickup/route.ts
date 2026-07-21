// Headless coverage-pickup ingest — the automation twin of savePickupAction.
//
// Same two steps as the admin form (lib/authority.fetchAuthority ->
// lib/coverage.upsertPickup), so EMV + domain authority compute identically.
// The ONLY difference is the gate: the form uses an Auth.js session
// (resolveScope); this uses a bearer token. Whoever holds COVERAGE_API_TOKEN
// may write any campaign — it's an internal press tool, not a user surface.
//
//   POST /api/coverage/pickup
//   Authorization: Bearer <COVERAGE_API_TOKEN>
//   { "articleUrl", "makerSlug", "campaignSlug", ...optional pickup fields }

import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { fetchAuthority } from "@/lib/authority";
import { upsertPickup, type PickupInput } from "@/lib/coverage";

type Body = Partial<Record<keyof PickupInput, unknown>>;

function s(v: unknown): string {
  return v == null ? "" : String(v).trim();
}
function numOrNull(v: unknown): number | null {
  const t = s(v).replace(/[, ]/g, "");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
function dateOrNull(v: unknown): string | null {
  const t = s(v);
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
}

export async function POST(req: Request): Promise<Response> {
  const token = process.env.COVERAGE_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "ingest disabled" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const articleUrl = s(body.articleUrl);
  const makerSlug = s(body.makerSlug);
  const campaignSlug = s(body.campaignSlug);
  if (!articleUrl || !makerSlug || !campaignSlug) {
    return NextResponse.json(
      { error: "articleUrl, makerSlug and campaignSlug are required" },
      { status: 422 },
    );
  }

  // Refresh domain authority from OpenPageRank; keep any supplied value on failure.
  const outletUrl = s(body.outletUrl);
  const authority = outletUrl ? await fetchAuthority(outletUrl) : null;
  const domainAuthority = authority
    ? authority.domainAuthority
    : s(body.domainAuthority);

  const input: PickupInput = {
    articleUrl,
    makerSlug,
    outletName: s(body.outletName),
    outletUrl,
    dateSpotted: dateOrNull(body.dateSpotted),
    language: s(body.language),
    country: s(body.country),
    medium: s(body.medium) || "web",
    scope: s(body.scope),
    position: s(body.position),
    monthlyVisits: numOrNull(body.monthlyVisits),
    mentionsEhsa: s(body.mentionsEhsa),
    mentionsRoh: s(body.mentionsRoh),
    linkEhsaSite: s(body.linkEhsaSite),
    followLinkRoh: s(body.followLinkRoh),
    domainAuthority,
    notes: s(body.notes),
    isFalsePositive: Boolean(body.isFalsePositive),
    campaignSlug,
  };

  await upsertPickup(input);

  // Echo back what the app computed on save, so the caller can sanity-check EMV.
  const rows = (await sql`
    SELECT press_value_eur, domain_authority
      FROM pickups
     WHERE article_url = ${articleUrl} AND maker_slug = ${makerSlug}
     LIMIT 1
  `) as { press_value_eur: number | null; domain_authority: string | null }[];

  return NextResponse.json({
    ok: true,
    articleUrl,
    makerSlug,
    campaignSlug,
    domainAuthority: rows[0]?.domain_authority ?? domainAuthority,
    pressValueEur: rows[0]?.press_value_eur ?? null,
  });
}
