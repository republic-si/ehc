import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";
import { RequestForm } from "./RequestForm";
import { ChiliFestNav } from "./ChiliFestNav";
import {
  IMAGES,
  GALLERY,
  PHOTO_CREDIT,
  PRESS_KIT_URL,
  LOGOS_URL,
  PRESS_EVENING,
} from "@/lib/chilifest/media";
import { MAKERS } from "@/lib/chilifest/makers";
import { COPY, asLang } from "@/lib/chilifest/copy";

// Language-neutral festival facts, per ~/BCF-press/BCF-MASTER.md.
const FEST = {
  festival: "Berlin Chili Fest",
  edition: "Harvest Event",
  datesDisplay: "4–6 September 2026",
  startDate: "2026-09-04",
  endDate: "2026-09-06",
  venue: "Berliner Berg Brauerei",
  street: "Treptower Str. 39",
  postcode: "12059",
  city: "Berlin",
  country: "DE",
  district: "Neukölln",
  organiserUrl: "https://chilifest.eu",
  ticketsUrl: "https://chilifest.eu/events/category/berlin/",
} as const;

const CANONICAL = `${SITE_URL}/chilifest`;
const OG_IMAGE = `${SITE_URL}/chilifest/og.jpg`;
// Habanero orange (--accent, #c8612e) — the EHC accent, used sparingly on the forest-green makers band below.
type SP = Promise<{ lang?: string }>;

// Three producers featured large in the makers band; every other maker sits in
// the thumbnail strip beneath. Images are the makers' own submissions (Drive /
// email). Hooks are a one-line native EN/DE, distinct from the longer profile
// story; the rest of each card (name, location, flagship, awards) comes from
// the shared MAKERS record so it stays in sync.
const HERO_MAKERS: {
  id: string;
  img: string;
  hook: { en: string; de: string };
}[] = [
  {
    id: "ti-dodo-epice",
    img: "/chilifest/makers/heroes/ti-dodo-vaanee.jpg",
    hook: {
      en: "A taste of Mauritius in the Netherlands — her tamarind compote began as leftovers from her mum's kitchen.",
      de: "Ein Stück Mauritius in den Niederlanden — ihre Tamarinden-Compote begann als Rest aus der Küche ihrer Mutter.",
    },
  },
  {
    id: "qudo-tjes",
    img: "/chilifest/makers/heroes/qudo-tjes.jpg",
    hook: {
      en: "A software developer who quit the screen to make hot sauce by hand — now with two 2026 Silvers.",
      de: "Ein Softwareentwickler, der den Bildschirm gegen handgemachte Hot Sauce tauschte — jetzt mit zwei Silber-Medaillen 2026.",
    },
  },
  {
    id: "teig-fullung",
    img: "/chilifest/makers/heroes/teig-fullung.jpg",
    hook: {
      en: "A Swabian chef staged across Taiwan and Hong Kong, then built his own crispy chili oil back home.",
      de: "Ein schwäbischer Koch lernte in Taiwan und Hongkong und baute daheim sein eigenes knuspriges Chiliöl.",
    },
  },
];
const HERO_IDS = new Set(HERO_MAKERS.map((h) => h.id));

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  const desc = t.heroLede;
  return {
    title: `Berlin Chili Fest — ${t.heroEyebrow.split("·")[1]?.trim() ?? "Press hub"} — ${SITE_NAME}`,
    description: desc,
    alternates: {
      canonical: CANONICAL,
      languages: { en: CANONICAL, de: `${CANONICAL}?lang=de` },
    },
    openGraph: {
      type: "website",
      title: "Berlin Chili Fest press hub",
      description: desc,
      siteName: SITE_NAME,
      url: lang === "de" ? `${CANONICAL}?lang=de` : CANONICAL,
      images: [OG_IMAGE],
    },
  };
}

