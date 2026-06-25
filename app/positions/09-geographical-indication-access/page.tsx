import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "09";
const POSITION_TITLE = "Geographical indication access";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/09-geographical-indication-access`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on access to EU geographical indication protection (PDO, PGI, TSG) for small producers under Regulation (EU) 2024/1143.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on PDO/PGI/TSG registration costs, timelines, and the producer-group requirement under the new EU GI regime.",
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
      "Regulation (EU) 2024/1143 of the European Parliament and of the Council on geographical indications for wine, spirit drinks and agricultural products, traditional specialities guaranteed and optional quality terms, entered into force 13 May 2024.",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1143/oj/eng",
  },
  {
    n: 2,
    text:
      "Council of the European Union, Council adopts law to strengthen protection for geographical indications for foods and drinks, press release 26 March 2024.",
    url: "https://www.consilium.europa.eu/en/press/press-releases/2024/03/26/council-adopts-law-to-strengthen-protection-for-geographical-indications-for-foods-and-drinks/",
  },
  {
    n: 3,
    text:
      "European Commission, Geographical indications and quality schemes explained (Agriculture and Rural Development Directorate-General).",
    url: "https://agriculture.ec.europa.eu/farming/geographical-indications-and-quality-schemes/geographical-indications-and-quality-schemes-explained_en",
  },
  {
    n: 4,
    text:
      "European Commission, Registration of the name of a GI product (procedural guidance).",
    url: "https://agriculture.ec.europa.eu/farming/geographical-indications-and-quality-schemes/registration-name-gi-product_en",
  },
  {
    n: 5,
    text:
      "Wallonie public service, Apply for recognition or certification as a European PDO, PGI or TSG quality label (Member State application guidance).",
    url: "https://www.wallonie.be/en/demarches/apply-recognition-or-certification-european-pdo-pgi-or-tsg-quality-label",
  },
  {
    n: 6,
    text:
      "Industry analysis of PDO and PGI certification cost and timeline data (PDO ~EUR 12,000 / ~34 months; PGI ~EUR 8,000 / ~28 months).",
    url: "https://bhooc.com/blogs/articles/pdo-and-pgi-certification-process-explained",
  },
  {
    n: 7,
    text:
      "Institut National de l'Origine et de la Qualité (INAO), Administrative simplification: FAQs on the new European GI regulation (Regulation (EU) 2024/1143) — guidance from a national competent authority on producer-group requirements.",
    url: "https://www.inao.gouv.fr/en/info-faq-rue-2024-1143",
  },
  {
    n: 8,
    text:
      "Bird & Bird, The reform on the protection of geographical indications in the EU (independent legal analysis).",
    url: "https://www.twobirds.com/-/media/new-website-content/insights/pdfs/bird-bird-alert_the-reform-on-the-protection-of-geographical-indications-in-the-eu.pdf",
  },
  {
    n: 9,
    text:
      "EUR-Lex, Geographical Indications and Designations of Origin (summary of EU legislation).",
    url: "https://eur-lex.europa.eu/EN/legal-content/summary/geographical-indications-and-designations-of-origin.html",
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

export default function PositionNinePage() {
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
            The Council&rsquo;s position on access to EU geographical
            indication protection (PDO, PGI, TSG) for small food producers
            under the new GI regime.
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
              (EU) 2024/1143 on geographical indications applies to small EU
              food producers. Each is supported by sources cited at the foot
              of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. The new EU GI regime consolidates and simplifies, but
              keeps registration as a two-phase national-then-Commission
              procedure.
            </h3>
            <p className="text-foreground/85">
              Regulation (EU) 2024/1143 entered into force on 13 May 2024 and
              merges previously separate GI rules for agricultural products,
              wine, and spirit drinks into a single legal framework with a
              simplified registration procedure
              <Ref ns={[1]} />. The Council of the European Union, in its
              March 2024 adoption press release, described the reform as
              strengthening protection and clarifying the rules without
              removing the underlying two-phase structure
              <Ref ns={[2]} />. Applications continue to be made first to the
              competent authority of the relevant Member State, which has up
              to twelve months to scrutinise, and only then forwarded to the
              Commission for final approval
              <Ref ns={[3, 4]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Registration costs and timelines remain substantial.
            </h3>
            <p className="text-foreground/85">
              Although the application to the Commission itself is free of
              charge, Member States may charge fees to cover the cost of
              their own scrutiny, and certification by recognised control
              bodies is a separate cost borne by producers
              <Ref ns={[5]} />. Industry analysis records average PDO
              certification cost at approximately EUR 12,000 with a
              certification time of approximately 34 months, and average PGI
              certification at approximately EUR 8,000 with a certification
              time of approximately 28 months
              <Ref ns={[6]} />. Independent legal analysis records that, even
              under the simplified regime, the practical timeline from
              initial application to operational GI use frequently runs to
              several years
              <Ref ns={[8]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. The producer-group requirement structurally excludes
              single small producers from GI protection except in narrow
              circumstances.
            </h3>
            <p className="text-foreground/85">
              Regulation (EU) 2024/1143 retains the requirement that
              applications for PDO or PGI registration be submitted by a
              producer group, defined as an association of producers of the
              same product
              <Ref ns={[1]} />. A single producer may submit an application
              only where they are demonstrably the only producer willing to
              do so within the relevant area
              <Ref ns={[7]} />. For traditional specialities guaranteed, a
              single producer may submit where they are the only producer of
              the product in question
              <Ref ns={[9]} />. The practical effect is that a single small
              producer whose product is regionally distinctive but who
              operates without a formed producer group cannot easily access
              GI protection, regardless of the product&rsquo;s genuine
              geographical link.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part II. Position
            </h2>
            <p className="text-foreground/85">
              On the basis of these Findings the Council holds that:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                The Council supports the principle of geographical indications
                as a recognition of genuine territorial and cultural identity
                in food. The Council does not advocate for the dilution of GI
                criteria or for a relaxation of the requirement that GI claims
                rest on real production link.
              </li>
              <li>
                The Council holds that the producer-group requirement, as
                currently designed, structurally excludes single small
                producers from GI protection in cases where their product is
                clearly geographically distinctive but no group has been or
                can practically be formed. The result is that genuine
                geographical identity goes unprotected because of an
                organisational threshold rather than a substantive one.
              </li>
              <li>
                The Council holds that the registration cost and timeline
                profile, while reduced under the new regime, remain
                disproportionate for small producers operating at single-digit
                or low-double-digit annual turnover figures. The
                Commission&rsquo;s administrative simplification work should
                continue, and Member State fee structures should reflect
                producer scale.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Track Commission implementing acts under Regulation (EU)
                2024/1143 and successor instruments (2025/26, 2025/27,
                2025/29) and publish summaries when materially affecting
                small producer access.
              </li>
              <li>
                Submit comment in EU and Member State consultations on GI
                procedural simplification, fee structure, and producer-group
                requirements where the impact on small producers is material.
              </li>
              <li>
                Where members hold or are pursuing GI status, document the
                practical procedural experience so that the Council&rsquo;s
                consultation submissions are grounded in producer-level
                evidence.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if
              Regulation (EU) 2024/1143 is materially amended, if the
              Commission publishes new implementing acts changing GI
              procedural costs, or if Member State fee structures are
              materially revised.
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
