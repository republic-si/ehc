export const SITE_URL = "https://europeanheatcouncil.eu";
export const SITE_NAME = "European Heat Council";
export const PUBLISHER_LOGO_PATH = "/ehc-logo-wide.png";
export const DEFAULT_RELEASE_IMAGE = "/img/hero-market.png";

// The `publisher` entity for every NewsArticle. Typed NewsMediaOrganization to
// carry Google News publisher-trust signals, and scoped to the press function —
// the site's own homepage entity stays a plain Organization (convening body).
// Emitted as a FULL object (not an @id ref) on each release, because Google
// resolves an Article's publisher per-page and won't follow a cross-page @id.
export const NEWS_PUBLISHER_ID = `${SITE_URL}/#publisher`;
export const newsPublisher = {
  "@type": "NewsMediaOrganization",
  "@id": NEWS_PUBLISHER_ID,
  name: SITE_NAME,
  url: SITE_URL,
  foundingDate: "2026",
  // /about states EHC's editorial standards + corrections route.
  publishingPrinciples: `${SITE_URL}/about`,
  correctionsPolicy: `${SITE_URL}/about`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}${PUBLISHER_LOGO_PATH}`,
  },
} as const;

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${SITE_URL}${path}`;
}

export function releaseUrl(slug: string): string {
  return absoluteUrl(`/releases/${slug}`);
}

export function releaseIsoDateTime(isoDate: string | null): string | null {
  if (!isoDate) return null;
  return `${isoDate}T09:00:00+02:00`;
}
