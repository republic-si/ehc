import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "07";
const POSITION_TITLE = "Packaging compliance under PPWR";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/07-packaging-ppwr`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on the EU Packaging and Packaging Waste Regulation (EU) 2025/40 and its application to small food producers from 12 August 2026.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on PPWR compliance obligations as they fall on small EU food producers.",
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
      "Regulation (EU) 2025/40 of the European Parliament and of the Council on packaging and packaging waste (PPWR), adopted 19 December 2024, in force 11 February 2025, applicable from 12 August 2026.",
    url: "https://eur-lex.europa.eu/EN/legal-content/summary/packaging-and-packaging-waste-from-2026.html",
  },
  {
    n: 2,
    text:
      "European Commission, Packaging Waste Regulation (Environment Directorate-General policy page).",
    url: "https://environment.ec.europa.eu/topics/waste-and-recycling/packaging-waste/packaging-packaging-waste-regulation_en",
  },
  {
    n: 3,
    text:
      "European Commission, Packaging waste (Environment Directorate-General topic overview).",
    url: "https://environment.ec.europa.eu/topics/waste-and-recycling/packaging-waste_en",
  },
  {
    n: 4,
    text:
      "European Commission, Final PPWR Guidance published in advance of 12 August 2026 application date.",
    url: "https://www.packaginglaw.com/news/european-commission-publishes-final-ppwr-guidance-advance-august-2026-application-date",
  },
  {
    n: 5,
    text:
      "Latham & Watkins, European Packaging and Packaging Waste Regulation: Summary of Provisions and New Guidance (independent legal analysis).",
    url: "https://www.lw.com/en/insights/european-packaging-and-packaging-waste-regulation-summary-of-provisions-and-new-guidance",
  },
  {
    n: 6,
    text:
      "Gleiss Lutz, The new EU Packaging Regulation: Key requirements from August 2026 (independent legal analysis).",
    url: "https://www.gleisslutz.com/en/know-how/new-eu-packaging-regulation-key-requirements-august-2026",
  },
  {
    n: 7,
    text:
      "European Container Glass Federation (FEVE), The Packaging and Packaging Waste Regulation (PPWR): How glass can support the EU's circular economy ambition (industry technical position).",
    url: "https://feve.org/glass-industry-positions/circular-economy/packaging-packaging-waste-regulation-ppwr/",
  },
  {
    n: 8,
    text:
      "Fieldfisher, New EU packaging and packaging waste rules: 10 key things every global business should know (independent legal analysis).",
    url: "https://www.fieldfisher.com/en/insights/new-eu-packaging-and-packaging-waste-rules-10-key-things-every-global-business-should-know",
  },
  {
    n: 9,
    text:
      "Greenberg Traurig LLP, EU Packaging and Packaging Waste Regulation: New Compliance Requirements for E-Commerce.",
    url: "https://www.gtlaw.com/en/insights/2025/8/eu-packaging-and-packaging-waste-regulation-new-compliance-requirements-for-e-commerce",
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

export default function PositionSevenPage() {
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
            The Council&rsquo;s position on Regulation (EU) 2025/40 — the
            Packaging and Packaging Waste Regulation — as it applies to small
            food producers from 12 August 2026.
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
              The Council records three conditions affecting how the
              Packaging and Packaging Waste Regulation lands on small EU food
              producers. Each is supported by sources cited at the foot of
              this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. PPWR is the most significant change to EU packaging
              law in a generation, applicable from 12 August 2026.
            </h3>
            <p className="text-foreground/85">
              Regulation (EU) 2025/40 replaces Directive 94/62/EC and was
              adopted by the Council on 19 December 2024, entering into force
              on 11 February 2025 and applying from 12 August 2026 after an
              18-month transition period
              <Ref ns={[1]} />. The European Commission&rsquo;s Packaging
              Waste policy page describes the regulation as a comprehensive
              shift toward circular economy principles, with phased
              obligations on recyclability, recycled content, reuse, and
              labelling extending through to 2040
              <Ref ns={[2, 3]} />. The Commission published its final PPWR
              guidance in advance of the application date, signalling that
              the legal landscape is now stable enough for producers to begin
              concrete compliance work
              <Ref ns={[4]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. PPWR does not exempt small or micro producers from
              its core obligations.
            </h3>
            <p className="text-foreground/85">
              All companies placing packaging on the EU market must comply
              with the PPWR&rsquo;s core obligations, including reporting,
              design requirements, and registration, regardless of size
              <Ref ns={[5]} />. Micro-enterprises (under 10 employees or
              under EUR 2 million turnover) are subject to lighter rules
              under specific provisions but are not granted a general
              exemption from the regulation
              <Ref ns={[6]} />. Independent legal commentary records that
              SMEs in the food and beverage sector face the full weight of
              the recycled content, recyclability, and design obligations
              from the relevant phase-in dates
              <Ref ns={[8]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. Glass packaging, the dominant format for hot sauce,
              receives differential treatment under PPWR but is not exempt.
            </h3>
            <p className="text-foreground/85">
              Glass packaging is not subject to PPWR&rsquo;s minimum
              recycled-content thresholds for plastic, reflecting the
              different recycling chemistry of glass; however, glass
              packaging remains subject to PPWR&rsquo;s recyclability,
              reporting, design, and labelling obligations
              <Ref ns={[7]} />. The 40-per-cent empty-space rule applying to
              e-commerce parcels from 12 August 2026 affects glass-bottled
              products that are typically shipped with significant
              protective void volume
              <Ref ns={[9]} />. Independent legal analysis confirms that the
              regulation&rsquo;s practical effect on glass-using producers
              comes through design, labelling, reuse-system, and parcel-space
              obligations rather than through recycled-content thresholds
              <Ref ns={[5]} />.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part II. Position
            </h2>
            <p className="text-foreground/85">
              On the basis of these Findings the Council holds that:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                The Council supports the circular economy direction of PPWR.
                The Council does not advocate for delay, dilution, or
                weakening of the regulation&rsquo;s environmental
                objectives.
              </li>
              <li>
                The Council holds that PPWR&rsquo;s phased obligations land
                disproportionately on small food producers, who do not have
                packaging compliance teams and who source from packaging
                suppliers whose own redesign timelines they do not control.
                The lighter micro-enterprise provisions are a partial
                acknowledgement of this; they are not a full solution.
              </li>
              <li>
                The 40-per-cent empty-space rule applying to e-commerce
                parcels from 12 August 2026 is a particular concern for
                glass-bottled producers, whose protective void volumes
                exceed that threshold under most current packaging designs.
                The Council holds that operational guidance from the
                Commission and Member States should reflect the structural
                difference between glass and other packaging formats.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Publish and maintain a member-facing summary of PPWR
                obligations, phased by application date, with particular
                attention to the obligations affecting glass-bottled food
                producers.
              </li>
              <li>
                Submit comment in EU and Member State consultations on PPWR
                implementing acts, particularly where the operational
                interpretation of the empty-space rule, the digital labelling
                requirement, and the recyclability grading is being settled.
              </li>
              <li>
                Track Commission and Member State guidance on micro-enterprise
                exemptions, and publish updates when materially new guidance
                is issued.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if the
              Commission publishes new PPWR implementing acts, if the
              empty-space or digital labelling provisions are materially
              clarified, or if a successor instrument amends the
              micro-enterprise treatment.
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
