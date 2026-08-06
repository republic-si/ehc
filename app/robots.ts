import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Password-gated in proxy.ts; keep them out of the index too.
        disallow: [
          "/strategy.html",
          "/strategy-makers.html",
          "/makers-brief.html",
          "/strategy-makers.pdf",
          "/makers-brief.pdf",
        ],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
    host: SITE_URL,
  };
}
