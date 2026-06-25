import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "02";
const POSITION_TITLE = "Safe food, proportionate rules";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/02-safe-food-proportionate-rules`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on the proportionate, risk-based application of EU food safety rules to independent producers, grounded in EU law and public RASFF data.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on proportionate application of EU food safety rules to small and independent food producers.",
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
      "Commission Notice 2022/C 355/01 on the implementation of food safety management systems covering Good Hygiene Practices and procedures based on the HACCP principles, including the facilitation/flexibility of the implementation in certain food businesses, OJ C 355, 16.9.2022.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52022XC0916(01)",
  },
  {
    n: 2,
    text:
      "European Food Safety Authority, simplified Food Safety Management System templates for small food businesses (butcher's shop, grocery, bakery, fishmonger, ice cream shop).",
    url: "https://www.efsa.europa.eu/en/press/news/170302",
  },
  {
    n: 3,
    text:
      "Regulation (EC) No 852/2004 of the European Parliament and of the Council of 29 April 2004 on the hygiene of foodstuffs; Regulation (EU) 2017/625 of the European Parliament and of the Council of 15 March 2017 on official controls.",
    url: "https://eur-lex.europa.eu/eli/reg/2004/852/oj",
  },
  {
    n: 4,
    text:
      "Italian adaptation to Regulation (EU) 2017/625 on food official controls: a case study, National Library of Medicine, PMC11616583.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11616583/",
  },
  {
    n: 5,
    text:
      "European Commission, Official Controls Regulation (EU) 2017/625: state of play.",
    url: "https://food.ec.europa.eu/document/download/c28ff8f7-373b-48ab-9ea1-29629a993723_en",
  },
  {
    n: 6,
    text:
      "European Court of Auditors, Special Report 23/2024: Food labelling in the EU, 20 November 2024.",
    url: "https://www.eca.europa.eu/ECAPublications/SR-2024-23/SR-2024-23_EN.pdf",
  },
  {
    n: 7,
    text:
      "Pigłowski, M., Food hazards on the European Union market: the data analysis of the Rapid Alert System for Food and Feed, Food Science & Nutrition (Wiley), 2020.",
    url: "https://onlinelibrary.wiley.com/doi/full/10.1002/fsn3.1448",
  },
  {
    n: 8,
    text:
      "Food contact materials recalls and international trade relations: an analysis of the nexus between RASFF notifications and product origin, Food Control (ScienceDirect), 2020.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0956713520304345",
  },
  {
    n: 9,
    text:
      "European Commission, RASFF Window (public portal of the Rapid Alert System for Food and Feed).",
    url: "https://webgate.ec.europa.eu/rasff-window/",
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

export default function PositionTwoPage() {
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
            The Council&rsquo;s position on the proportionate, risk-based
            application of EU food safety rules to independent producers,
            grounded in EU law and public RASFF data.
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
              The Council records three conditions relevant to the safe and
              proportionate application of EU food law. Each is supported by
              sources cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. EU law already provides for proportionate,
              flexibility-based application of food safety rules to small
              producers.
            </h3>
            <p className="text-foreground/85">
              Commission Notice 2022/C 355/01 sets out, in detail, how Good
              Hygiene Practices and HACCP-based procedures may be applied with
              flexibility in small food businesses, taking into account the
              nature of the activity and the size of the establishment, and
              expressly replaces the 2016 Notice in light of revised Codex
              Alimentarius principles and international standards
              <Ref ns={[1]} />. The European Food Safety Authority has produced
              simplified Food Safety Management System templates for five
              categories of small business, making the flexibility operational
              rather than theoretical
              <Ref ns={[2]} />. The legal basis sits in Regulation (EC) No
              852/2004 on the hygiene of foodstuffs and Regulation (EU)
              2017/625 on official controls, both of which expressly anticipate
              risk-proportionate application
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Member State implementation of the EU Official
              Controls Regulation varies materially.
            </h3>
            <p className="text-foreground/85">
              A peer-reviewed analysis of Italy&rsquo;s adaptation of
              Regulation (EU) 2017/625 under Legislative Decree No 27/2021
              documents distinctive features in dispute resolution and
              timeframes that other Member States have not adopted
              <Ref ns={[4]} />. The European Commission&rsquo;s own state-of-play
              document on implementation of Regulation 2017/625 records
              variation across Member States in the use of national control
              plans, the design of inspection regimes, and the integration of
              risk-proportionality
              <Ref ns={[5]} />. The European Court of Auditors&rsquo; 2024
              special report on food labelling in the EU documents enforcement
              divergence between Member States in how identical EU labelling
              and food-information rules are applied on the ground
              <Ref ns={[6]} />. The result is that two producers compliant with
              the same EU Regulation can face materially different inspection
              regimes depending on the Member State of operation.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. Food safety incidents concentrate in specific hazard
              categories and geographic origins distinct from European
              independent craft production.
            </h3>
            <p className="text-foreground/85">
              Peer-reviewed analysis of European Rapid Alert System for Food
              and Feed notifications shows the most frequent hazards are
              aflatoxins in nuts, fruits, vegetables, herbs and spices;
              pathogenic microorganisms in herbs and spices, meat, poultry and
              seafood; pesticide residues; and veterinary medicinal product
              residues and cadmium in seafood
              <Ref ns={[7]} />. The majority of RASFF alerts concern products
              originating outside the European Union, with Turkey, the United
              Arab Emirates and the United States the most frequent
              country-of-origin
              <Ref ns={[7]} />. Among RASFF notifications on food contact
              materials between 2007 and 2019, 74 per cent concerned products
              originating from China
              <Ref ns={[8]} />. The Commission&rsquo;s own RASFF Window portal
              makes the underlying geographic and category distribution publicly
              verifiable
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
                Food safety is non-negotiable. The Council does not advocate
                looser standards, lower limits, or reduced traceability
                obligations for any producer.
              </li>
              <li>
                EU law already provides for proportionate, risk-based
                application of food safety rules to small producers. Where
                Member State practice fails to use the available flexibility,
                the result is regulatory cost without proportional safety gain.
                The Council holds that this asymmetry is correctable within
                the existing legal framework.
              </li>
              <li>
                The Council holds that the application of food safety rules
                should reflect documented risk patterns rather than assumptions
                about producer scale. Public RASFF data shows the hazards,
                ingredient categories, and geographic origins that drive the
                bulk of EU food safety notifications. Proportionate enforcement
                reflects that distribution; uniform burden across producers of
                all sizes does not.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Publish a member guide summarising the flexibility provisions
                of Commission Notice 2022/C 355/01 and how to invoke them with
                national competent authorities.
              </li>
              <li>
                Submit comment in EU consultations on official controls, food
                hygiene, and HACCP implementation where the impact on small
                producers is material.
              </li>
              <li>
                Publish, on a regular cadence, a brief on where food safety
                risk is concentrated according to public RASFF data, so that
                members, regulators, and the press have access to the
                underlying distribution rather than to its summaries.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if Commission
              Notice 2022/C 355/01 is revised or if Regulation (EU) 2017/625
              is materially amended.
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
