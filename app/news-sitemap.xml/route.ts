import { getAllReleases } from "@/lib/releases";
import { SITE_URL, SITE_NAME, releaseIsoDateTime } from "@/lib/site";

export const dynamic = "force-static";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const releases = await getAllReleases();
  const now = Date.now();
  const twoDaysMs = 1000 * 60 * 60 * 48;

  const recent = releases.filter((r) => {
    if (r.isDraft || !r.isoDate) return false;
    const ts = new Date(`${r.isoDate}T09:00:00+02:00`).getTime();
    return Number.isFinite(ts) && now - ts <= twoDaysMs;
  });

  const items = recent
    .map((r) => {
      const url = `${SITE_URL}/releases/${r.slug}`;
      const pubDate = releaseIsoDateTime(r.isoDate) ?? "";
      return `  <url>
    <loc>${xmlEscape(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${xmlEscape(pubDate)}</news:publication_date>
      <news:title>${xmlEscape(r.headline)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
