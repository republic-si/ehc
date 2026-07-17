// Press-value (EMV) calculation, ported verbatim from the Python enrichment
// (~/ehc-press/tools/fetch_authority.py recompute_eur). One place so the admin
// recomputes value the same way on every pickup save.
//
//   base  = (monthly_visits_est / 1000) * CPM(medium, scope) * prominence
//   value = max(75, round(base * ehsaFactor + seoEhsa + seoRoh))
//
// DR only affects value through SEO_BAND (the authority-on-reach multiplier was
// deliberately dropped in the Python). TV/radio earn no SEO (no clickable link).

const CPM_BY_MEDIUM: Record<string, Record<string, number>> = {
  web: { hyperlocal: 5, local: 5, regional: 15, national: 40, trade: 40, "pan-eu": 40 },
  print: { hyperlocal: 5, local: 5, regional: 15, national: 40, trade: 40, "pan-eu": 40 },
  tv: { local: 10, hyperlocal: 10, regional: 25, national: 80, "pan-eu": 80, trade: 25 },
  radio: { local: 6, hyperlocal: 6, regional: 15, national: 50, "pan-eu": 50, trade: 15 },
};

const PROMINENCE: Record<string, number> = {
  lede: 1.5,
  body: 1.0,
  quote: 1.0,
  footer: 0.5,
  boilerplate: 0.5,
  passing: 0.5,
};

const EHSA_BRAND_FACTOR: Record<string, number> = { full: 1.0, acronym: 0.5, no: 0.1 };

// band -> [do-follow value, nofollow value]
const SEO_BAND: Record<string, [number, number]> = {
  "DR<30": [50, 25],
  "DR30-50": [140, 70],
  "DR50-70": [375, 188],
  "DR70+": [700, 350],
};

const FLOOR_EUR = 75;

// A link earns SEO only when its follow-state is "yes" (do-follow) or "partial"
// (nofollow); anything else earns 0.
function linkSeo(band: string | null, state: string): number {
  if (!band || !(band in SEO_BAND)) return 0;
  const [doFollow, noFollow] = SEO_BAND[band];
  if (state === "yes") return doFollow;
  if (state === "partial") return noFollow;
  return 0;
}

/**
 * Extract the DR band from a stored `domain_authority` string like
 * "DR30-50 (OPR 4.12)" -> "DR30-50". Returns null if there's no known band.
 */
export function bandOf(domainAuthority: string | null | undefined): string | null {
  if (!domainAuthority) return null;
  const b = domainAuthority.trim().split(" ")[0];
  return b in SEO_BAND ? b : null;
}

export interface ValueInputs {
  monthlyVisits: number | null;
  medium: string;
  scope: string;
  position: string;
  mentionsEhsa: string;
  linkEhsaSite: string;
  followLinkRoh: string;
  /** stored domain_authority string; the band is parsed out of it */
  domainAuthority: string | null;
}

const norm = (s: string | null | undefined): string =>
  (s ?? "").trim().toLowerCase();

/**
 * Returns the modelled press value in EUR, or null when there's no traffic
 * (monthly visits <= 0) — matching the Python, which skips valueless rows.
 */
export function computePressValueEur(p: ValueInputs): number | null {
  const visits = p.monthlyVisits ?? 0;
  if (visits <= 0) return null;

  const m = norm(p.medium) || "web";
  const medium = m in CPM_BY_MEDIUM ? m : "web";
  const scope = norm(p.scope);
  const cpm =
    CPM_BY_MEDIUM[medium][scope] ??
    (medium === "web" || medium === "print" ? 15 : 25);
  const prom = PROMINENCE[norm(p.position)] ?? 1.0;
  const base = (visits / 1000) * cpm * prom;

  const ehsaFactor = EHSA_BRAND_FACTOR[norm(p.mentionsEhsa)] ?? 0.1;

  let seoEhsa = 0;
  let seoRoh = 0;
  if (medium !== "tv" && medium !== "radio") {
    const band = bandOf(p.domainAuthority);
    seoEhsa = linkSeo(band, norm(p.linkEhsaSite));
    seoRoh = linkSeo(band, norm(p.followLinkRoh)) * 0.5;
  }

  return Math.max(FLOOR_EUR, Math.round(base * ehsaFactor + seoEhsa + seoRoh));
}
