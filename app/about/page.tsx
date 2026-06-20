import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";

export const metadata: Metadata = {
  title: "About — European Heat Council",
  description:
    "The European Heat Council is a trade newswire covering the European hot sauce industry. Editorial standards, contact, and publisher information.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <SiteHeader />

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <p className="label text-muted mb-4">About</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
            A trade newswire for the European hot sauce industry.
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85">
            <p>
              The European Heat Council publishes press releases covering the
              continent&rsquo;s independent hot sauce producers: award results,
              new producers entering distribution, heritage variety work, and
              industry events. Material is sourced direct from producers and
              from independent competitions such as the European Hot Sauce
              Awards (heatawards.eu).
            </p>
            <p>
              The Council seats in Berlin and operates alongside its member
              organisations across distribution, heritage and quality.
            </p>
          </div>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            Editorial standards
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Every release names the producer, the competition or event, the
              dateline, and the specific result. Tasting notes and quotes come
              direct from the producer or named jurors and are not edited for
              effect. We do not invent sauce descriptions or rankings.
            </p>
            <p>
              Coverage is editorial, not paid placement. Producers do not pay
              to appear on the wire. Where the Council&rsquo;s member
              organisations carry a commercial relationship with a producer
              (for example, a distribution arrangement through Republic of
              Heat), that relationship is disclosed in the release.
            </p>
            <p>
              Corrections are issued on the affected release page within
              twenty-four hours of confirmation. Use the{" "}
              <Link href="/contact?topic=Corrections" className="text-ink underline hover:text-accent">
                contact page
              </Link>{" "}
              for corrections or rights queries.
            </p>
          </div>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            Contact
          </h2>
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="label text-muted">Press &amp; general</dt>
              <dd className="mt-2">
                <Link
                  href="/contact"
                  className="text-ink hover:text-accent"
                >
                  Contact page
                </Link>
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Seat</dt>
              <dd className="mt-2 text-foreground/85">Berlin, Germany</dd>
            </div>
            <div>
              <dt className="label text-muted">Established</dt>
              <dd className="mt-2 text-foreground/85">MMXXVI</dd>
            </div>
            <div>
              <dt className="label text-muted">Domain</dt>
              <dd className="mt-2 text-foreground/85">europeanheatcouncil.eu</dd>
            </div>
          </dl>

          <div className="mt-16 pt-8 border-t border-rule flex justify-between text-sm">
            <Link href="/releases" className="more-link">
              All releases
            </Link>
            <Link href="/" className="more-link">
              Home
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
