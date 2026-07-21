import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import { PHOTO_CREDIT, IMAGES } from "@/lib/chilifest/media";
import { MAKERS, type Maker } from "@/lib/chilifest/makers";
import { MAKERS_DE } from "@/lib/chilifest/makers.de";
import { COPY, asLang, type Lang } from "@/lib/chilifest/copy";
import { MAKER_TEMPLATES } from "@/lib/chilifest/templates";
import { ChiliFestNav } from "../ChiliFestNav";

const SEGMENTS = [
  "Hot sauces",
  "Chilli oils & crisps",
  "Salsas, pastes & condiments",
] as const;
type Segment = (typeof SEGMENTS)[number];

// Product-type segmentation (from each maker's flagship + description), replacing
// the deprecated Flavour / Seed-to-Sauce / Hyperlocal tracks.
const SEGMENT_OF: Record<string, Segment> = {
  "queima-beicas": "Hot sauces",
  chillipeterson: "Hot sauces",
  "marie-sharp-s": "Hot sauces",
  "not-that-spicy": "Hot sauces",
  "roots-radicals": "Hot sauces",
  "dr-john-s-hot-sauce": "Hot sauces",
  "salsa-boy": "Hot sauces",
  "julies-chili": "Hot sauces",
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

type SP = Promise<{ lang?: string }>;

function segLabel(seg: Segment, t: (typeof COPY)["en"]): string {
  if (seg === "Hot sauces") return t.segHotSauces;
  if (seg === "Chilli oils & crisps") return t.segOilsCrisps;
  return t.segSalsas;
}

function storyOf(m: Maker, lang: Lang): string {
  return lang === "de" ? (MAKERS_DE[m.id]?.story ?? m.story) : m.story;
}
function anglesOf(m: Maker, lang: Lang): string[] {
  return lang === "de" ? (MAKERS_DE[m.id]?.angles ?? m.angles) : m.angles;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  return {
    title: `${t.makersTitle} — Berlin Chili Fest — ${SITE_NAME}`,
    description: t.makersIntro,
    alternates: {
      canonical: CANONICAL,
      languages: { en: CANONICAL, de: `${CANONICAL}?lang=de` },
    },
    openGraph: {
      type: "website",
      title: `${t.makersTitle} — Berlin Chili Fest`,
      description: t.makersIntro,
      siteName: SITE_NAME,
      url: lang === "de" ? `${CANONICAL}?lang=de` : CANONICAL,
      images: [OG_IMAGE],
    },
  };
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2h4a.5.5 0 0 1 .5.5v1.7c0 .35.13.62.35.85A4.3 4.3 0 0 1 16 11v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a4.3 4.3 0 0 1 1.15-2.95c.22-.23.35-.5.35-.85V2.5A.5.5 0 0 1 10 2Zm-1.4 10.8h6.8v1.2H8.6z"
      />
    </svg>
  );
}

