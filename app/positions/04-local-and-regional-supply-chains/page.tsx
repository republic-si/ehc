import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "04";
const POSITION_TITLE = "Championing local and regional supply chains";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/04-local-and-regional-supply-chains`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's affirmative case for local and regional sourcing in EU food production, grounded in consumer demand, climate evidence, and existing EU policy direction.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position championing local and regional supply chains as a positive choice for consumers, climate, and producers.",
    siteName: SITE_NAME,
    url: CANONICAL,
  },
};

type Source = {
  n: number;
  text: string;
  url: string;
};

const SOURCES: Source[] = [
  {
    n: 1,
    text:
      "European Food Safety Authority, Eurobarometer 2025 on Food Safety, with 26,370 respondents across EU27 Member States and 5,655 in seven EU Candidate Countries.",
    url: "https://www.efsa.europa.eu/en/corporate-pubs/eurobarometer-survey-2025-food-safety-eu",
  },
  {
    n: 2,
    text:
      "European Parliament, EPRS Briefing — Food origin labelling: Developments and issues, PE 767.165, 2024.",
    url: "https://www.europarl.europa.eu/RegData/etudes/BRIE/2024/767165/EPRS_BRI(2024)767165_EN.pdf",
  },
  {
    n: 3,
    text:
      "European Commission, 2024 Consumer Conditions Survey (full data set).",
    url: "https://commission.europa.eu/publications/2024-consumer-conditions-survey-full-data-set_en",
  },
  {
    n: 4,
    text:
      "European Commission, Knowledge for Policy — Global food miles account for nearly 20 per cent of total food-systems emissions (citing Li et al., Nature Food, 2022).",
    url: "https://knowledge4policy.ec.europa.eu/publication/global-food-miles-account-nearly-20-total-food-systems-emissions-0_en",
  },
  {
    n: 5,
    text:
      "Joint Research Centre, European Commission, Short Food Supply Chains and Local Food Systems in the EU: A State of Play of their Socio-Economic Characteristics, JRC80420, 2013.",
    url: "https://publications.jrc.ec.europa.eu/repository/handle/JRC80420",
  },
  {
    n: 6,
    text:
      "Short Food Supply Chains in Europe: Scientific Research Directions, Sustainability (MDPI), peer-reviewed analysis of SFSC environmental and socio-economic outcomes.",
    url: "https://www.mdpi.com/2071-1050/14/6/3602",
  },
  {
    n: 7,
    text:
      "European Commission, EU CAP Network announcement — New European Network Launched to Boost Short Food Supply Chains.",
    url: "https://eu-cap-network.ec.europa.eu/news/new-european-network-launched-boost-short-food-supply-chains_en",
  },
  {
    n: 8,
    text:
      "European Parliament, EPRS Briefing — Short food supply chains and local food systems in the EU, PE 586.650, 2016.",
    url: "https://www.europarl.europa.eu/RegData/etudes/BRIE/2016/586650/EPRS_BRI(2016)586650_EN.pdf",
  },
  {
    n: 9,
    text:
      "European Commission, Farm to Fork Strategy — the EU policy framework for fair, healthy and environmentally-friendly food systems.",
    url: "https://food.ec.europa.eu/horizontal-topics/farm-fork-strategy_en",
  },
];

function Ref({ ns }: { ns: number[] }) {
  return (
    <sup className="text-[0.7em] text-accent ml-0.5">
      {ns.map((n, i) => (
        <span key={n}>
          <a href={`#src-${n}`} className="hover:underline">
            [{n}]
          </a>
          {i < ns.length - 1 ? "," : ""}
        </span>
      ))}
    </sup>
  );
}

