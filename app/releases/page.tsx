import Link from "next/link";
import type { Metadata } from "next";
import { getAllReleases } from "@/lib/releases";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Releases — European Heat Council",
  description:
    "Press releases from across the European hot sauce industry, published by the European Heat Council.",
  alternates: { canonical: `${SITE_URL}/releases` },
  openGraph: {
    type: "website",
    title: "Releases — European Heat Council",
    description:
      "Press releases from across the European hot sauce industry, published by the European Heat Council.",
    siteName: SITE_NAME,
    url: `${SITE_URL}/releases`,
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
          <Link href="/" className="hover:opacity-100">
            Home
          </Link>
          <Link href="/releases" className="hover:opacity-100">
            Releases
          </Link>
          <a href="mailto:press@europeanheatcouncil.eu" className="hover:opacity-100">
            Press
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ReleasesIndex() {
  const releases = getAllReleases();
  const live = releases.filter((r) => !r.isDraft);
  const drafts = releases.filter((r) => r.isDraft);

  return (
    <>
      <TopBar />
      <header className="bg-paper-green border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="label text-muted mb-4">European Heat Council · Releases</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Press releases
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 max-w-2xl">
            The Council&rsquo;s press wire. Every release we&rsquo;ve published
            for European hot sauce producers, in chronological order.
          </p>
          <p className="mt-6 text-sm text-muted">
            {live.length} published · {drafts.length} forthcoming
          </p>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <ol className="divide-y divide-rule">
            {live.map((r) => (
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
                    <h2 className="text-lg sm:text-xl font-semibold leading-snug tracking-tight text-ink group-hover:text-accent">
                      {r.headline}
                    </h2>
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

          {drafts.length > 0 ? (
            <section className="mt-16 border-t border-rule pt-10">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  Forthcoming
                </h2>
                <span className="label text-muted">Embargoed / undated</span>
              </div>
              <ol className="divide-y divide-rule-soft">
                {drafts.map((r) => (
                  <li key={r.slug} className="py-5">
                    <Link
                      href={`/releases/${r.slug}`}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group"
                    >
                      <div className="md:col-span-3">
                        <p className="label text-muted-soft">
                          {r.city || "—"}
                          {r.country ? `, ${r.country}` : ""}
                        </p>
                      </div>
                      <div className="md:col-span-9">
                        <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground/75 group-hover:text-accent">
                          {r.headline}
                        </h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      </main>

      <footer className="bg-ink-deep text-white/80 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
          <p>
            &copy; MMXXVI European Heat Council &middot;{" "}
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
