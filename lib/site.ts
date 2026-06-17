export const SITE_URL = "https://europeanheatcouncil.eu";
export const SITE_NAME = "European Heat Council";
export const PUBLISHER_LOGO_PATH = "/ehc-logo-wide.png";
export const DEFAULT_RELEASE_IMAGE = "/img/hero-market.png";

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
