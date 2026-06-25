import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "06";
const POSITION_TITLE = "Energy costs in food SMEs";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/06-energy-costs`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on structurally elevated EU energy costs and their disproportionate impact on small food producers.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on EU industrial energy prices, the food sector's structural energy intensity, and policy support frameworks for small producers.",
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
      "European Commission, Energy prices and costs in Europe (data and analysis).",
    url: "https://energy.ec.europa.eu/data-and-analysis/energy-prices-and-costs-europe_en",
  },
  {
    n: 2,
    text:
      "European Central Bank, Fiscal policy measures in response to the energy and inflation shock and climate change, Economic Bulletin Issue 1/2024.",
    url: "https://www.ecb.europa.eu/press/economic-bulletin/focus/2024/html/ecb.ebbox202401_08~d136db2a83.en.html",
  },
  {
    n: 3,
    text:
      "OECD, SME policy responses to the 2022/2023 energy crisis.",
    url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2023/07/sme-policy-responses-to-the-2022-2023-energy-crisis_d961ed9a/80012fbd-en.pdf",
  },
  {
    n: 4,
    text:
      "Joint Research Centre, European Commission, Energy use in the EU food sector: State of play and opportunities for improvement, JRC96121.",
    url: "https://publications.jrc.ec.europa.eu/repository/handle/JRC96121",
  },
  {
    n: 5,
    text:
      "FoodDrinkEurope, Decarbonisation road map for the European food and drink manufacturing sector.",
    url: "https://www.fooddrinkeurope.eu/wp-content/uploads/2021/09/Decarbonising-the-European-food-and-drink-manufacturing-sector_v2.pdf",
  },
  {
    n: 6,
    text:
      "Joint Research Centre, European Commission, Annual Report on European SMEs 2024/2025, SME Performance Review, JRC142263.",
    url: "https://publications.jrc.ec.europa.eu/repository/handle/JRC142263",
  },
  {
    n: 7,
    text:
      "European Commission, Commission adopts temporary State aid framework to support sectors affected by Middle East crisis (METSAF), press release IP/26/894, 29 April 2026.",
    url: "https://ec.europa.eu/commission/presscorner/detail/en/ip_26_894",
  },
  {
    n: 8,
    text:
      "European Commission, Temporary Crisis and Transition Framework (Competition Policy / State Aid).",
    url: "https://competition-policy.ec.europa.eu/state-aid/legislation/temporary-crisis-and-transition-framework_en",
  },
  {
    n: 9,
    text:
      "Bruegel, The Iran energy shock is a test of European discipline on state aid (independent policy analysis).",
    url: "https://www.bruegel.org/first-glance/iran-energy-shock-test-european-discipline-state-aid",
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

export default function PositionSixPage() {
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
            The Council&rsquo;s position on structurally elevated EU energy
            costs, the food sector&rsquo;s energy intensity, and the policy
            support frameworks available to small producers.
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
              The Council records three conditions affecting energy costs for
              small EU food producers. Each is supported by sources cited at
              the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. EU industrial energy prices remain structurally
              elevated relative to international trading partners.
            </h3>
            <p className="text-foreground/85">
              The European Commission&rsquo;s own data analysis records that
              industrial gas and electricity prices in the EU, while lower
              than the 2022 peaks, remain two to four times higher than in
              the EU&rsquo;s main trading partners, with implications for
              long-term industrial competitiveness
              <Ref ns={[1]} />. The European Central Bank&rsquo;s Economic
              Bulletin documents the fiscal policy response to the energy and
              inflation shock and confirms that the elevated price level has
              persisted past the acute phase of the crisis
              <Ref ns={[2]} />. The OECD&rsquo;s analysis of SME policy
              responses to the 2022-2023 energy crisis records that small
              enterprises were among the most exposed economic players,
              lacking the margins, scale, and support staff to absorb the
              shock that larger competitors could mitigate
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Food and drink manufacturing is structurally
              energy-intensive and dominated by small and medium enterprises.
            </h3>
            <p className="text-foreground/85">
              The Joint Research Centre&rsquo;s study of energy use in the EU
              food sector records that food cultivation, processing, packaging
              and distribution accounts for approximately 17 per cent of the
              EU&rsquo;s gross energy consumption and 26 per cent of final
              energy consumption, with processing among the most
              energy-intensive stages of the chain
              <Ref ns={[4]} />. FoodDrinkEurope&rsquo;s decarbonisation road
              map confirms the energy intensity of the sector and the
              consequent exposure of producers of all sizes to energy price
              shocks
              <Ref ns={[5]} />. The Joint Research Centre&rsquo;s Annual
              Report on European SMEs records that small and medium
              enterprises constitute the dominant share of the European food
              manufacturing base by establishment count
              <Ref ns={[6]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. EU policy now explicitly recognises that food sector
              SMEs require targeted energy-cost support.
            </h3>
            <p className="text-foreground/85">
              On 29 April 2026 the European Commission adopted the Middle East
              crisis Temporary State Aid Framework, enabling Member States to
              compensate companies for up to 70 per cent of extra costs
              attributable to fuel and fertiliser price increases, with a
              simplified route providing fixed payments of up to EUR 50,000
              for small hauliers, farmers, and fishermen
              <Ref ns={[7]} />. The Temporary Crisis and Transition Framework
              that preceded it has been the principal vehicle through which
              the Commission has channelled energy-cost relief to SMEs since
              the 2022 crisis
              <Ref ns={[8]} />. Independent analysis by Bruegel records that
              the Commission&rsquo;s repeated use of temporary state aid
              frameworks since 2022 is itself evidence that energy cost
              pressure on EU enterprises, food sector included, is not a
              transient shock but a structural condition
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
                Energy cost pressure on EU food SMEs is now a structural
                feature of the European operating environment, not a
                temporary shock. Repeated extension of crisis frameworks is
                policy recognition of that fact.
              </li>
              <li>
                The Council welcomes the Middle East crisis Temporary State
                Aid Framework as a recognition that food sector enterprises
                merit targeted support, but notes that the framework expires
                on 31 December 2026 and is tied to a specific geopolitical
                cause. A permanent instrument is required if the underlying
                competitiveness gap is to close.
              </li>
              <li>
                The Council holds that energy-cost support eligibility
                thresholds historically excluded the smallest food producers,
                whose consumption levels fell below programme floors set with
                energy-intensive heavy industry in mind. Future instruments
                should be designed against the actual consumption profile of
                small food producers, not against thresholds inherited from
                other sectors.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Track the operational status of the Temporary State Aid
                framework and any successor instruments, and publish
                summaries when material changes occur.
              </li>
              <li>
                Submit comment in EU consultations on state aid for energy
                costs, SME competitiveness, and food sector decarbonisation
                where the impact on small producers is material.
              </li>
              <li>
                Where members consent, document the actual energy cost share
                of their production cost base, so that the Council&rsquo;s
                consultation submissions are grounded in member-level data
                rather than sector averages.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if the
              Temporary State Aid Framework is extended, replaced, or allowed
              to expire without a successor instrument, or if Commission data
              indicates a structural shift in EU industrial energy prices.
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
