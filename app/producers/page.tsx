import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllProducers } from "@/lib/producers";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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

function TopBar() {
  return (
    <div className="bg-ink text-white text-[12px]">
      <div className="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between">
        <span className="tracking-wide opacity-80">
          European Heat Council &middot; europeanheatcouncil.eu
        </span>
        <div className="hidden sm:flex gap-5 opacity-80">
          <Link href="/" className="hover:opacity-100">Home</Link>
          <Link href="/releases" className="hover:opacity-100">Releases</Link>
          <Link href="/producers" className="hover:opacity-100">Producers</Link>
          <Link href="/coverage" className="hover:opacity-100">Coverage</Link>
          <Link href="/about" className="hover:opacity-100">About</Link>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-rule bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/ehc-logo-wide.png"
            alt="European Heat Council"
            width={4000}
            height={557}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <nav className="hidden md:flex gap-8 text-sm">
          <Link href="/releases" className="hover:text-accent">Releases</Link>
          <Link href="/producers" className="hover:text-accent">Producers</Link>
          <Link href="/coverage" className="hover:text-accent">Coverage</Link>
          <Link href="/about" className="hover:text-accent">About</Link>
          <a href="mailto:press@europeanheatcouncil.eu" className="hover:text-accent">Press</a>
        </nav>
      </div>
    </header>
  );
}

export default async function ProducersPage() {
  const producers = await getAllProducers();
  const countries = new Set(producers.map((p) => p.country).filter(Boolean));

  return (
    <>
      <TopBar />
      <Header />

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
              email{" "}
              <a
                href="mailto:press@europeanheatcouncil.eu"
                className="text-ink underline underline-offset-2 hover:text-accent"
              >
                press@europeanheatcouncil.eu
              </a>{" "}
              from a verifiable masthead address.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-ink-deep text-white/80 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
          <p>
            &copy; MMXXVI European Heat Council ·{" "}
            <Link href="/" className="hover:text-accent">Home</Link>
          </p>
          <p>
            <a href="mailto:press@europeanheatcouncil.eu" className="hover:text-accent">
              press@europeanheatcouncil.eu
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
