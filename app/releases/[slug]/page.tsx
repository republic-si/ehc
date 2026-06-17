import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllReleases, getRelease } from "@/lib/releases";
import {
  SITE_URL,
  SITE_NAME,
  PUBLISHER_LOGO_PATH,
  DEFAULT_RELEASE_IMAGE,
  releaseIsoDateTime,
  releaseUrl,
} from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllReleases().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) return { title: "Release not found" };
  const canonical = releaseUrl(slug);
  const description = release.subhead || release.lead.slice(0, 200);
  const publishedTime = releaseIsoDateTime(release.isoDate) ?? undefined;
  return {
    title: `${release.headline} — European Heat Council`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: release.headline,
      description,
      siteName: SITE_NAME,
      url: canonical,
      publishedTime,
      authors: [SITE_NAME],
      images: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
    },
    twitter: {
      card: "summary_large_image",
      title: release.headline,
      description,
      images: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
    },
  };
}

function TopBar() {
  return (
    <div className="bg-ink text-white text-[12px]">
      <div className="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between">
        <span className="tracking-wide opacity-80">
          European Heat Council &middot; europeanheatcouncil.eu
        </span>
        <div className="hidden sm:flex gap-5 opacity-80">
          <Link href="/" className="hover:opacity-100">
            Home
          </Link>
          <Link href="/releases" className="hover:opacity-100">
            Releases
          </Link>
          <a
            href="mailto:press@europeanheatcouncil.eu"
            className="hover:opacity-100"
          >
            Press
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function ReleasePage({ params }: { params: Params }) {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();

  const { headline, subhead, city, country, displayDate, isDraft, blocks, lead } =
    release;

  const publishedTime = releaseIsoDateTime(release.isoDate);
  const canonical = releaseUrl(slug);

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description: subhead || lead.slice(0, 200),
    ...(publishedTime
      ? { datePublished: publishedTime, dateModified: publishedTime }
      : {}),
    author: [{ "@type": "Organization", name: SITE_NAME, url: SITE_URL }],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${PUBLISHER_LOGO_PATH}`,
      },
    },
    image: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    ...(city && country
      ? {
          contentLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: city,
              addressCountry: country,
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <TopBar />

      <header className="bg-ink-deep text-white border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <Link
            href="/releases"
            className="label text-white/60 hover:text-white"
          >
            ← All releases
          </Link>
          <p className="label text-white/70 mt-8">
            European Heat Council · Press release
          </p>
          <p className="mt-4 text-sm text-white/80 tracking-wide">
            {city ? `${city}${country ? `, ${country}` : ""}` : "—"}
            {displayDate ? ` · ${displayDate}` : isDraft ? " · Forthcoming" : ""}
          </p>
          <p className="mt-2 text-xs text-white/55 tracking-wide">
            By {SITE_NAME}
          </p>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-white">
            {headline}
          </h1>
          {subhead ? (
            <p className="mt-6 text-lg leading-relaxed text-white/85">
              {subhead}
            </p>
          ) : null}
        </div>
      </header>

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          {isDraft ? (
            <p className="mb-10 inline-block label text-accent border border-accent/40 px-3 py-2">
              Forthcoming &mdash; date unconfirmed
            </p>
          ) : null}
          <div className="space-y-6 text-base leading-relaxed text-foreground/90">
            {blocks.map((b, i) => {
              if (b.kind === "attribution") {
                return (
                  <p
                    key={i}
                    className="text-sm text-muted italic border-l-2 border-rule pl-4 -mt-2"
                  >
                    — {b.text}
                  </p>
                );
              }
              if (b.kind === "heading") {
                return (
                  <h2
                    key={i}
                    className="label text-ink mt-12 pb-2 border-b border-rule"
                  >
                    {b.text}
                  </h2>
                );
              }
              return (
                <p key={i} className="text-foreground/85">
                  {b.text}
                </p>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-rule flex flex-col sm:flex-row gap-6 justify-between text-sm">
            <div>
              <p className="label text-muted">Press contact</p>
              <a
                href="mailto:press@europeanheatcouncil.eu"
                className="mt-2 inline-block text-ink hover:text-accent"
              >
                press@europeanheatcouncil.eu
              </a>
            </div>
            <Link href="/releases" className="more-link self-start">
              All releases
            </Link>
          </div>
        </article>
      </main>

      <footer className="bg-ink-deep text-white/80 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
          <p>
            &copy; MMXXVI European Heat Council ·{" "}
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </p>
          <p>
            <a
              href="mailto:press@europeanheatcouncil.eu"
              className="hover:text-accent"
            >
              press@europeanheatcouncil.eu
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