function MakerCard({
  maker: m,
  lang,
  t,
}: {
  maker: Maker;
  lang: Lang;
  t: (typeof COPY)["en"];
}) {
  const angles = anglesOf(m, lang);
  const detailHref = `/chilifest/makers/${m.id}${lang === "de" ? "?lang=de" : ""}`;
  const sampleLabel = lang === "de" ? "Muster verfügbar" : "Sample available";
  const hasProfile = MAKER_TEMPLATES[m.id] !== undefined;
  return (
    <article
      id={m.id}
      className="border border-rule overflow-hidden scroll-mt-24 break-inside-avoid"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[34%_1fr]">
        <div className="relative aspect-square bg-paper-green/50">
          {m.photo ? (
            hasProfile ? (
              <Link href={detailHref} className="group block absolute inset-0">
                <Image
                  src={m.photo}
                  alt={`${m.name} at Berlin Chili Fest`}
                  fill
                  sizes="(min-width:640px) 34vw, 100vw"
                  className="object-cover transition-opacity group-hover:opacity-95"
                />
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[#3f7e2f] text-white text-[11px] font-bold px-3 py-1.5 shadow-sm">
                  <BottleIcon />
                  {sampleLabel}
                </span>
              </Link>
            ) : (
              <Image
                src={m.photo}
                alt={`${m.name} at Berlin Chili Fest`}
                fill
                sizes="(min-width:640px) 34vw, 100vw"
                className="object-cover"
              />
            )
          ) : hasProfile ? (
            <Link
              href={detailHref}
              className="group absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
              <span className="font-semibold text-ink/70 text-lg leading-tight group-hover:text-accent">
                {m.name}
              </span>
            </Link>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="font-semibold text-ink/70 text-lg leading-tight">
                {m.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="label text-muted">{m.location}</p>
          <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-ink leading-tight">
            {hasProfile ? (
              <Link href={detailHref} className="hover:text-accent transition-colors">
                {m.name}
              </Link>
            ) : (
              m.name
            )}
          </h3>
          {m.maker ? (
            <p className="mt-1 text-sm text-muted">{m.maker}</p>
          ) : null}
          {m.awards ? (
            <p className="mt-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.05em]"
                style={{ background: "#f4c518", color: "#1a1a1a" }}
              >
                <span aria-hidden>★</span> EHSA · {m.awards}
              </span>
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            {storyOf(m, lang)}
          </p>

          {m.flagship ? (
            <dl className="mt-4 text-sm">
              <dt className="label text-muted">{t.flagship}</dt>
              <dd className="mt-1 text-foreground/90">{m.flagship}</dd>
            </dl>
          ) : null}
          {hasProfile ? (
            <p className="mt-5">
              <Link
                href={detailHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                {lang === "de" ? "Vollständiges Produzentenprofil" : "Full producer profile"} →
              </Link>
            </p>
          ) : null}
        </div>
      </div>

      {angles.length > 0 ? (
        <div className="border-t border-rule p-6">
          <p className="label text-muted">{t.storyAngles}</p>
          <ul className="mt-3 space-y-2">
            {angles.map((a, i) => (
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

// Republic of Heat — festival partner. Not a maker card: a double-wide, dark
// band that gives the discovery subscription its own spot at the end.
function PartnerBlock({ t, lang }: { t: (typeof COPY)["en"]; lang: Lang }) {
  const profileHref =
    lang === "de"
      ? "/chilifest/makers/republic-of-heat?lang=de"
      : "/chilifest/makers/republic-of-heat";
  return (
    <section
      aria-label="Republic of Heat"
      className="border-t-2 border-accent bg-ink-deep text-white overflow-hidden"
    >
      <Link
        href={profileHref}
        className="group relative block w-full aspect-[16/10] sm:aspect-[21/9]"
      >
        <Image
          src={IMAGES.rohBox.src}
          alt={IMAGES.rohBox.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="p-8 sm:p-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label text-white/60">{t.partnerEyebrow}</p>
          <Link href={profileHref} className="mt-3 inline-block hover:opacity-90">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Republic of Heat
            </h2>
          </Link>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/85">
            {t.partnerLine}
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href={profileHref}
            className="inline-flex items-center gap-2 rounded bg-accent px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {lang === "de" ? "Profil ansehen" : "View profile"} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function MakersPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${t.makersTitle} — Berlin Chili Fest`,
    description: t.makersIntro,
    url: CANONICAL,
    numberOfItems: MAKERS.length,
    itemListElement: MAKERS.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${m.name}${m.maker ? ` — ${m.maker}` : ""}`,
    })),
  };

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
      <ChiliFestNav lang={lang} current="makers" langBase="/chilifest/makers" />

      <header className="bg-ink-deep text-white border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-20">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={lang === "de" ? "/chilifest?lang=de" : "/chilifest"}
              className="label text-white/60 hover:text-white print:hidden"
            >
              ← {t.backToHub}
            </Link>
          </div>
          <p className="label text-white/70 mt-8">{t.makersEyebrow}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight">
            {t.makersTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            {t.makersIntro}
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.05em]"
              style={{ background: "#f4c518", color: "#1a1a1a" }}
            >
              <span aria-hidden>★</span> EHSA
            </span>
            {t.ehsaLegend}
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
              {t.indexLabel(MAKERS.length)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
              {SEGMENTS.map((segment) => {
                const inSeg = MAKERS.filter((m) => SEGMENT_OF[m.id] === segment);
                if (inSeg.length === 0) return null;
                return (
                  <div key={segment}>
                    <p className="label text-accent mb-2">
                      {segLabel(segment, t)}
                    </p>
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
                    {segLabel(segment, t)}{" "}
                    <span className="text-muted-soft">· {inSeg.length}</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                  {inSeg.map((m) => (
                    <MakerCard key={m.id} maker={m} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            );
          })}

          <PartnerBlock t={t} lang={lang} />

          <div className="pt-8 border-t border-rule flex flex-col sm:flex-row justify-between gap-4 text-sm print:hidden">
            <Link
              href={lang === "de" ? "/chilifest?lang=de" : "/chilifest"}
              className="more-link"
            >
              {t.backToHub}
            </Link>
            <p className="text-xs text-muted-soft">
              {t.photos}: {PHOTO_CREDIT}
            </p>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