// This is the PRESS HUB, not the event's own page. It must NOT emit a top-level
// Event node — that would compete with the real event site (chilifest.eu) for the
// "Berlin Chili Fest" event rich result. Instead we describe the page as a
// CollectionPage whose `about` references the event with url -> chilifest.eu, so
// crawl authority for the event flows OUT to the canonical event page.
const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Berlin Chili Fest press hub",
  url: CANONICAL,
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  about: {
    "@type": "Event",
    name: `${FEST.festival} — ${FEST.edition}`,
    startDate: FEST.startDate,
    endDate: FEST.endDate,
    // Canonical event page lives on the festival's own site, not here.
    url: FEST.organiserUrl,
    location: {
      "@type": "Place",
      name: FEST.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: FEST.street,
        postalCode: FEST.postcode,
        addressLocality: FEST.city,
        addressCountry: FEST.country,
      },
    },
  },
};

function DownloadIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12" />
    </svg>
  );
}

function LaneHeading({
  kicker,
  title,
  id,
}: {
  kicker: string;
  title: string;
  id: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <p className="label text-accent">{kicker}</p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
    </div>
  );
}

export default async function ChiliFestPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  const n = MAKERS.length;
  const makersHref = lang === "de" ? "/chilifest/makers?lang=de" : "/chilifest/makers";

  const actions = [
    { href: "#request", label: t.btnRequest, solid: true },
    { href: makersHref, label: t.btnMeet, solid: false },
    { href: "#releases", label: t.btnReleases, solid: false },
    { href: "#media", label: t.btnMedia, solid: false },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <TopBar />
      <ChiliFestNav lang={lang} current="home" langBase="/chilifest" />

      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Image
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink-deep/75" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32 text-white">
          <span className="inline-flex bg-white rounded-2xl p-2.5 shadow-lg mb-5">
            <Image
              src="/chilifest/bcf-logo.png"
              alt="Berlin Chili Fest"
              width={76}
              height={78}
              priority
            />
          </span>
          <p className="label text-white/70">{t.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-semibold leading-[1.04] tracking-tight">
            {t.heroHeadline}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/90">
            {FEST.datesDisplay} &middot; {FEST.venue}, {FEST.city}
          </p>
          <p className="mt-6 max-w-2xl text-white/85 leading-relaxed">
            {t.heroLede}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={
                  a.solid
                    ? "inline-flex items-center px-5 py-3 rounded-full bg-accent text-white text-sm font-semibold tracking-wide hover:bg-accent/90 transition-colors"
                    : "inline-flex items-center px-5 py-3 rounded-full border border-accent text-white text-sm font-semibold tracking-wide hover:bg-accent/25 transition-colors"
                }
              >
                {a.label}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-xs text-white/55">{t.photoCredit}</p>
        </div>
      </section>

      {/* Neil pull-quote — photo beside the founder's line on judging by heat alone */}
      <section className="bg-white border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-20">
          <div className="grid md:grid-cols-5 gap-8 sm:gap-12 items-center">
            <div className="md:col-span-2">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={IMAGES.neil.src}
                  alt={IMAGES.neil.alt}
                  fill
                  sizes="(min-width:768px) 40vw, 100vw"
                  className="object-cover grayscale"
                />
              </div>
            </div>
            <figure className="md:col-span-3">
              <span
                aria-hidden
                className="block text-6xl leading-none text-accent font-semibold"
              >
                &ldquo;
              </span>
              <blockquote className="-mt-4 text-2xl sm:text-3xl font-semibold leading-snug tracking-tight text-foreground">
                {t.quoteText}
              </blockquote>
              <figcaption className="mt-6">
                <span className="block font-semibold text-foreground">
                  {t.quoteAttrib}
                </span>
                <span className="block text-sm text-muted">{t.quoteRole}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Get your industry pass — full-bleed forest-green standout, lifted up
          directly under Neil's quote so the pass is the first call to action */}
      <section id="request" className="scroll-mt-24 bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {t.requestHeading}
              </h2>
              <span className="mt-4 block h-1 w-16 bg-accent" />
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/85">
                {t.requestIntro} {PRESS_EVENING.blurb[lang]}
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
                <div>
                  <dt className="label text-accent">{t.lblPressPreview}</dt>
                  <dd className="mt-1 text-white/90">
                    {PRESS_EVENING.dateDisplay[lang]}, {PRESS_EVENING.time[lang]}
                  </dd>
                </div>
                <div>
                  <dt className="label text-accent">{t.lblWhere}</dt>
                  <dd className="mt-1 text-white/90">
                    {PRESS_EVENING.location[lang]}
                  </dd>
                </div>
                <div>
                  <dt className="label text-accent">{t.lblPlaces}</dt>
                  <dd className="mt-1 text-white/90">
                    {PRESS_EVENING.capacityNote[lang]}
                  </dd>
                </div>
              </dl>
              <a
                href="/chilifest-industry-preview.ics"
                download
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {t.addToCalendar}
              </a>
            </div>
            <div className="rounded-2xl bg-white p-6 text-ink shadow-xl sm:p-8">
              <RequestForm lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* What / when / where */}
      <section className="bg-white border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <p className="label text-muted">{t.festivalLabel}</p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                {t.festivalPara}
              </p>
            </div>
            <dl className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 border-t md:border-t-0 md:border-l border-rule pt-6 md:pt-0 md:pl-10">
              <div>
                <dt className="label text-muted">{t.lblWhen}</dt>
                <dd className="mt-1 text-foreground/90">
                  {FEST.datesDisplay}
                  <br />
                  <span className="text-muted">{t.hoursValue}</span>
                  <br />
                  <span className="mt-1 block text-accent">
                    {t.pressPreviewWhen}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">{t.lblWhere}</dt>
                <dd className="mt-1 text-foreground/90">
                  {FEST.venue}
                  <br />
                  <span className="text-muted">
                    {FEST.street}, {FEST.postcode} {FEST.city}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">{t.lblTickets}</dt>
                <dd className="mt-1 text-foreground/90">
                  {t.ticketsValue}{" "}
                  <a
                    href={FEST.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-rule hover:text-accent"
                  >
                    {t.ticketsVia}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">{t.lblOrganiser}</dt>
                <dd className="mt-1 text-foreground/90">
                  Neil Numb
                  <br />
                  <span className="text-muted">{t.organiserSub}</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[IMAGES.crowd, IMAGES.character].map((img) => (
              <div
                key={img.src}
                className="relative aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width:768px) 40vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the producers — full-bleed forest-green standout with habanero-orange highlights */}
      <section id="makers" className="scroll-mt-24 bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <p className="label text-accent">01</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            {t.producersHeading}
          </h2>
          <span className="mt-4 block h-1 w-16 bg-accent" />
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/85">
            {t.producersIntro.replace("{n}", String(n))}
          </p>

          {/* Featured producers */}
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {HERO_MAKERS.map((h) => {
              const m = MAKERS.find((x) => x.id === h.id);
              if (!m) return null;
              const href =
                lang === "de"
                  ? `/chilifest/makers/${h.id}?lang=de`
                  : `/chilifest/makers/${h.id}`;
              return (
                <Link key={h.id} href={href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                    <Image
                      src={h.img}
                      alt={m.name}
                      fill
                      priority
                      sizes="(min-width:640px) 30vw, 90vw"
                      className="object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {m.awards ? (
                      <span
                        className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.05em]"
                        style={{ background: "#f4c518", color: "#1a1a1a" }}
                      >
                        <Image
                          src="/chilifest/ehsa-mark.png"
                          alt="EHSA"
                          width={5}
                          height={16}
                          className="h-4 w-auto"
                        />
                        EHSA · {m.awards}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
                  <p className="text-sm text-white/55">{m.location}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {h.hook[lang]}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent transition-all group-hover:gap-2">
                    {lang === "de" ? "Ihre Geschichte" : "Read their story"} →
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Everyone else — thumbnail strip into the full lineup */}
          <div className="mt-12 border-t border-white/15 pt-8">
            <p className="label mb-3 text-white/50">
              {lang === "de" ? "Und viele mehr" : "Plus many more"}
            </p>
            <div className="flex flex-wrap gap-2">
              {MAKERS.filter((m) => m.photo && !HERO_IDS.has(m.id)).map((m) => {
                const href =
                  lang === "de"
                    ? `/chilifest/makers/${m.id}?lang=de`
                    : `/chilifest/makers/${m.id}`;
                return (
                  <Link
                    key={m.id}
                    href={href}
                    title={m.name}
                    className="relative h-14 w-14 overflow-hidden rounded-md border border-white/15 transition-colors hover:border-accent"
                  >
                    <Image
                      src={m.photo as string}
                      alt={m.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <Link
            href={makersHref}
            className="mt-9 inline-flex items-center px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold tracking-wide hover:bg-accent/90 transition-colors"
          >
            {t.producersCta.replace("{n}", String(n))}
          </Link>
        </div>
      </section>

      {/* Action lanes */}
      <main className="bg-white">
        <div className="max-w-5xl mx-auto px-6 divide-y divide-rule">
          {/* Releases — downloadable list */}
          <section className="py-14">
            <LaneHeading kicker="02" title={t.releasesHeading} id="releases" />
            <ul className="mt-8 max-w-2xl border-y border-rule divide-y divide-rule">
              <li className="py-6">
                <p className="label text-accent">{t.releaseLabel}</p>
                <h3 className="mt-2 text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
                  {t.releaseTitle}
                </h3>
                <p className="mt-1 text-sm text-muted">{t.releaseDate}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/chilifest/releases/bcf-harvest-2026-flavour-en.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent transition-colors"
                  >
                    <DownloadIcon />
                    {t.dlEnglish}
                  </a>
                  <a
                    href="/chilifest/releases/bcf-harvest-2026-flavour-de.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent transition-colors"
                  >
                    <DownloadIcon />
                    {t.dlGerman}
                  </a>
                </div>
              </li>
            </ul>
            <Link href="/releases" className="mt-8 inline-block more-link">
              {t.allReleases}
            </Link>
          </section>

          {/* Media files */}
          <section className="py-14">
            <LaneHeading kicker="03" title={t.mediaHeading} id="media" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/90">
              {t.mediaIntro}
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GALLERY.map((img) => (
                <div
                  key={img.src}
                  className="relative aspect-[4/3] overflow-hidden bg-paper-green/40"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width:640px) 30vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {PRESS_KIT_URL ? (
                <a
                  href={PRESS_KIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
                >
                  {t.mediaCtaHave}
                </a>
              ) : (
                <Link
                  href="/contact?topic=Press"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
                >
                  {t.mediaCtaRequest}
                </Link>
              )}
              {LOGOS_URL ? (
                <a
                  href={LOGOS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-accent text-accent text-sm font-semibold tracking-wide hover:bg-accent hover:text-white transition-colors"
                >
                  {t.mediaCtaLogos}
                </a>
              ) : null}
              <p className="text-xs text-muted-soft">{t.creditLabel}</p>
            </div>
          </section>

          {/* Boilerplate + contact */}
          <section className="py-14">
            <p className="label text-muted">{t.aboutHeading}</p>
            <div className="mt-4 border border-rule bg-paper-green/30 p-6 max-w-3xl">
              <p className="text-sm leading-relaxed text-foreground/90">
                {t.aboutText}
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-rule flex flex-col sm:flex-row gap-6 justify-between text-sm">
              <div>
                <p className="label text-muted">{t.pressContact}</p>
                <p className="mt-2 text-foreground/90">{t.pressOffice}</p>
                <Link
                  href="/contact?topic=Press"
                  className="mt-1 inline-block text-ink hover:text-accent"
                >
                  {t.contactCta}
                </Link>
              </div>
              <Link href={makersHref} className="more-link self-start">
                {t.producersHeading}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
