import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_RELEASE_IMAGE } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import {
  CATALOGUE,
  CATALOGUE_IS_PLACEHOLDER,
} from "@/lib/chilifest/catalogue";

const CANONICAL = `${SITE_URL}/chilifest/catalogue`;
const DESCRIPTION =
  "The producers and sauces on the table at Berlin Chili Fest: origin, heat and tasting notes, maintained by the European Heat Council.";

export const metadata: Metadata = {
  title: `Sauce catalogue — Berlin Chili Fest — ${SITE_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: `Sauce catalogue — Berlin Chili Fest`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    url: CANONICAL,
    images: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Berlin Chili Fest sauce catalogue",
  description: DESCRIPTION,
  url: CANONICAL,
  numberOfItems: CATALOGUE.length,
  itemListElement: CATALOGUE.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${s.sauce} — ${s.producer}`,
  })),
};

export default function CataloguePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="print:hidden">
        <TopBar />
        <SiteHeader />
      </div>

      <main className="bg-white">
        <article className="max-w-4xl mx-auto px-6 py-14 sm:py-16">
          <Link
            href="/chilifest"
            className="label text-muted hover:text-accent print:hidden"
          >
            ← Berlin Chili Fest press hub
          </Link>

          <h1 className="mt-8 text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
            Sauce catalogue
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/85 max-w-2xl">
            The producers and sauces on the table at Berlin Chili Fest, with
            origin, heat and tasting notes. Maintained by the European Heat
            Council for press reference.
          </p>

          {CATALOGUE_IS_PLACEHOLDER ? (
            <p className="mt-6 inline-block label text-accent border border-accent/40 px-3 py-2">
              Draft &mdash; placeholder entries, not for publication
            </p>
          ) : null}

          {CATALOGUE.length === 0 ? (
            <p className="mt-10 text-muted">
              The catalogue is being finalised. Check back shortly.
            </p>
          ) : (
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-rule text-left">
                    <th className="label text-muted py-2 pr-4">Producer</th>
                    <th className="label text-muted py-2 pr-4">Sauce</th>
                    <th className="label text-muted py-2 pr-4">Origin</th>
                    <th className="label text-muted py-2 pr-4">Heat</th>
                    <th className="label text-muted py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {CATALOGUE.map((s, i) => (
                    <tr
                      key={`${s.producer}-${s.sauce}-${i}`}
                      className="border-b border-rule-soft align-top break-inside-avoid"
                    >
                      <td className="py-3 pr-4 font-medium text-ink">
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent"
                          >
                            {s.producer}
                          </a>
                        ) : (
                          s.producer
                        )}
                      </td>
                      <td className="py-3 pr-4 text-foreground/90">{s.sauce}</td>
                      <td className="py-3 pr-4 text-foreground/80">
                        {s.origin}
                      </td>
                      <td className="py-3 pr-4 text-foreground/80">{s.heat}</td>
                      <td className="py-3 text-foreground/80 leading-relaxed">
                        {s.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-rule flex justify-between text-sm print:hidden">
            <Link href="/chilifest" className="more-link">
              Back to the press hub
            </Link>
            <Link href="/contact?topic=Press" className="more-link">
              Press contact
            </Link>
          </div>
        </article>
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
