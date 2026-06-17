import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPickups, getPickupStats } from "@/lib/coverage";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coverage — European Heat Council",
  description:
    "Outlets that have run releases from the European Heat Council wire.",
  alternates: { canonical: `${SITE_URL}/coverage` },
  openGraph: {
    type: "website",
    title: "Coverage — European Heat Council",
    description:
      "Outlets that have run releases from the European Heat Council wire.",
    siteName: SITE_NAME,
    url: `${SITE_URL}/coverage`,
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
          <Link href="/coverage" className="hover:opacity-100">
            Coverage
          </Link>
          <Link href="/about" className="hover:opacity-100">
            About
          </Link>
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
          <Link href="/releases" className="hover:text-accent">
            Releases
          </Link>
          <Link href="/coverage" className="hover:text-accent">
            Coverage
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <a
            href="mailto:press@europeanheatcouncil.eu"
            className="hover:text-accent"
          >
            Press
          </a>
        </nav>
      </div>
    </header>
  );
}

function formatReach(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toString();
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function CoveragePage() {
  const pickups = getPickups();
  const stats = getPickupStats(pickups);

  return (
    <>
      <TopBar />
      <Header />

      <section className="bg-paper-green border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="label text-muted mb-4">
            European Heat Council · Coverage
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Where our releases run.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 max-w-2xl">
            Independently verified pickups of releases published on the wire.
            Outlet, country, date, and outbound link to the article.
          </p>
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            <div>
              <dt className="label text-muted">Pickups</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {stats.count}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Outlets</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {stats.outlets}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Countries</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {stats.countries}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Total reach</dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {formatReach(stats.totalReach)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              All pickups
            </h2>
            <span className="label text-muted">Most recent first</span>
          </div>

          <ol className="divide-y divide-rule">
            {pickups.map((p, i) => (
              <li key={`${p.articleUrl}-${i}`} className="py-5">
                <div className="grid grid-cols-12 gap-4 items-baseline">
                  <div className="col-span-12 sm:col-span-2">
                    <p className="text-sm text-muted">{p.date || "—"}</p>
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <p className="text-base font-semibold tracking-tight text-ink leading-snug">
                      <a
                        href={p.articleUrl}
                        target="_blank"
                        rel="noopener nofollow"
                        className="hover:text-accent"
                      >
                        {p.outletName || hostname(p.outletUrl) || "Outlet"}
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-muted-soft tracking-wide break-all">
                      {hostname(p.articleUrl)}
                    </p>
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    {p.makerSlug ? (
                      <Link
                        href={`/releases/${p.makerSlug}`}
                        className="text-sm text-ink hover:text-accent"
                      >
                        {p.makerSlug}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-right">
                    <span className="label text-muted">
                      {p.country || "—"}
                    </span>
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-right">
                    <span className="text-sm text-ink font-medium">
                      {formatReach(p.estReach ?? p.monthlyVisits)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-xs text-muted-soft leading-relaxed max-w-2xl">
            Reach figures are estimated monthly visits from outlet self-reporting
            or third-party traffic data, used as a directional indicator only.
            Pickups are verified manually against the outbound article URL.
          </p>
        </div>
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
