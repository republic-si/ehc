import { getAllReleases, type Release } from "@/lib/releases";

export interface Producer {
  slug: string;
  displayName: string;
  city: string;
  country: string;
  latestIsoDate: string | null;
  releases: Release[];
}

const NAME_OVERRIDES: Record<string, string> = {
  "opg-ljutistra": "OPG Ljutistra",
  "piri-piri-co": "Piri-Piri & Co",
  "mv-chili-manufaktur": "MV Chili Manufaktur",
  "chilisaus-be-eu": "chilisaus.be",
  "b-orto-peppers": "B-Orto Peppers",
  "cili-roza": "Cili Roža",
  "cili-napoj": "Cili Napój",
  "kanda-zanda": "Kanda Zanda",
};

const DUPLICATE_SLUGS = new Set<string>([
  "big-ginger-sauce-co",
]);

function isProducerSlug(slug: string): boolean {
  if (slug.startsWith("cluster-")) return false;
  if (DUPLICATE_SLUGS.has(slug)) return false;
  return true;
}

function slugToName(slug: string): string {
  if (NAME_OVERRIDES[slug]) return NAME_OVERRIDES[slug];
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export function getAllProducers(): Producer[] {
  const releases = getAllReleases();
  const bySlug = new Map<string, Release[]>();
  for (const r of releases) {
    if (!isProducerSlug(r.slug)) continue;
    const list = bySlug.get(r.slug) ?? [];
    list.push(r);
    bySlug.set(r.slug, list);
  }
  const producers: Producer[] = [];
  for (const [slug, list] of bySlug) {
    const published = list.filter((r) => !r.isDraft);
    const ordered = (published.length ? published : list).sort((a, b) => {
      if (a.isoDate && b.isoDate) return b.isoDate.localeCompare(a.isoDate);
      if (a.isoDate) return -1;
      if (b.isoDate) return 1;
      return 0;
    });
    const latest = ordered[0];
    producers.push({
      slug,
      displayName: slugToName(slug),
      city: latest.city,
      country: latest.country,
      latestIsoDate: ordered.find((r) => r.isoDate)?.isoDate ?? null,
      releases: ordered,
    });
  }
  producers.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return producers;
}

export function getProducer(slug: string): Producer | null {
  return getAllProducers().find((p) => p.slug === slug) ?? null;
}

export function getProducerSlugs(): string[] {
  return getAllProducers().map((p) => p.slug);
}
