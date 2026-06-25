import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "10";
const POSITION_TITLE = "EUDR and traceability";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/10-eudr-traceability`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on the EU Deforestation Regulation (EU) 2023/1115, its scope, the December 2025 postponement, and the May 2026 simplifications for small operators.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on EUDR scope, small-operator simplifications, and the indirect reach of EUDR into small food producers using listed commodities as secondary inputs.",
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
      "Regulation (EU) 2023/1115 of the European Parliament and of the Council on the making available on the Union market and the export from the Union of certain commodities and products associated with deforestation and forest degradation.",
    url: "https://eur-lex.europa.eu/eli/reg/2023/1115/oj/eng",
  },
  {
    n: 2,
    text:
      "European Commission, Implementing the EU Deforestation Regulation (EUDR) — official implementation page.",
    url: "https://green-forum.ec.europa.eu/nature-and-biodiversity/deforestation-regulation-implementation_en",
  },
  {
    n: 3,
    text:
      "World Resources Institute, What Is the EU Deforestation Regulation (EUDR)? — independent explainer.",
    url: "https://www.wri.org/insights/explain-eu-deforestation-regulation",
  },
  {
    n: 4,
    text:
      "European Parliament, Deforestation law: Parliament adopts changes to postpone and simplify measures, press release 11 December 2025.",
    url: "https://www.europarl.europa.eu/news/en/press-room/20251211IPR32168/deforestation-law-parliament-adopts-changes-to-postpone-and-simplify-measures",
  },
  {
    n: 5,
    text:
      "Council of the European Union, EU deforestation law: Council and Parliament reach a deal on targeted revision, 4 December 2025.",
    url: "https://www.consilium.europa.eu/en/press/press-releases/2025/12/04/eu-deforestation-law-council-and-parliament-reach-a-deal-on-targeted-revision/",
  },
  {
    n: 6,
    text:
      "European Commission, Delay until December 2026 and other developments in the implementation of the EUDR Regulation (Access to Markets news).",
    url: "https://trade.ec.europa.eu/access-to-markets/en/news/delay-until-december-2026-and-other-developments-implementation-eudr-regulation",
  },
  {
    n: 7,
    text:
      "Annex I to Regulation (EU) 2023/1115 — list of CN codes determining product scope, grouped by the seven listed commodities (cattle, cocoa, coffee, oil palm, rubber, soya, wood).",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115",
  },
  {
    n: 8,
    text:
      "EU Verify, EUDR Product Scope: New Exemptions, Additions and Removals (independent compliance analysis of Annex I and proposed Delegated Acts).",
    url: "https://euverify.com/resource/eudr-product-scope/",
  },
  {
    n: 9,
    text:
      "Coolset, EUDR reporting guide for SMEs — independent SME compliance analysis of post-simplification obligations.",
    url: "https://www.coolset.com/academy/eudr-reporting-guide-for-smes",
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

export default function PositionTenPage() {
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
            The Council&rsquo;s position on the EU Deforestation Regulation,
            its current scope, and its indirect reach into small food
            producers who use listed commodities as secondary inputs.
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
              (EU) 2023/1115 applies to small EU food producers. Each is
              supported by sources cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. EUDR scope covers seven listed commodities and their
              derived products; chilli and other spices are not within
              current scope.
            </h3>
            <p className="text-foreground/85">
              Regulation (EU) 2023/1115 sets due-diligence obligations on the
              placing on the Union market of cattle, cocoa, coffee, oil palm,
              rubber, soya, and wood, together with their derived products as
              listed in Annex I by CN code
              <Ref ns={[1, 7]} />. The European Commission&rsquo;s
              implementation page confirms the seven-commodity scope and the
              CN-code-driven listing
              <Ref ns={[2]} />. Independent analysis of Annex I and the
              Commission&rsquo;s draft Delegated Acts confirms that chilli,
              capsicum, and other spices are not in current scope and are
              not in proposed additions as of June 2026
              <Ref ns={[8]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. EUDR application has been postponed by one year and
              substantially simplified for small operators.
            </h3>
            <p className="text-foreground/85">
              In December 2025 the European Parliament and Council agreed a
              targeted revision postponing EUDR application by one year and
              simplifying the obligations on small operators
              <Ref ns={[4, 5]} />. The principal compliance deadlines now
              fall on 30 December 2026 for large and medium operators and on
              30 June 2027 for natural persons and micro and small
              enterprises (defined as fewer than 50 employees and under EUR
              10 million annual turnover related to in-scope products)
              <Ref ns={[6]} />. Independent SME-focused compliance guidance
              records that, under the simplified regime, micro and small
              primary operators may submit a one-off simplified declaration
              and, in low-risk countries, may use postal codes in place of
              precise geolocation coordinates
              <Ref ns={[9]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. EUDR reaches small food producers indirectly through
              listed commodities used as secondary inputs.
            </h3>
            <p className="text-foreground/85">
              Although chilli and other spices are not in scope, several
              ingredient categories common in EHC-relevant production are in
              scope: cocoa (used in chocolate-chilli blends and confectionery
              hot products), coffee (used in coffee-chipotle and similar
              flavoured sauces), oil palm derivatives (used in some
              emulsifying and processing inputs), and soya (used in
              soya-based sauces and condiments)
              <Ref ns={[1, 7]} />. Independent SME compliance analysis
              records that a small producer placing a mixed-ingredient
              product on the EU market still requires due diligence
              statements covering each in-scope input, regardless of the
              producer&rsquo;s own size
              <Ref ns={[9]} />. The Commission&rsquo;s implementation page
              confirms that obligations attach to the placing on the market,
              not to the size of the producer doing so
              <Ref ns={[2]} />.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part II. Position
            </h2>
            <p className="text-foreground/85">
              On the basis of these Findings the Council holds that:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                The Council supports the environmental objectives of EUDR.
                Deforestation and forest degradation are global concerns and
                EU-side instruments addressing import-driven exposure are
                legitimate.
              </li>
              <li>
                The Council welcomes the December 2025 postponement and the
                associated simplifications for small operators. The
                Commission&rsquo;s recognition that the original compliance
                load was disproportionate for small producers is itself
                evidence that the burden was real.
              </li>
              <li>
                The Council notes that, while chilli is not directly in
                scope, small producers using cocoa, coffee, palm oil
                derivatives, or soya as secondary inputs continue to face
                EUDR due-diligence obligations on those inputs. Practical
                guidance from the Commission and Member States addressing
                mixed-ingredient products at small batch volumes would
                materially reduce uncertainty for producers in this
                position.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Track Commission Delegated Acts amending EUDR scope under
                Annex I, and publish summaries when changes materially affect
                inputs used by member producers.
              </li>
              <li>
                Submit comment in EU and Member State consultations on EUDR
                implementation, particularly where the practical reach of
                obligations on mixed-ingredient small-batch food production
                is being settled.
              </li>
              <li>
                Maintain a member-facing brief summarising EUDR obligations
                on the in-scope commodities most commonly used in EHC member
                products, updated when Commission guidance changes.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if EUDR
              compliance deadlines are amended, if Annex I is materially
              expanded to include spices or other ingredient categories used
              by members, or if the Commission publishes new SME-specific
              implementing guidance.
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
