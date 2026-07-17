import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import { RequestForm } from "./RequestForm";
import {
  IMAGES,
  GALLERY,
  PHOTO_CREDIT,
  PHOTO_USAGE,
  PRESS_KIT_URL,
  PRESS_EVENING,
} from "@/lib/chilifest/media";
import { MAKERS } from "@/lib/chilifest/makers";
import { getReleasesByCampaign } from "@/lib/releases";

// Single source of truth for the festival facts, per ~/BCF-press/BCF-MASTER.md.
// Berlin Chili Fest is organised by Neil Numb (chilifest.eu); the European Heat
// Council is press partner.
const FEST = {
  festival: "Berlin Chili Fest",
  edition: "Harvest Event",
  datesDisplay: "4–6 September 2026",
  startDate: "2026-09-04",
  endDate: "2026-09-06",
  hours: "Fri 6–10pm, Sat & Sun 12–10pm",
  venue: "Berliner Berg Brauerei",
  street: "Treptower Str. 39",
  postcode: "12059",
  city: "Berlin",
  country: "DE",
  district: "Neukölln",
  tickets: "€7 day / €12 weekend",
  organiserUrl: "https://chilifest.eu",
  ticketsUrl: "https://chilifest.eu/events/category/berlin/",
} as const;

const CANONICAL = `${SITE_URL}/chilifest`;
const OG_IMAGE = `${SITE_URL}/chilifest/og.jpg`;
const DESCRIPTION =
  "Press hub for Berlin Chili Fest, 4-6 September 2026 at Berliner Berg Brauerei: what, when and where, plus releases, downloadable images, samples and press-evening access.";

export const metadata: Metadata = {
  title: `Berlin Chili Fest — Press hub — ${SITE_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: "Berlin Chili Fest press hub",
    description: DESCRIPTION,
    siteName: SITE_NAME,
    url: CANONICAL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berlin Chili Fest press hub",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${FEST.festival} — ${FEST.edition}`,
  description: DESCRIPTION,
  startDate: FEST.startDate,
  endDate: FEST.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
  image: [OG_IMAGE],
  organizer: {
    "@type": "Organization",
    name: FEST.festival,
    url: FEST.organiserUrl,
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "7",
    highPrice: "12",
    priceCurrency: "EUR",
    url: FEST.ticketsUrl,
  },
};

const ACTIONS = [
  { href: "#releases", label: "Read the releases" },
  { href: "#media", label: "Download media" },
  { href: "/chilifest/makers", label: "Meet the makers", solid: true },
  { href: "#request", label: "Samples & press pass", solid: true },
];

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
    <div id={id} className="scroll-mt-8">
      <p className="label text-accent">{kicker}</p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
    </div>
  );
}

