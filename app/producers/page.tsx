import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducers } from "@/lib/producers";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";

export const metadata: Metadata = {
  title: "Producers — European Heat Council",
  description:
    "Independent European hot sauce producers covered on the European Heat Council wire.",
  alternates: { canonical: `${SITE_URL}/producers` },
  openGraph: {
    type: "website",
    title: "Producers — European Heat Council",
    description:
      "Independent European hot sauce producers covered on the European Heat Council wire.",
    siteName: SITE_NAME,
    url: `${SITE_URL}/producers`,
  },
};


export default async function ProducersPage() {
  const producers = await getAllProducers();
  const countries = new Set(producers.map((p) => p.country).filter(Boolean));

  return (
    <>
      <TopBar />
      <SiteHeader />

      <section className="bg-paper-green border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="label text-muted mb-4">European Heat Council · Producers</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Producers on the wire.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 max-w-2xl">
            Independent European hot sauce producers we&rsquo;ve published
            releases for. Public listing shows top-line only.
          </p>
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
            <div>
              <dt className="label text-muted">Producers</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {producers.length}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Countries</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {countries.size}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Detailed contacts</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                Press access
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Directory
            </h2>
            <span className="label text-muted">A → Z</span>
          </div>

          <ol className="divide-y divide-rule">
            {producers.map((p) => (
              <li key={p.slug} className="py-5">
                <Link
                  href={`/producers/${p.slug}`}
                  className="grid grid-cols-12 gap-4 items-baseline group"
                >
                  <div className="col-span-12 sm:col-span-6">
                    <p className="text-base font-semibold tracking-tight text-ink group-hover:text-accent">
                      {p.displayName}
                    </p>
                  </div>
                  <div className="col-span-8 sm:col-span-4">
                    <p className="text-sm text-muted">
                      {p.city || "—"}
                      {p.country ? `, ${p.country}` : ""}
                    </p>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-right">
                    <span className="label text-muted">
                      {p.releases.length} {p.releases.length === 1 ? "release" : "releases"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-12 bg-paper-green border border-rule p-6 sm:p-8">
            <p className="label text-ink mb-3">Press access</p>
            <p className="text-base leading-relaxed text-foreground/85 max-w-2xl">
              Verified journalists can request producer press contacts,
              high-resolution photography, pre-approved quotes, and embargoed
              materials. Self-serve sign-in is in development. In the meantime,
              use the{" "}
              <Link
                href="/contact?topic=Press"
                className="text-ink underline underline-offset-2 hover:text-accent"
              >
                contact page
              </Link>{" "}
              from a verifiable masthead address.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
