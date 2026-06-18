import type { MetadataRoute } from "next";
import { getAllReleases } from "@/lib/releases";
import { getAllProducers } from "@/lib/producers";
import { SITE_URL, releaseIsoDateTime } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [releases, producers] = await Promise.all([
    getAllReleases(),
    getAllProducers(),
  ]);
  const now = new Date().toISOString();

  const releaseEntries: MetadataRoute.Sitemap = releases
    .filter((r) => !r.isDraft && r.isoDate)
    .map((r) => ({
      url: `${SITE_URL}/releases/${r.slug}`,
      lastModified: releaseIsoDateTime(r.isoDate) ?? now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/releases`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/coverage`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/producers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...producers.map((p) => ({
      url: `${SITE_URL}/producers/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...releaseEntries,
  ];
}
