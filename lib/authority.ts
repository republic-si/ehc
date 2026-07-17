// Domain authority via OpenPageRank, ported from ~/ehc-press/tools/fetch_authority.py.
// Only affects press value through the SEO band (see lib/coverage-value.ts), so
// a missing key / no data just means no SEO credit — never a hard failure.
//
// Needs OPR_API_KEY in the environment (ehc-site .env.local + Vercel). Simon's
// key lives at ~/.config/openpagerank-key.

const SOCIAL_HOSTS = [
  "facebook.com",
  "instagram.com",
  "x.com",
  "twitter.com",
  "tiktok.com",
  "youtube.com",
  "linkedin.com",
  "threads.net",
];

export function outletDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function isSocial(domain: string): boolean {
  return SOCIAL_HOSTS.some((h) => domain === h || domain.endsWith("." + h));
}

// 0-10 OpenPageRank decimal -> DR band. <=0 means no data.
function bandFor(v: number): string | null {
  if (v <= 0) return null;
  if (v < 3) return "DR<30";
  if (v < 5) return "DR30-50";
  if (v < 7) return "DR50-70";
  return "DR70+";
}

export interface Authority {
  band: string | null;
  /** the string to store in pickups.domain_authority */
  domainAuthority: string;
}

/**
 * Look up a domain's authority. Returns null only when we can't attempt it (bad
 * URL or no API key configured) — the caller then leaves domain_authority as-is.
 * Social hosts and no-data domains resolve to a band-less Authority.
 */
export async function fetchAuthority(url: string): Promise<Authority | null> {
  const domain = outletDomain(url);
  if (!domain) return null;
  if (isSocial(domain)) {
    return { band: null, domainAuthority: `n/a (${domain})` };
  }
  const key = process.env.OPR_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://openpagerank.com/api/v1.0/getPageRank?domains%5B%5D=${encodeURIComponent(domain)}`,
      { headers: { "API-OPR": key }, signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      response?: { page_rank_decimal?: number | string | null }[];
    };
    const raw = data?.response?.[0]?.page_rank_decimal;
    const v = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
    if (!Number.isFinite(v) || v <= 0) {
      return { band: null, domainAuthority: "unknown" };
    }
    const band = bandFor(v);
    return { band, domainAuthority: `${band} (OPR ${v.toFixed(2)})` };
  } catch {
    return null;
  }
}
