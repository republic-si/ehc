import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import { PHOTO_CREDIT } from "@/lib/chilifest/media";
import { MAKERS, type Maker } from "@/lib/chilifest/makers";

const SEGMENTS = [
  "Hot sauces",
  "Chilli oils & crisps",
  "Salsas, pastes & condiments",
] as const;

// Product-type segmentation (from each maker's flagship + description), replacing
// the deprecated Flavour / Seed-to-Sauce / Hyperlocal tracks.
const SEGMENT_OF: Record<string, (typeof SEGMENTS)[number]> = {
  "queima-beicas": "Hot sauces",
  chillipeterson: "Hot sauces",
  "marie-sharp-s": "Hot sauces",
  "not-that-spicy": "Hot sauces",
  "roots-radicals": "Hot sauces",
  "dr-john-s-hot-sauce": "Hot sauces",
  "salsa-boy": "Hot sauces",
  "instant-taste": "Chilli oils & crisps",
  "don-cabron": "Chilli oils & crisps",
  moja: "Chilli oils & crisps",
  "qudo-tjes": "Chilli oils & crisps",
  "momo-haus": "Chilli oils & crisps",
  "teig-fullung": "Chilli oils & crisps",
  "luchadoras-del-sabor": "Salsas, pastes & condiments",
  "harissa-co": "Salsas, pastes & condiments",
  "yak-thai": "Salsas, pastes & condiments",
  "neck-dart": "Salsas, pastes & condiments",
  chiliwerk: "Salsas, pastes & condiments",
  "ti-dodo-epice": "Salsas, pastes & condiments",
};

const CANONICAL = `${SITE_URL}/chilifest/makers`;
const OG_IMAGE = `${SITE_URL}/chilifest/og.jpg`;
const INTRO =
  "Berlin Chili Fest brings together more than 50 independent makers. The nineteen featured here have offered samples and interviews to press ahead of the show, gathered one maker a page: who they are, how the sauce tastes, and what to put it on.";

export const metadata: Metadata = {
  title: `The Makers of the Harvest — Berlin Chili Fest — ${SITE_NAME}`,
  description: INTRO,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: "The Makers of the Harvest — Berlin Chili Fest",
    description: INTRO,
    siteName: SITE_NAME,
    url: CANONICAL,
    images: [OG_IMAGE],
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "The Makers of the Harvest — Berlin Chili Fest",
  description: INTRO,
  url: CANONICAL,
  numberOfItems: MAKERS.length,
  itemListElement: MAKERS.map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${m.name}${m.maker ? ` — ${m.maker}` : ""}`,
  })),
};

function heatLevel(h: string): number | null {
  // Heat is written "N/10" or "N–M/10". The level is the numerator (upper of a
  // range), NOT the "/10" denominator — otherwise every sauce reads 10/10.
  const before = h.split("/")[0] ?? "";
  const nums = before.match(/\d+/g);
  if (!nums) return null;
  return Math.min(10, Math.max(...nums.map((x) => parseInt(x, 10))));
}

function Heat({ heat }: { heat: string }) {
  const n = heatLevel(heat);
  if (n === null) return null;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-3 rounded-[1px] ${i < n ? "bg-accent" : "bg-rule"}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted font-mono">{heat}</span>
    </div>
  );
}

function MakerCard({ maker: m }: { maker: Maker }) {
  return (
    <article
      id={m.id}
      className="border border-rule overflow-hidden scroll-mt-24 break-inside-avoid"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[34%_1fr]">
        <div className="relative aspect-square bg-paper-green/50">
          {m.photo ? (
            <Image
              src={m.photo}
              alt={`${m.name} at Berlin Chili Fest`}
              fill
              sizes="(min-width:640px) 34vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="font-semibold text-ink/70 text-lg leading-tight">
                {m.name}
              </span>
              <span className="label text-muted-soft mt-2">Image coming soon</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="label text-muted">{m.location}</p>
          <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-ink leading-tight">
            {m.name}
          </h3>
          {m.maker ? (
            <p className="mt-1 text-sm text-muted">{m.maker}</p>
          ) : null}
          {m.awards ? (
            <p className="mt-3">
              {/* EHSA award pill — EHSA brand colours (#f4c518 / #1a1a1a), per the
                  EHC icon set. Deliberately off the EHC green: it's a cross-brand
                  award mark. */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.05em]"
                style={{ background: "#f4c518", color: "#1a1a1a" }}
              >
                <span aria-hidden>★</span> EHSA · {m.awards}
              </span>
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            {m.story}
          </p>

          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {m.flagship ? (
              <div>
                <dt className="label text-muted">Flagship</dt>
                <dd className="mt-1 text-foreground/90">{m.flagship}</dd>
              </div>
            ) : null}
            {heatLevel(m.heat) !== null ? (
              <div>
                <dt className="label text-muted">Heat</dt>
                <dd className="mt-1">
                  <Heat heat={m.heat} />
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      {m.angles.length > 0 ? (
        <div className="border-t border-rule p-6">
          <p className="label text-muted">Story angles</p>
          <ul className="mt-3 space-y-2">
            {m.angles.map((a, i) => (
              <li
                key={i}
                className="text-sm text-foreground/80 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

export default function MakersPage() {
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

      <header className="bg-ink-deep text-white border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-20">
          <Link
            href="/chilifest"
            className="label text-white/60 hover:text-white print:hidden"
          >
            ← Berlin Chili Fest press hub
          </Link>
          <p className="label text-white/70 mt-8">
            Press selection · sample-ready makers
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight">
            The Makers of the Harvest
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            {INTRO}
          </p>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-16 space-y-16">
          <nav
            aria-label="Makers index"
            className="border border-rule p-6 print:hidden"
          >
            <p className="label text-muted mb-4">
              Index · {MAKERS.length} featured makers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
              {SEGMENTS.map((segment) => {
                const inSeg = MAKERS.filter((m) => SEGMENT_OF[m.id] === segment);
                if (inSeg.length === 0) return null;
                return (
                  <div key={segment}>
                    <p className="label text-accent mb-2">{segment}</p>
                    <ul className="space-y-1.5">
                      {inSeg.map((m) => (
                        <li key={m.id}>
                          <a
                            href={`#${m.id}`}
                            className="text-sm text-ink hover:text-accent"
                          >
                            {m.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </nav>

          {SEGMENTS.map((segment) => {
            const inSeg = MAKERS.filter((m) => SEGMENT_OF[m.id] === segment);
            if (inSeg.length === 0) return null;
            return (
              <section key={segment}>
                <div className="border-b border-rule pb-3 mb-8">
                  <h2 className="label text-accent">
                    {segment}{" "}
                    <span className="text-muted-soft">· {inSeg.length}</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                  {inSeg.map((m) => (
                    <MakerCard key={m.id} maker={m} />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="pt-8 border-t border-rule flex flex-col sm:flex-row justify-between gap-4 text-sm print:hidden">
            <Link href="/chilifest" className="more-link">
              Back to the press hub
            </Link>
            <p className="text-xs text-muted-soft">Photos: {PHOTO_CREDIT}</p>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
