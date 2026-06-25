import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "11";
const POSITION_TITLE = "Chilli research commentary";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/11-chili-research-commentary`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's methodological position on how it comments on peer-reviewed chilli, capsaicin, and Capsicum research as a separate ongoing track from its policy Positions.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council methodology for commenting on peer-reviewed chilli and capsaicin research.",
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
      "Capsaicin: A Two-Decade Systematic Review of Global Research Output and Recent Advances Against Human Cancer (peer-reviewed bibliometric and content analysis of 3,753 papers, recording approximately 18 per cent annual growth in capsaicin-related research output), PMC9326111.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9326111/",
  },
  {
    n: 2,
    text:
      "The effect of capsaicin, capsinoids, and pepper-based interventions on lipid profiles in overweight or obese individuals: a systematic review and meta-analysis of randomized controlled trials, Pharmacological Research (ScienceDirect), 2025.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0168822725004929",
  },
  {
    n: 3,
    text:
      "Capsaicin as a Microbiome Modulator: Metabolic Interactions and Implications for Host Health (peer-reviewed review), PMC12195293.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12195293/",
  },
  {
    n: 4,
    text:
      "Interdisciplinary insights into the cultural and chronological context of chilli pepper (Capsicum annuum var. annuum L.) domestication in Mexico, Proceedings of the National Academy of Sciences (PNAS), 2025.",
    url: "https://www.pnas.org/doi/10.1073/pnas.2413764121",
  },
  {
    n: 5,
    text:
      "Genome-Wide Association Analysis of Sweet Pepper (Capsicum annuum) Based on Agronomic Traits Using PepperSNP50K, peer-reviewed agronomic genetics study, PMC12114862.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12114862/",
  },
  {
    n: 6,
    text:
      "Comprehensive Morpho-Functional Profiling of Peruvian Andean Capsicum pubescens Germplasm Reveals Promising Accessions with High Agronomic and Nutraceutical Value, peer-reviewed germplasm evaluation study, PMC12845375.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12845375/",
  },
  {
    n: 7,
    text:
      "Emerging Non-Destructive Technologies for the Quality Evaluation of Chilies (Capsicum): A Review of Current Trends and Future Perspectives, Journal of Food Process Engineering (Wiley), 2026.",
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/jfpe.70450",
  },
  {
    n: 8,
    text:
      "European Food Safety Authority, Novel food topic page (operative EU regulatory framework within which capsaicin and Capsicum derivatives are assessed for food use).",
    url: "https://www.efsa.europa.eu/en/topics/topic/novel-food",
  },
  {
    n: 9,
    text:
      "European Food Safety Authority, EFSA Journal (Wiley) — open-access record of EU scientific opinions, the canonical primary source for EU food-safety findings touching capsaicin and Capsicum.",
    url: "https://efsa.onlinelibrary.wiley.com/journal/18314732",
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

export default function PositionElevenPage() {
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
            The Council&rsquo;s methodological position on how it engages
            with peer-reviewed chilli, capsaicin, and Capsicum research as a
            distinct ongoing track from its policy Positions.
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
              The Council records three conditions defining the research
              landscape on which this track operates. Each is supported by
              sources cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. Chilli and capsaicin research is an active and
              growing peer-reviewed field.
            </h3>
            <p className="text-foreground/85">
              A peer-reviewed two-decade bibliometric and content analysis of
              the global capsaicin literature records approximately 18 per
              cent annual growth in research output and assesses 3,753 papers
              over the period, with research articles dominant at 93 per
              cent
              <Ref ns={[1]} />. Recent peer-reviewed work continues at scale:
              a 2025 systematic review and meta-analysis examines randomised
              controlled trials of capsaicin&rsquo;s effect on lipid profiles
              in overweight and obese individuals
              <Ref ns={[2]} />, and a separate 2025 peer-reviewed review
              examines capsaicin as a microbiome modulator with metabolic
              implications for host health
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. The research spans health, agronomy and breeding,
              and production-quality methods, not health alone.
            </h3>
            <p className="text-foreground/85">
              A 2025 PNAS study integrates ethnobotanical, ecological and
              archaeological evidence on the cultural and chronological
              context of Capsicum annuum domestication in Mexico, providing
              base evidence for the species&rsquo; long human use
              <Ref ns={[4]} />. Genome-wide association analysis of sweet
              pepper using the PepperSNP50K platform documents agronomic
              traits for breeding programmes
              <Ref ns={[5]} />, while comprehensive morpho-functional
              profiling of Peruvian Andean Capsicum pubescens germplasm
              identifies accessions with both agronomic and nutraceutical
              value
              <Ref ns={[6]} />. A 2026 Journal of Food Process Engineering
              review surveys emerging non-destructive technologies for the
              quality evaluation of chillies
              <Ref ns={[7]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. EU regulatory frameworks engage with capsaicin and
              Capsicum derivatives through dedicated processes.
            </h3>
            <p className="text-foreground/85">
              The European Food Safety Authority maintains an operative novel
              food topic framework within which Capsicum derivatives, where
              proposed as new food substances, are assessed
              <Ref ns={[8]} />. The EFSA Journal serves as the open-access
              record of EU scientific opinions and is the canonical primary
              source for EU food-safety findings touching capsaicin and
              Capsicum
              <Ref ns={[9]} />. Together these frameworks mean that any
              substantive new finding on capsaicin&rsquo;s food-use status
              would surface first in EFSA primary documents, not in press
              coverage of academic studies.
            </p>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part II. Position
            </h2>
            <p className="text-foreground/85">
              On the basis of these Findings the Council holds that:
            </p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                The Council operates a chilli research commentary track that
                is distinct from its policy Positions. The track engages with
                peer-reviewed research at the level of method and finding,
                not at the level of marketing or health claim.
              </li>
              <li>
                Council commentary on research cites the original
                peer-reviewed source. Commentary on a study via a press
                release or a news article is not commentary on the study; it
                is commentary on the press representation of it. The Council
                does not conflate the two.
              </li>
              <li>
                The Council does not comment on preprints, conference
                abstracts, or research that has not been peer-reviewed. The
                Council does not interpret in-vivo or in-vitro mechanistic
                studies as evidence of human dietary effect, and does not
                interpret human dietary studies as evidence of disease
                treatment.
              </li>
              <li>
                Where research has direct relevance to member producers, the
                Council&rsquo;s commentary translates the finding into
                producer-relevant terms (cultivar selection, processing
                method, sourcing implication, quality evaluation) without
                overclaiming.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Publish brief commentary on notable peer-reviewed chilli,
                capsaicin, and Capsicum research where the finding is
                materially relevant to producers, consumers, or EU regulatory
                discussion.
              </li>
              <li>
                Cite the original peer-reviewed source in every commentary,
                with DOI or stable identifier, alongside the journal of
                publication. Press summaries may be referenced as context
                but never as the cited authority.
              </li>
              <li>
                Maintain a public archive of Council research commentary
                indexed by topic (health, agronomy, breeding, processing,
                quality evaluation), so that earlier commentary can be
                located and reviewed against any later finding.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if the
              Council&rsquo;s research commentary methodology requires a
              material change in scope or in the standards applied to the
              cited literature.
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
