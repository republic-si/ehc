import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "03";
const POSITION_TITLE = "Ingredient quality and provenance";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/03-ingredient-quality-provenance`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on ingredient quality, traceable provenance, and the EU rules that should reflect both.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on adulteration risk, pesticide residue concentration, and country-of-origin labelling for primary ingredients.",
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
      "European Commission, DG SANTE, Results of an EU wide coordinated control plan to establish the prevalence of fraudulent practices in the marketing of herbs and spices, JRC126785, November 2021.",
    url: "https://food.ec.europa.eu/system/files/2021-11/food-fraud_action_herbs-spices_report_jrc126785_0.pdf",
  },
  {
    n: 2,
    text:
      "Joint Research Centre, European Commission, Results of the largest investigation into the authenticity of culinary herbs and spices on the European market, 25 November 2021.",
    url: "https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/results-largest-investigation-authenticity-culinary-herbs-and-spices-european-market-2021-11-25_en",
  },
  {
    n: 3,
    text:
      "Europol, Counterfeit and substandard food worth EUR 95 million seized in global operation (Operation OPSON XIV), 2025.",
    url: "https://www.europol.europa.eu/media-press/newsroom/news/counterfeit-and-substandard-food-worth-eur-95-million-seized-in-global-operation",
  },
  {
    n: 4,
    text:
      "European Food Safety Authority, The 2023 European Union report on pesticide residues in food, EFSA Journal, 2025.",
    url: "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2025.9398",
  },
  {
    n: 5,
    text:
      "European Food Safety Authority, The 2022 European Union report on pesticide residues in food, EFSA Journal, 2024.",
    url: "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2024.8753",
  },
  {
    n: 6,
    text:
      "European Commission, RASFF Window (public portal of the Rapid Alert System for Food and Feed).",
    url: "https://webgate.ec.europa.eu/rasff-window/",
  },
  {
    n: 7,
    text:
      "Commission Implementing Regulation (EU) 2018/775 of 28 May 2018 laying down rules for the application of Article 26(3) of Regulation (EU) No 1169/2011 on the provision of food information to consumers, as regards the rules for indicating the country of origin or place of provenance of the primary ingredient of a food.",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2018/775/oj/eng",
  },
  {
    n: 8,
    text:
      "European Commission, Commission Notice on the application of provisions of Article 26(3) of Regulation (EU) No 1169/2011, 30 January 2020 (citation to be locked from Official Journal).",
    url: "https://food.ec.europa.eu/food-safety/labelling-and-nutrition/food-information-consumers-legislation/origin-labelling_en",
  },
  {
    n: 9,
    text:
      "Food Safety Authority of Ireland, Country of origin labelling — primary ingredient interpretation guidance for food business operators.",
    url: "https://www.fsai.ie/business-advice/labelling/labelling-country-of-origin/country-of-origin-labelling-primary-ingredient",
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

export default function PositionThreePage() {
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
            The Council&rsquo;s position on adulteration risk, pesticide
            residue concentration, and the country-of-origin transparency
            consumers can expect from EU food labels.
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
              The Council records three conditions relevant to ingredient
              quality and provenance in the European food supply. Each is
              supported by sources cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. Adulteration of herbs and spices in EU supply chains
              is documented and persistent.
            </h3>
            <p className="text-foreground/85">
              The European Commission&rsquo;s EU-wide coordinated control plan
              on the authenticity of culinary herbs and spices, executed by
              the Joint Research Centre across 21 Member States plus
              Switzerland and Norway, examined 1,885 samples through nearly
              10,000 analyses and found measurable rates of suspected
              adulteration: 48 per cent for oregano, 17 per cent for pepper,
              14 per cent for cumin, 11 per cent for curcuma, 11 per cent for
              saffron, and 6 per cent for paprika or chilli
              <Ref ns={[1]} />. The Joint Research Centre records that herb
              and spice supply chains are among the most vulnerable to fraud
              of any food category examined
              <Ref ns={[2]} />. In its 2025 edition, the Europol-coordinated
              Operation OPSON XIV reported 631 individuals referred to
              judicial authorities, 11,566 tonnes of food and 1.4 million
              litres of beverages removed from the market, with a total value
              of EUR 95 million
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Pesticide residue non-compliance in herbs, spices,
              and chillies concentrates in specific non-EU origins.
            </h3>
            <p className="text-foreground/85">
              The European Food Safety Authority&rsquo;s 2023 EU report on
              pesticide residues in food records that, among samples exceeding
              the maximum residue limit for ethylene oxide, the majority of
              non-compliances were traced to a small number of non-EU
              countries of origin
              <Ref ns={[4]} />. The 2022 EFSA report documents that a single
              sample of paprika powder of unknown origin contained up to 43
              different pesticide residues, with a high frequency of multiple
              residues observed in cumin seed and paprika powder as a category
              <Ref ns={[5]} />. The European Commission&rsquo;s RASFF Window
              portal makes the year-on-year geographic and product-category
              distribution of safety notifications publicly verifiable
              <Ref ns={[6]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. EU rules on country-of-origin labelling for the
              primary ingredient of a food are conditional and narrow.
            </h3>
            <p className="text-foreground/85">
              Commission Implementing Regulation (EU) 2018/775 requires that
              the country of origin of the primary ingredient of a food be
              indicated only where the origin of the food itself is given on
              the label and is different from the origin of the primary
              ingredient
              <Ref ns={[7]} />. The European Commission&rsquo;s own
              interpretive Notice of January 2020 confirms that the obligation
              is triggered by the food&rsquo;s own origin claim, not by the
              primary ingredient&rsquo;s identity, and that where no origin is
              claimed for the food no obligation to disclose the primary
              ingredient&rsquo;s origin arises
              <Ref ns={[8]} />. The Food Safety Authority of Ireland&rsquo;s
              published guidance to food business operators sets out the same
              conditional triggering, confirming that national competent
              authorities read the rule the same way
              <Ref ns={[9]} />. The practical consequence is that a consumer
              buying a product whose principal named ingredient is, for
              example, chilli has no statutory guarantee that the country of
              origin of that chilli will appear anywhere on the label.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part II. Position
            </h2>
            <p className="text-foreground/85">
              On the basis of these Findings the Council holds that:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Ingredient quality and traceable provenance are food safety
                and consumer rights concerns, not luxury concerns. The
                Council&rsquo;s adulteration and contamination findings sit in
                the public record of EU bodies, not in marketing material.
              </li>
              <li>
                EU consumers should have access to the country of origin of
                the principal ingredients in their food, regardless of how the
                finished product is otherwise labelled. The current scope of
                Regulation (EU) 2018/775 leaves a transparency gap that does
                not serve the consumer.
              </li>
              <li>
                Producers committed to traceable, single-origin sourcing carry
                a structurally lower exposure to the adulteration and
                contamination patterns documented above. The Council holds
                that buyers, regulators, and the press should treat that
                commitment as material information about a producer, not as
                marketing.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Publish and maintain a Council standard for traceable
                single-origin ingredient sourcing, against which members may
                make verifiable claims.
              </li>
              <li>
                Submit comment in EU consultations on country-of-origin
                labelling, food fraud, and primary-ingredient declaration
                rules, advocating for narrower exceptions and broader baseline
                disclosure.
              </li>
              <li>
                Publish, on a regular cadence, a brief on EU food fraud
                findings affecting the spice, herb, and chilli supply chain,
                drawing on public DG SANTE, JRC, OPSON, and RASFF sources.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if Regulation
              (EU) 2018/775 is amended, if Regulation (EU) No 1169/2011 is
              materially revised, or if the JRC publishes a successor to its
              2021 herbs and spices coordinated control plan.
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
