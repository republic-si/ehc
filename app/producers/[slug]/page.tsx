import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducers, getProducer } from "@/lib/producers";
import { SITE_URL, SITE_NAME } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllProducers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const producer = getProducer(slug);
  if (!producer) return { title: "Producer not found" };
  const canonical = `${SITE_URL}/producers/${slug}`;
  const description = `${producer.displayName} — ${producer.city ? `${producer.city}, ` : ""}${producer.country}. Releases published on the European Heat Council wire.`;
  return {
    title: `${producer.displayName} — European Heat Council`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      title: producer.displayName,
      description,
      siteName: SITE_NAME,
      url: canonical,
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

export default async function ProducerPage({ params }: { params: Params }) {
  const { slug } = await params;
  const producer = getProducer(slug);
  if (!producer) notFound();

  return (
    <>
      <TopBar />
      <Header />

      <section className="bg-paper-green border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <Link href="/producers" className="label text-muted hover:text-ink">
            ← All producers
          </Link>
          <p className="label text-muted mt-8">Producer</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            {producer.displayName}
          </h1>
          <p className="mt-3 text-sm text-foreground/80 tracking-wide">
            {producer.city ? `${producer.city}` : "—"}
            {producer.country ? `, ${producer.country}` : ""}
          </p>
        </div>
      </section>

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14">
          <section>
            <h2 className="label text-ink pb-2 border-b border-rule">
              Public top-line
            </h2>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
              <div>
                <dt className="label text-muted">Name</dt>
                <dd className="mt-1 text-ink">{producer.displayName}</dd>
              </div>
              <div>
                <dt className="label text-muted">Location</dt>
                <dd className="mt-1 text-ink">
                  {producer.city || "—"}
                  {producer.country ? `, ${producer.country}` : ""}
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Releases on the wire</dt>
                <dd className="mt-1 text-ink">{producer.releases.length}</dd>
              </div>
              <div>
                <dt className="label text-muted">Most recent</dt>
                <dd className="mt-1 text-ink">{producer.latestIsoDate || "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="label text-ink pb-2 border-b border-rule">
              Releases
            </h2>
            <ol className="mt-6 divide-y divide-rule-soft">
              {producer.releases.map((r, i) => (
                <li key={`${r.slug}-${i}`} className="py-4">
                  <Link
                    href={`/releases/${r.slug}`}
                    className="grid grid-cols-12 gap-4 items-baseline group"
                  >
                    <div className="col-span-3 sm:col-span-2">
                      <p className="text-xs text-muted tracking-wide">
                        {r.displayDate || (r.isDraft ? "Forthcoming" : "—")}
                      </p>
                    </div>
                    <div className="col-span-9 sm:col-span-10">
                      <p className="text-sm font-medium leading-snug text-ink group-hover:text-accent">
                        {r.headline}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12 bg-paper-green border border-rule p-6 sm:p-8">
            <p className="label text-ink mb-3">Press access</p>
            <p className="text-base leading-relaxed text-foreground/85">
              The following are available to verified journalists on request:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/85">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block w-1.5 h-1.5 bg-ink/60 rounded-full" />
                Producer&rsquo;s direct press contact
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block w-1.5 h-1.5 bg-ink/60 rounded-full" />
                High-resolution photography (press kit folder)
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block w-1.5 h-1.5 bg-ink/60 rounded-full" />
                Pre-approved producer quotes and B-roll
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block w-1.5 h-1.5 bg-ink/60 rounded-full" />
                Tasting samples and interview availability
              </li>
            </ul>
            <p className="mt-5 text-sm text-muted">
              Self-serve journalist sign-in is in development. For now, email{" "}
              <a
                href="mailto:press@europeanheatcouncil.eu"
                className="text-ink underline underline-offset-2 hover:text-accent"
              >
                press@europeanheatcouncil.eu
              </a>{" "}
              from a masthead address.
            </p>
          </section>

          <div className="mt-12 pt-6 border-t border-rule flex justify-between text-sm">
            <Link href="/producers" className="more-link">
              All producers
            </Link>
            <Link href={`/releases/${producer.slug}`} className="more-link">
              Latest release
            </Link>
          </div>
        </article>
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