export default function PositionFourPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    datePublished: `${ISSUED_DATE}T09:00:00+02:00`,
    dateModified: `${ISSUED_DATE}T09:00:00+02:00`,
    author: [{ "@type": "Organization", name: SITE_NAME, url: SITE_URL }],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <TopBar />

      <header className="bg-ink-deep text-white border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <Link
            href="/positions"
            className="label text-white/60 hover:text-white"
          >
            ← All positions
          </Link>
          <p className="label text-white/70 mt-8">
            European Heat Council · Position {POSITION_NUMBER}
          </p>
          <p className="mt-4 text-sm text-white/80 tracking-wide">
            Issued {ISSUED_DATE}
          </p>
          <p className="mt-2 text-xs text-white/55 tracking-wide">
            Under Council authority
          </p>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-white">
            {POSITION_TITLE}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            The Council&rsquo;s affirmative case for local and regional
            sourcing in EU food production, grounded in documented consumer
            demand, measurable climate evidence, and existing EU policy
            direction.
          </p>
        </div>
      </header>

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <section className="space-y-6 text-base leading-relaxed text-foreground/90">
            <h2 className="label text-ink mt-2 pb-2 border-b border-rule">
              Part I. Findings
            </h2>
            <p className="text-foreground/85">
              The Council records three conditions that together support the
              case for local and regional supply chains in EU food production.
              Each is supported by sources cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. EU consumers want to know where their food comes from,
              at scale.
            </h3>
            <p className="text-foreground/85">
              The European Food Safety Authority&rsquo;s 2025 Eurobarometer on
              Food Safety, surveying 26,370 respondents across the EU27 and a
              further 5,655 in seven candidate countries, records that on
              average 70 per cent of respondents consider the origin of food
              an important factor when buying it. In Slovenia, Luxembourg and
              Italy the figure rises to 66, 59 and 55 per cent respectively
              naming origin as the single most decisive purchase factor
              <Ref ns={[1]} />. The European Parliament&rsquo;s 2024 research
              briefing on food origin labelling records that approximately six
              in ten EU consumers want to know both the country in which a
              processed food&rsquo;s primary ingredient was farmed or
              harvested and the country in which the food itself was
              manufactured
              <Ref ns={[2]} />. The European Commission&rsquo;s 2024 Consumer
              Conditions Survey confirms the broader pattern of consumer
              interest in food information at point of purchase
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Long-distance transport of food generates a material
              share of food-system emissions, and short supply chains reduce
              it.
            </h3>
            <p className="text-foreground/85">
              The European Commission&rsquo;s Knowledge for Policy service
              records that, when the full upstream food supply chain is
              considered, global food miles account for approximately 19 per
              cent of total food-system emissions, with the transport of fruit
              and vegetables alone contributing 36 per cent of food-miles
              emissions, around twice the greenhouse gases released during
              their production
              <Ref ns={[4]} />. The Joint Research Centre&rsquo;s analysis of
              short food supply chains in the EU records that the geographical
              proximity typical of such chains allows for reduction in the
              environmental costs associated with food distribution, while
              also noting that logistics and shipment-size effects must be
              managed carefully
              <Ref ns={[5]} />. Peer-reviewed European analysis confirms that
              short food supply chains, properly designed, deliver measurable
              environmental and socio-economic benefits relative to
              long-distance commodity chains
              <Ref ns={[6]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. EU policy already recognises short supply chains and
              local food systems as positive instruments.
            </h3>
            <p className="text-foreground/85">
              The European Commission launched a dedicated EU CAP Network on
              short food supply chains, signalling institutional support for
              shorter chains as a deliberate policy direction within the
              Common Agricultural Policy framework
              <Ref ns={[7]} />. The European Parliament&rsquo;s research
              briefings, dating to 2016 and updated since, frame short food
              supply chains and local food systems as established categories
              of EU agricultural and rural policy with their own funding and
              regulatory infrastructure
              <Ref ns={[8]} />. The Farm to Fork Strategy, adopted as part of
              the European Green Deal, sets the broader policy frame within
              which shorter, traceable, lower-emission supply chains are a
              stated EU objective
              <Ref ns={[9]} />.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part II. Position
            </h2>
            <p className="text-foreground/85">
              On the basis of these Findings the Council holds that:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                The Council champions local and regional supply chains as a
                positive choice for consumers, climate, and producers. This is
                not a protectionist preference. It is an alignment with
                documented consumer demand, with measurable environmental
                benefit, and with the EU&rsquo;s own policy direction.
              </li>
              <li>
                Value retained within EU producer networks compounds. A
                purchase from a small EU-internal producer supports another
                small EU-internal supplier, which supports a region, which
                supports a Member State economy. Anonymous commodity sourcing
                breaks that chain at the first transaction.
              </li>
              <li>
                The Council recognises three tiers of EU-internal sourcing
                against which members and other producers may make verifiable
                claims:
                <ol className="list-[lower-alpha] list-outside pl-6 mt-3 space-y-2">
                  <li>
                    <strong>Seed-to-sauce.</strong> The producer grows the
                    chillies and makes the sauce. All primary ingredients
                    originate on the producer&rsquo;s own land or under their
                    direct cultivation.
                  </li>
                  <li>
                    <strong>EU-internal sourcing.</strong> All primary
                    ingredients are sourced from named EU producers, with
                    documented supplier relationships.
                  </li>
                  <li>
                    <strong>Mixed traceable.</strong> Non-EU ingredients are
                    permitted where the ingredient is not available at
                    meaningful scale within the EU, but all sourcing must be
                    traceable to a named producer.
                  </li>
                </ol>
              </li>
              <li>
                Where third-country ingredients are sourced, the Council holds
                that the standards regime applied to those ingredients
                should match what is required of EU producers under EU law.
                Asymmetry between domestic and import standards is not a
                trade preference; it is a consumer protection failure.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Publish and maintain the three-tier recognition framework
                above, with a transparent verification standard, against which
                members and other producers may make claims.
              </li>
              <li>
                Maintain a public directory of recognised producers, indicating
                each producer&rsquo;s sourcing tier, so that buyers,
                journalists, and consumers can verify claims at source.
              </li>
              <li>
                Submit comment in EU consultations on origin labelling, the
                Farm to Fork Strategy, the Common Agricultural Policy, and
                short food supply chain policy where the impact on small and
                independent producers is material.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if the Farm
              to Fork Strategy is materially revised, if the Common
              Agricultural Policy framework changes its treatment of short
              food supply chains, or if new EU origin-labelling rules are
              adopted.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Sources
            </h2>
            <ol className="space-y-3 text-sm text-foreground/80">
              {SOURCES.map((s) => (
                <li key={s.n} id={`src-${s.n}`} className="flex gap-3">
                  <span className="text-muted shrink-0 w-6">[{s.n}]</span>
                  <span>
                    {s.text}{" "}
                    <a
                      href={s.url}
                      className="text-ink underline underline-offset-2 hover:text-accent break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.url}
                    </a>
                  </span>
                </li>
              ))}
            </ol>

            <p className="text-sm text-muted mt-10 pt-6 border-t border-rule">
              Issued under Council authority. European Heat Council,{" "}
              {ISSUED_DATE}.
            </p>
          </section>

          <div className="mt-16 pt-8 border-t border-rule flex flex-col sm:flex-row gap-6 justify-between text-sm">
            <div>
              <p className="label text-muted">Press and policy enquiries</p>
              <Link
                href="/contact?topic=Press"
                className="mt-2 inline-block text-ink hover:text-accent"
              >
                Contact the Council
              </Link>
            </div>
            <Link href="/positions" className="more-link self-start">
              All positions
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
