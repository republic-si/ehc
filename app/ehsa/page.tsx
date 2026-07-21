import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";
import { getReleasesByCampaign } from "@/lib/releases";
import { COPY, asLang, RELEASE_CAMPAIGN, PRESS_EMAIL, PRESS_KIT_URL } from "@/lib/ehsa/copy";

// EHSA 2026 press hub. Cloned from the chilifest microsite pattern, wired to the
// live getReleasesByCampaign primitive. Public copy is DRAFT (see lib/ehsa/copy.ts).

const CANONICAL = `${SITE_URL}/ehsa`;
type SP = Promise<{ lang?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  return {
    title: `${t.heroTitle} — ${SITE_NAME}`,
    description: t.heroLede,
    alternates: {
      canonical: CANONICAL,
      languages: { en: CANONICAL, de: `${CANONICAL}?lang=de` },
    },
    openGraph: {
      type: "website",
      title: `${t.heroTitle} — press hub`,
      description: t.heroLede,
      siteName: SITE_NAME,
      url: lang === "de" ? `${CANONICAL}?lang=de` : CANONICAL,
    },
  };
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "European Hot Sauce Awards",
  url: CANONICAL,
  parentOrganization: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

export default async function EhsaHub({ searchParams }: { searchParams: SP }) {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  const releases = (await getReleasesByCampaign(RELEASE_CAMPAIGN)).filter((r) => !r.isDraft);
  const other = lang === "de" ? "en" : "de";
  const otherHref = other === "de" ? `${CANONICAL}?lang=de` : CANONICAL;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <TopBar />

      <header className="bg-paper-green border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-baseline justify-between">
            <p className="label text-muted mb-4">{t.eyebrow}</p>
            <Link href={otherHref} className="text-sm text-muted hover:text-accent uppercase">
              {other}
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            {t.heroTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 max-w-2xl">
            {t.heroLede}
          </p>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 space-y-16">
          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-semibold text-ink">{t.statEntries}</p>
              <p className="mt-1 text-sm text-muted">{t.statEntriesLabel}</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-ink">{t.statAwards}</p>
              <p className="mt-1 text-sm text-muted">{t.statAwardsLabel}</p>
            </div>
          </section>

          {/* What */}
          <section className="max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight text-ink">{t.whatTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">{t.whatBody}</p>
          </section>

          {/* Releases lane */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-6">
              {t.releasesTitle}
            </h2>
            {releases.length > 0 ? (
              <ol className="divide-y divide-rule">
                {releases.map((r) => (
                  <li key={r.slug} className="py-7">
                    <Link
                      href={`/releases/${r.slug}`}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group"
                    >
                      <div className="md:col-span-3 flex flex-col gap-1">
                        <p className="label text-ink">
                          {r.city || "—"}
                          {r.country ? `, ${r.country}` : ""}
                        </p>
                        <p className="text-sm text-muted">{r.displayDate}</p>
                      </div>
                      <div className="md:col-span-9">
                        <h3 className="text-lg sm:text-xl font-semibold leading-snug tracking-tight text-ink group-hover:text-accent">
                          {r.headline}
                        </h3>
                        {r.subhead ? (
                          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                            {r.subhead}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-base leading-relaxed text-foreground/70 max-w-2xl">
                {t.releasesEmpty}
              </p>
            )}
          </section>

          {/* Press kit + contact */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-rule pt-12">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink">{t.kitTitle}</h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/80">{t.kitBody}</p>
              {PRESS_KIT_URL ? (
                <a
                  href={PRESS_KIT_URL}
                  className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  {t.kitButton}
                </a>
              ) : null}
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink">{t.contactTitle}</h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/80">{t.contactBody}</p>
              <a
                href={`mailto:${PRESS_EMAIL}`}
                className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
              >
                {PRESS_EMAIL}
              </a>
            </div>
          </section>

          {/* Boilerplate */}
          <section className="border-t border-rule pt-10">
            <p className="text-sm leading-relaxed text-muted max-w-3xl">{t.boilerplate}</p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