export default async function ChiliFestPage() {
  const releases = await getReleasesByCampaign("berlin-chili-fest");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <TopBar />
      <SiteHeader />

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
          <p className="label text-white/70">
            European Heat Council &middot; Press hub
          </p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-semibold leading-[1.04] tracking-tight">
            {FEST.festival} returns to Berlin.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/90">
            {FEST.datesDisplay} &middot; {FEST.venue}, {FEST.city}
          </p>
          <p className="mt-6 max-w-2xl text-white/85 leading-relaxed">
            Three days of hot sauce and chilli culture: 50+ artisan producers
            from across Europe, hundreds of sauces to taste, vegan street food,
            brewery beer, live entertainment, and Berlin&rsquo;s Best Homemade
            Hot Sauce Competition.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={
                  a.solid
                    ? "inline-flex items-center px-5 py-3 rounded-full bg-white text-ink text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
                    : "inline-flex items-center px-5 py-3 rounded-full border border-white/50 text-white text-sm font-medium tracking-wide hover:border-white transition-colors"
                }
              >
                {a.label}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-xs text-white/55">Photo: {PHOTO_CREDIT}</p>
        </div>
      </section>

      {/* What / when / where */}
      <section className="bg-white border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <p className="label text-muted">The festival</p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                {FEST.festival} is Berlin&rsquo;s festival of hot sauce and
                chilli culture, held at {FEST.venue} in {FEST.district}. It runs
                twice a year, each spring and autumn, gathering independent
                makers, growers and the public across a weekend of tasting,
                trade and competition.
              </p>
            </div>
            <dl className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 border-t md:border-t-0 md:border-l border-rule pt-6 md:pt-0 md:pl-10">
              <div>
                <dt className="label text-muted">When</dt>
                <dd className="mt-1 text-foreground/90">
                  {FEST.datesDisplay}
                  <br />
                  <span className="text-muted">{FEST.hours}</span>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Where</dt>
                <dd className="mt-1 text-foreground/90">
                  {FEST.venue}
                  <br />
                  <span className="text-muted">
                    {FEST.street}, {FEST.postcode} {FEST.city}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Tickets</dt>
                <dd className="mt-1 text-foreground/90">
                  {FEST.tickets}{" "}
                  <a
                    href={FEST.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-rule hover:text-accent"
                  >
                    via chilifest.eu
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Organiser</dt>
                <dd className="mt-1 text-foreground/90">
                  Neil Numb
                  <br />
                  <span className="text-muted">
                    Press handled by the European Heat Council
                  </span>
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

      {/* Action lanes */}
      <main className="bg-white">
        <div className="max-w-5xl mx-auto px-6 divide-y divide-rule">
          {/* The makers */}
          <section className="py-14">
            <LaneHeading kicker="01" title="The makers" id="makers" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/90">
              {MAKERS.length} independent makers bring their sauces, oils and
              salsas to the Harvest edition. The story behind each bottle, how it
              tastes, and what to put it on, one maker a page.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {MAKERS.filter((m) => m.photo)
                .slice(0, 8)
                .map((m) => (
                  <div
                    key={m.id}
                    className="relative h-16 w-16 overflow-hidden rounded-full bg-paper-green/50"
                    title={m.name}
                  >
                    <Image
                      src={m.photo as string}
                      alt={m.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
            <Link
              href="/chilifest/makers"
              className="mt-8 inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
            >
              Meet all {MAKERS.length} makers
            </Link>
          </section>

          {/* Releases */}
          <section className="py-14">
            <LaneHeading kicker="02" title="Press releases" id="releases" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/90">
              Announcements from the European Heat Council on Berlin Chili Fest
              and Berlin&rsquo;s Best Homemade Hot Sauce Competition, with
              datelines and paste-ready quotes.
            </p>
            {releases.length > 0 ? (
              <ol className="mt-8 space-y-5 max-w-2xl">
                {releases.map((r) => (
                  <li key={r.slug} className="border-t border-rule pt-4">
                    <Link href={`/releases/${r.slug}`} className="group block">
                      <p className="label text-muted">
                        {r.displayDate ?? (r.isDraft ? "Forthcoming" : "")}
                      </p>
                      <p className="mt-1 text-lg text-ink group-hover:text-accent">
                        {r.headline}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-6 text-muted">
                Releases for Berlin Chili Fest are on the way.
              </p>
            )}
            <Link href="/releases" className="mt-6 inline-block more-link">
              All Council releases
            </Link>
          </section>

          {/* Media files */}
          <section className="py-14">
            <LaneHeading kicker="03" title="Media files" id="media" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/90">
              High-resolution photography from Berlin Chili Fest, ready to
              publish. {PHOTO_USAGE}
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
                  className="inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
                >
                  Download all images
                </a>
              ) : (
                <Link
                  href="/contact?topic=Press"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
                >
                  Request the full image pack
                </Link>
              )}
              <p className="text-xs text-muted-soft">
                Credit: {PHOTO_CREDIT}
              </p>
            </div>
          </section>

          {/* Request: samples and/or press preview */}
          <section className="py-14">
            <LaneHeading
              kicker="04"
              title="Request samples or a press pass"
              id="request"
            />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/90">
              Two things you can ask for, tick either or both. Samples: a curated
              Chili Fest sample pack, posted within the EU. Press preview:{" "}
              {PRESS_EVENING.blurb}
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
              <div>
                <dt className="label text-muted">Press preview</dt>
                <dd className="mt-1 text-foreground/90">
                  {PRESS_EVENING.confirmed
                    ? `${PRESS_EVENING.dateDisplay}${PRESS_EVENING.time ? `, ${PRESS_EVENING.time}` : ""}`
                    : PRESS_EVENING.dateDisplay}
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Where</dt>
                <dd className="mt-1 text-foreground/90">
                  {PRESS_EVENING.location}
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Places</dt>
                <dd className="mt-1 text-foreground/90">
                  {PRESS_EVENING.capacityNote}
                </dd>
              </div>
            </dl>
            <RequestForm />
          </section>

          {/* Boilerplate + contact */}
          <section className="py-14">
            <p className="label text-muted">About Berlin Chili Fest</p>
            <div className="mt-4 border border-rule bg-paper-green/30 p-6 max-w-3xl">
              <p className="text-sm leading-relaxed text-foreground/90">
                Established in 2020, Berlin Chili Fest has grown into one of
                Europe&rsquo;s premier hot sauce celebrations. The festival
                combines professional competitions with grassroots community
                spirit, proving that you don&rsquo;t need corporate backing to
                build something meaningful. It attracts thousands of attendees,
                partners with industry leaders like Clifton Chili Club, and
                maintains its commitment to supporting independent, artisan hot
                sauce makers.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-rule flex flex-col sm:flex-row gap-6 justify-between text-sm">
              <div>
                <p className="label text-muted">Press contact</p>
                <p className="mt-2 text-foreground/90">
                  European Heat Council press office
                </p>
                <Link
                  href="/contact?topic=Press"
                  className="mt-1 inline-block text-ink hover:text-accent"
                >
                  Contact the Council
                </Link>
              </div>
              <Link href="/chilifest/makers" className="more-link self-start">
                The makers
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
