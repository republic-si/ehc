import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "01";
const POSITION_TITLE = "Defending the independent producer";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/01-independent-producer`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's first Position records the conditions under which independent food producers in the EU now operate, and the Council's response to them.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on the compliance, commercial, and enforcement asymmetries facing independent EU food producers.",
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
      "European Commission, Commission Notice on the implementation of food safety management systems covering Good Hygiene Practices and procedures based on the HACCP principles, including the facilitation/flexibility of the implementation in certain food businesses, OJ C 278, 30.7.2016.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52016XC0730(01)",
  },
  {
    n: 2,
    text:
      "Landscape of policies, standards, approaches, and projects for EU food security: an overview, Discover Food (Springer Nature), 2025.",
    url: "https://link.springer.com/article/10.1007/s44187-025-00387-6",
  },
  {
    n: 3,
    text:
      "Food and Agriculture Organization of the United Nations, European Food Safety Control Systems: New Perspectives on a Harmonised Legal Basis.",
    url: "https://www.fao.org/4/y5871e/y5871e0l.htm",
  },
  {
    n: 4,
    text:
      "Directive (EU) 2019/633 of the European Parliament and of the Council of 17 April 2019 on unfair trading practices in business-to-business relationships in the agricultural and food supply chain.",
    url: "https://eur-lex.europa.eu/eli/dir/2019/633/oj",
  },
  {
    n: 5,
    text:
      "European Commission, Commission delivers report on the implementation of EU rules against unfair trading practices in the food supply chain, 23 April 2024.",
    url: "https://agriculture.ec.europa.eu/media/news/commission-delivers-report-implementation-eu-rules-against-unfair-trading-practices-food-supply-2024-04-23_en",
  },
  {
    n: 6,
    text:
      "Colen, L., Bouamra-Mechemache, Z., Daskalova, V., Nes, K., Retail alliances in the agricultural and food supply chain, EUR 30206 EN, European Commission, 2020, ISBN 978-92-76-18585-7, doi:10.2760/33720, JRC120271.",
    url: "https://publications.jrc.ec.europa.eu/repository/handle/JRC120271",
  },
  {
    n: 7,
    text:
      "Food Safety in the European Union: A Comparative Assessment Based on RASFF Notifications, Pesticide Residues, and Food Waste Indicators, National Library of Medicine, PMC12294240.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12294240/",
  },
  {
    n: 8,
    text:
      "European Economic and Social Committee, EESC urges tougher EU action to curb single market fragmentation.",
    url: "https://www.eesc.europa.eu/en/news-media/news/eesc-urges-tougher-eu-action-curb-single-market-fragmentation",
  },
  {
    n: 9,
    text:
      "European Commission, Single Market Enforcement Taskforce, Report 2024-2025, Section 2.1 (Territorial supply constraints).",
    url: "https://ec.europa.eu/internal_market/smet/_docs/2025/smet-report-2025_en.pdf",
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

export default function PositionOnePage() {
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
            The Council records the conditions under which independent food
            producers in the European Union now operate, and sets out the
            Council&rsquo;s response to them.
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
              The Council records three conditions under which independent food
              producers across the European Union now operate. Each is
              supported by sources cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. Compliance burden falls disproportionately on the
              smallest producers.
            </h3>
            <p className="text-foreground/85">
              EU food safety regulation applies a single standard to producers
              of all sizes, but documentation, training, and infrastructure
              costs scale poorly downward. The European Commission has itself
              acknowledged the asymmetry by publishing flexibility guidance
              specifically for small businesses on HACCP implementation
              <Ref ns={[1]} />. Peer-reviewed research finds that small-scale
              producers in economically weaker regions often lack the financial
              and technical resources to comply with evolving EU regulations
              <Ref ns={[2]} />. The Food and Agriculture Organization records
              the same pattern across European control systems
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Retail consolidation has produced buyer-power
              asymmetries small suppliers cannot meet on equal footing.
            </h3>
            <p className="text-foreground/85">
              The EU recognised the structural imbalance in 2019 by adopting
              Directive (EU) 2019/633 on unfair trading practices in the food
              supply chain, prohibiting a range of payment, listing, and
              unilateral-amendment practices that large buyers had imposed on
              small suppliers
              <Ref ns={[4]} />. The European Commission&rsquo;s 2024
              implementation report confirms that enforcement remains uneven
              across Member States and that several prohibited practices
              persist where suppliers and buyers nominally agree
              <Ref ns={[5]} />. The Joint Research Centre&rsquo;s 2020
              Science for Policy report on EU retail alliances records that
              food manufacturers report unilateral demands of payment,
              payments requested from suppliers without adequate counterparts,
              and fees whose value to the supplier is open to question,
              characterising these as mechanisms by which buyer power can be
              used to extract profit from suppliers rather than to deliver
              services they need
              <Ref ns={[6]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. Member State enforcement of identical EU regulations
              varies materially.
            </h3>
            <p className="text-foreground/85">
              Rapid Alert System for Food and Feed notification data shows wide
              variation across Member States: in 2022 Bulgaria recorded 212
              notifications and 1.5 per cent maximum residue limit
              non-compliance, while Estonia and Lithuania recorded under 20
              notifications and below 0.6 per cent non-compliance
              <Ref ns={[7]} />. The European Economic and Social Committee has
              formally called for tougher EU action to curb the resulting
              single-market fragmentation
              <Ref ns={[8]} />. The Commission&rsquo;s own Single Market
              Enforcement Taskforce records, in its 2024-2025 Report, that 18
              of the 25 Member States which responded to its fact-finding
              exercise on territorial supply constraints confirmed the
              existence of such practices on their territory, with the most
              prevalent types named as differentiation in packaging and
              labelling, refusal to supply, and unfair price differentiation
              between markets
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
                The conditions above are not the result of market preference.
                They reflect policy choices, enforcement asymmetries, and
                commercial structures that would, in each case, be reversible
                at modest cost to the bodies that set them.
              </li>
              <li>
                The Council does not oppose retail scale, consolidation, or
                harmonised regulation. It opposes the asymmetry: regulatory
                and commercial costs falling hardest on the producers least
                able to absorb them, while the bodies setting those costs
                treat the asymmetry as a market outcome.
              </li>
              <li>
                The Council uses &ldquo;independent producer&rdquo; to mean a
                hot sauce maker whose production is owned and directed by the
                people who make the sauce; with no controlling share held by a
                retail group, food conglomerate, or holding company with
                parallel grocery interests; with annual production below
                100,000 units per recipe; and with recipes not licensed in
                from a parent brand.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">
              Where independent producers face costs the Council judges to be
              asymmetric, the Council will:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Publish a dated Position citing the regulation, ruling, or
                commercial practice in question.
              </li>
              <li>
                Submit comment in EU consultations touching producer scale,
                distribution, or food labelling.
              </li>
              <li>
                Provide written briefings to journalists covering the sector,
                free of charge and without exclusivity terms.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if a material
              change in EU producer policy, retail concentration, or
              enforcement structure occurs.
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
