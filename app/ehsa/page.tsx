import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";
import { COPY, asLang } from "@/lib/ehsa/copy";
import { RegisterInterestForm } from "./RegisterInterestForm";

// EHSA display face: heavy condensed grotesque, the deck's signature. Single
// weight. Scoped to /ehsa via anton.className on the display headings only.
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

// EHSA brand palette (deck + reference_ehsa_2027_canva_visual_system memory).
const YELLOW = "#f5c518";
const INK = "#0c0c0c";
const CREAM = "#faf8ef";

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
    title: `EHSA 2027 press hub — ${SITE_NAME}`,
    description: t.heroLede,
    alternates: {
      canonical: CANONICAL,
      languages: { en: CANONICAL, de: `${CANONICAL}?lang=de` },
    },
    openGraph: {
      type: "website",
      title: "European Hot Sauce Awards 2027 — press hub",
      description: t.heroLede,
      siteName: SITE_NAME,
      url: lang === "de" ? `${CANONICAL}?lang=de` : CANONICAL,
    },
  };
}

// PRESS HUB, not the event's own page. Modelled as a CollectionPage whose
// `about` is the award Event, with url pointing back at this hub. Venue and
// exact dates are deliberately omitted: Berlin is confirmed, the venue is TBD
// (Kalle Halle closed), so we do not assert a place/date we cannot stand behind.
const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "European Hot Sauce Awards 2027 press hub",
  url: CANONICAL,
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  about: {
    "@type": "Event",
    name: "European Hot Sauce Awards 2027",
    url: CANONICAL,
    location: {
      "@type": "Place",
      name: "Berlin (venue to be announced)",
      address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
    },
    organizer: { "@type": "Organization", name: "European Heat Council", url: SITE_URL },
  },
};

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3
        className={`${anton.className} text-xl sm:text-2xl uppercase tracking-tight`}
        style={{ color: INK }}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: "#3a3a3a" }}>
        {text}
      </p>
    </div>
  );
}

export default async function EhsaPage({ searchParams }: { searchParams: SP }) {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  const otherLang = lang === "de" ? "en" : "de";
  const otherHref = otherLang === "de" ? "/ehsa?lang=de" : "/ehsa";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <TopBar />

      {/* Hero — deck title-slide look: black type + flame on brand yellow */}
      <section style={{ background: YELLOW, color: INK }}>
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="flex items-start justify-between gap-6">
            <span className="inline-flex">
              <Image
                src="/ehsa/ehsa-mark-black-transparent.png"
                alt="European Hot Sauce Awards"
                width={40}
                height={120}
                priority
                className="h-14 w-auto"
              />
            </span>
            <Link
              href={otherHref}
              className="mt-1 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-[#0c0c0c] hover:text-[#f5c518]"
              style={{ borderColor: INK }}
              aria-label={`Switch language to ${COPY[otherLang].langName}`}
            >
              {COPY[otherLang].langName}
            </Link>
          </div>

          <p className="mt-10 text-xs sm:text-sm font-bold uppercase tracking-[0.15em]">
            {t.heroEyebrow}
          </p>
          <h1
            className={`${anton.className} mt-4 text-6xl sm:text-8xl uppercase leading-[0.95] tracking-tight`}
          >
            EHSA 2027
          </h1>
          <span className="mt-5 block h-2 w-40" style={{ background: INK }} />

          <p className="mt-8 text-lg sm:text-xl font-semibold">{t.heroWhere}</p>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed">{t.heroLede}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#register"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5"
              style={{ background: INK, color: YELLOW }}
            >
              {t.btnRegister}
            </Link>
            <a
              href="mailto:press@republicofheat.com"
              className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#0c0c0c] hover:text-[#f5c518]"
              style={{ borderColor: INK }}
            >
              {t.btnContact}
            </a>
          </div>
        </div>
      </section>

      {/* The story — what European hot sauce actually is (journalist-facing) */}
      <section style={{ background: CREAM, color: INK }} className="border-b border-black/10">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#8a7a10" }}>
            {t.storyLabel}
          </p>
          <h2 className={`${anton.className} mt-3 text-3xl sm:text-5xl uppercase tracking-tight`}>
            {t.storyHeading}
          </h2>
          <span className="mt-4 block h-1.5 w-24" style={{ background: INK }} />
          <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed">{t.storyPara}</p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-black/15 pt-10">
            <Feature title={t.feat1Title} text={t.feat1Text} />
            <Feature title={t.feat2Title} text={t.feat2Text} />
            <Feature title={t.feat3Title} text={t.feat3Text} />
          </div>
        </div>
      </section>

      {/* Register interest — Neon-backed typeform, scoped campaign ehsa_2027 */}
      <section id="register" className="scroll-mt-24" style={{ background: INK, color: "#fff" }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                className={`${anton.className} text-3xl sm:text-5xl uppercase tracking-tight`}
                style={{ color: YELLOW }}
              >
                {t.registerHeading}
              </h2>
              <span className="mt-4 block h-1.5 w-24" style={{ background: YELLOW }} />
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/90">
                {t.registerIntro}
              </p>
              <p className="mt-4 text-xs text-white/55">{t.registerNote}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-[#0c0c0c] shadow-xl sm:p-8">
              <RegisterInterestForm lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* About + press contact */}
      <section style={{ background: CREAM, color: INK }}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#8a7a10" }}>
            {t.aboutHeading}
          </p>
          <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed">{t.aboutText}</p>

          <div className="mt-10 border-t border-black/15 pt-8 text-sm">
            <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#8a7a10" }}>
              {t.pressContact}
            </p>
            <p className="mt-2">{t.pressOffice}</p>
            <a
              href="mailto:press@republicofheat.com"
              className="mt-1 inline-block font-semibold underline decoration-black/30 hover:decoration-black"
            >
              {t.contactCta}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
