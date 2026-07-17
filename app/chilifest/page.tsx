import Link from "next/link";
import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_RELEASE_IMAGE,
} from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import { RequestSamplesForm } from "./RequestSamplesForm";

// Single source of truth for the festival facts. Confirm the edition/date with
// Simon before launch; changing them here updates the hero, the body and the
// Event JSON-LD in one place. Berlin ChiliFest is an independent festival; the
// European Heat Council runs the competition that culminates there, so copy
// must not claim the Council organises the festival itself.
const FEST = {
  competition: "Amateur Hot Sauce Competition",
  festival: "Berlin ChiliFest",
  edition: "Harvest Edition",
  datesDisplay: "4–6 September 2026",
  startDate: "2026-09-04",
  endDate: "2026-09-06",
  venue: "Berliner Berg Brauerei",
  street: "Treptower Straße 39",
  postcode: "12059",
  city: "Berlin",
  country: "DE",
  festivalUrl: "https://www.berlinchilifest.com/",
} as const;

const CANONICAL = `${SITE_URL}/chilifest`;
const DESCRIPTION =
  "Press hub for the Amateur Hot Sauce Competition final at Berlin ChiliFest: festival details, the producer catalogue, and sample requests for journalists.";

export const metadata: Metadata = {
  title: `Berlin ChiliFest — Press hub — ${SITE_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: `Berlin ChiliFest press hub — ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    url: CANONICAL,
    images: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
  },
  twitter: {
    card: "summary_large_image",
    title: `Berlin ChiliFest press hub — ${SITE_NAME}`,
    description: DESCRIPTION,
    images: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${FEST.competition} final at ${FEST.festival}`,
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
  organizer: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  image: [`${SITE_URL}${DEFAULT_RELEASE_IMAGE}`],
  url: CANONICAL,
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
      {children}
    </h2>
  );
}

export default function ChiliFestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <TopBar />
      <SiteHeader />

      <header className="bg-ink-deep text-white border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <p className="label text-white/70">
            European Heat Council &middot; Press hub
          </p>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-white">
            {FEST.festival}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            The {FEST.competition} reaches its final at {FEST.festival}, the
            independent chilli festival in {FEST.city}. Everything a journalist
            needs in one place: what happens on the day, the producers and
            sauces on the table, and a route to request samples.
          </p>
          <p className="mt-6 text-sm text-white/80 tracking-wide">
            {FEST.edition} &middot; {FEST.datesDisplay} &middot; {FEST.venue},{" "}
            {FEST.city}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#samples"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-ink text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
            >
              Request samples
            </Link>
            <Link
              href="/chilifest/catalogue"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/50 text-white text-sm font-medium tracking-wide hover:border-white transition-colors"
            >
              View the sauce catalogue
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <div className="space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              This page is maintained by the European Heat Council for
              accredited press. It is open to read. Sample requests are
              reviewed individually before anything ships.
            </p>
          </div>

          <SectionHeading>The festival</SectionHeading>
          <div className="mt-6 space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              {FEST.festival} is an independent festival held at {FEST.venue} in{" "}
              {FEST.city}. The {FEST.edition} runs {FEST.datesDisplay}. It brings
              together makers, growers and the public across a weekend of tasting,
              trade and competition.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border-t border-rule pt-6">
              <div>
                <dt className="label text-muted">Dates</dt>
                <dd className="mt-1">{FEST.datesDisplay}</dd>
              </div>
              <div>
                <dt className="label text-muted">Venue</dt>
                <dd className="mt-1">
                  {FEST.venue}
                  <br />
                  {FEST.street}, {FEST.postcode} {FEST.city}
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Festival organiser</dt>
                <dd className="mt-1">
                  <a
                    href={FEST.festivalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-accent"
                  >
                    berlinchilifest.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Council role</dt>
                <dd className="mt-1">
                  Runs the {FEST.competition} and its producer roster.
                </dd>
              </div>
            </dl>
          </div>

          <SectionHeading>The {FEST.competition}</SectionHeading>
          <div className="mt-6 space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              The competition runs across regional qualifiers through the year.
              Winning makers carry through to the final at {FEST.festival}, where
              the standout sauce earns a production run and a place in the
              Council&rsquo;s catalogue. The sauces in contention are listed in
              the catalogue below.
            </p>
            <p>
              <Link href="/chilifest/catalogue" className="more-link">
                Browse the sauce catalogue
              </Link>
            </p>
          </div>

          <SectionHeading>The sauce catalogue</SectionHeading>
          <div className="mt-6 space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              A running record of the producers and sauces on the table at{" "}
              {FEST.festival}: who makes them, where they come from, and how they
              taste. Built for citation, indexed, and print friendly.
            </p>
            <div className="border border-rule bg-paper-green/40 p-6">
              <p className="label text-muted">Catalogue</p>
              <p className="mt-2 text-foreground/90">
                Producers and sauces, with origin, heat and tasting notes.
              </p>
              <Link
                href="/chilifest/catalogue"
                className="mt-4 inline-flex items-center px-5 py-2.5 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
              >
                Open the catalogue
              </Link>
            </div>
          </div>

          <SectionHeading>
            <span id="samples">Request samples</span>
          </SectionHeading>
          <div className="mt-6 space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              Working on a piece and want to taste before you write? Tell us who
              you are and where to send a curated {FEST.festival} sample pack.
              Requests go to the Council for review. We ship within the EU.
            </p>
          </div>
          <RequestSamplesForm />

          <div className="mt-16 pt-8 border-t border-rule flex flex-col sm:flex-row gap-6 justify-between text-sm">
            <div>
              <p className="label text-muted">Press contact</p>
              <Link
                href="/contact?topic=Press"
                className="mt-2 inline-block text-ink hover:text-accent"
              >
                Contact the Council
              </Link>
            </div>
            <Link href="/releases" className="more-link self-start">
              All releases
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
