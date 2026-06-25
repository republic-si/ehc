import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "08";
const POSITION_TITLE = "Novel food authorisation barriers";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/08-novel-food-authorisation`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on EU novel food authorisation timelines and procedural burden as structural barriers for small producers.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on Regulation (EU) 2015/2283, average 31-month authorisation timelines, and the conditional traditional-food pathway.",
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
      "Regulation (EU) 2015/2283 of the European Parliament and of the Council of 25 November 2015 on novel foods, amending Regulation (EU) No 1169/2011 and repealing Regulation (EC) No 258/97.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R2283",
  },
  {
    n: 2,
    text:
      "European Food Safety Authority, Novel food application procedure (procedural guidance).",
    url: "https://www.efsa.europa.eu/en/applications/novel-food",
  },
  {
    n: 3,
    text:
      "European Commission, Novel food authorisations (Food Safety Directorate-General).",
    url: "https://food.ec.europa.eu/food-safety/novel-food/authorisations_en",
  },
  {
    n: 4,
    text:
      "The novel food evaluation process delays access to food innovation in the European Union, npj Science of Food (Nature Portfolio), 2025.",
    url: "https://www.nature.com/articles/s41538-025-00492-x",
  },
  {
    n: 5,
    text:
      "PMC mirror of the above peer-reviewed analysis, PMC12219162.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12219162/",
  },
  {
    n: 6,
    text:
      "Wageningen University and Research, The effect of the EU's novel food regulations on firm-level innovation outcomes.",
    url: "https://edepot.wur.nl/684557",
  },
  {
    n: 7,
    text:
      "Article 14 of Regulation (EU) 2015/2283 — notification of a traditional food from a third country (simplified procedure).",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R2283",
  },
  {
    n: 8,
    text:
      "European Commission, Novel food legislation (overview of authorisation pathways including traditional food from third countries).",
    url: "https://food.ec.europa.eu/food-safety/novel-food/legislation_en",
  },
  {
    n: 9,
    text:
      "FoodNavigator, EU to boost market access for novel foods (record of July 2025 Commission policy direction acknowledging timeline issues).",
    url: "https://www.foodnavigator.com/Article/2025/07/03/eu-novel-foods-to-be-boosted/",
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

export default function PositionEightPage() {
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
            The Council&rsquo;s position on the structural barriers EU novel
            food authorisation timelines place on small producers wishing to
            bring traditional and innovative ingredients to market.
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
              The Council records three conditions affecting how Regulation
              (EU) 2015/2283 on novel foods applies to small EU producers.
              Each is supported by sources cited at the foot of this
              Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. EU novel food authorisation takes, on average, more
              than two and a half years.
            </h3>
            <p className="text-foreground/85">
              Peer-reviewed analysis published in 2025 in npj Science of Food
              records that the average duration of a novel food application,
              from initial submission to publication of the EFSA scientific
              opinion, is 2.56 years (approximately 31 months), with a
              standard deviation of 1.19 years
              <Ref ns={[4, 5]} />. The validation phase alone averages ten
              months, with the scientific evaluation taking between six
              months and four and a half years depending on dossier quality
              and follow-up data requests
              <Ref ns={[4]} />. After the EFSA opinion is published, the
              Commission then takes up to a further seven months to present a
              draft authorising regulation for publication in the Official
              Journal
              <Ref ns={[2]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. The procedural design of the regulation creates a
              structural barrier for small producers and start-ups.
            </h3>
            <p className="text-foreground/85">
              Peer-reviewed analysis records that lengthy and inconsistent
              evaluation procedures discourage applicants, particularly small
              and medium-sized enterprises, from engaging with the regulatory
              process at all
              <Ref ns={[4]} />. The same analysis records that approximately
              47 per cent of total evaluation time is taken up by applicants
              responding to additional data requests from EFSA, with an
              average single-request response time of 130 days, a burden that
              scales unfavourably for producers without dedicated regulatory
              affairs capacity
              <Ref ns={[4]} />. The Wageningen University analysis of
              firm-level outcomes records a measurable effect of the novel
              food regime on innovation activity by smaller firms
              <Ref ns={[6]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. The simplified pathway for traditional foods from
              third countries is welcome but conditional on a 25-year
              evidence threshold.
            </h3>
            <p className="text-foreground/85">
              Article 14 of Regulation (EU) 2015/2283 provides a notification
              procedure for traditional foods from third countries, under
              which a traditional food may be placed on the EU market within
              approximately four months if no safety concerns are raised by
              any Member State or EFSA
              <Ref ns={[7]} />. The condition is that the applicant
              demonstrate the food has been used continuously for at least
              25 years in the customary diet of a significant number of
              people in at least one third country
              <Ref ns={[1, 8]} />. The European Commission acknowledged in
              July 2025 that overall novel food timelines remain a barrier to
              EU competitiveness and signalled an intent to boost market
              access
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
                Food safety in the assessment of novel foods is
                non-negotiable. The Council does not advocate for shortcuts,
                weakened safety thresholds, or reduced evidence requirements
                in the underlying scientific assessment.
              </li>
              <li>
                The Council holds that the procedural and time burden of
                novel food authorisation falls disproportionately on small
                producers, who cannot sustain market entry timelines
                averaging 31 months and who lack dedicated regulatory
                affairs capacity to respond efficiently to EFSA additional
                data requests. This is a procedural problem, not a science
                problem.
              </li>
              <li>
                The Council welcomes Article 14&rsquo;s simplified pathway
                for traditional foods from third countries and the
                Commission&rsquo;s July 2025 intent to broaden market access,
                while noting that the 25-year evidence threshold is a
                significant barrier for traditional ingredients with strong
                regional but undocumented historical use.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Track Commission and EFSA action on novel food authorisation
                timelines, particularly any procedural reform addressing the
                ADR response burden.
              </li>
              <li>
                Submit comment in consultations on novel food regulation
                where the impact on small producers and traditional
                ingredients is material.
              </li>
              <li>
                Where members consent, document the practical barriers
                encountered in attempting to bring a traditional or novel
                ingredient to the EU market, so that the Council&rsquo;s
                consultation submissions are grounded in producer-level
                evidence.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if
              Regulation (EU) 2015/2283 is materially amended, if the
              Commission publishes procedural reform of the novel food
              authorisation timeline, or if Article 14&rsquo;s traditional
              food threshold is revised.
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
