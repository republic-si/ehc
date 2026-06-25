import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";

export const metadata: Metadata = {
  title: "Positions — European Heat Council",
  description:
    "Council statements on standards, product quality, provenance, and member commitments across the European hot sauce industry.",
  alternates: { canonical: `${SITE_URL}/positions` },
};

export default function PositionsPage() {
  return (
    <>
      <TopBar />
      <SiteHeader />

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <p className="label text-muted mb-4">Positions</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
            Where the Council stands.
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85">
            <p>
              Council Positions are the European Heat Council&rsquo;s published
              statements on industry standards: what we mean by &ldquo;independent
              producer,&rdquo; where we draw lines on product quality and
              provenance, and how member commitments are verified. Each
              Position is dated, issued under Council authority, and revised
              as evidence accumulates.
            </p>
            <p>
              Positions are not advocacy. They describe how the Council itself
              operates, what it asks of members, and what buyers, journalists,
              and other producers can take from a Council-issued claim. Every
              empirical claim in a Position is backed by independent sources
              cited at the foot of the document.
            </p>
          </div>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            Published Positions
          </h2>
          <ul className="mt-6 space-y-8">
            <li>
              <Link
                href="/positions/01-independent-producer"
                className="block group"
              >
                <p className="label text-muted">
                  Position 01 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Defending the independent producer
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  The conditions under which independent food producers in the
                  EU now operate, and the Council&rsquo;s response to them.
                  Three Findings on compliance burden, retail consolidation,
                  and Member State enforcement variation.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/02-safe-food-proportionate-rules"
                className="block group"
              >
                <p className="label text-muted">
                  Position 02 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Safe food, proportionate rules
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Proportionate, risk-based application of EU food safety
                  rules to independent producers. Three Findings on existing
                  flexibility provisions, Member State implementation variance,
                  and where food safety risk actually concentrates according
                  to public RASFF data.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/03-ingredient-quality-provenance"
                className="block group"
              >
                <p className="label text-muted">
                  Position 03 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Ingredient quality and provenance
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Adulteration risk, pesticide residue concentration in
                  imported origins, and the conditional narrowness of the EU
                  country-of-origin rule for primary ingredients. Three
                  Findings drawn from the DG SANTE coordinated control plan,
                  EFSA pesticide reports, and Regulation (EU) 2018/775.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/04-local-and-regional-supply-chains"
                className="block group"
              >
                <p className="label text-muted">
                  Position 04 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Championing local and regional supply chains
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  The Council&rsquo;s affirmative case for local and regional
                  sourcing. Three Findings on consumer demand for origin
                  information, the climate footprint of long-distance food
                  transport, and existing EU policy support for short food
                  supply chains. Introduces the three-tier Council recognition
                  framework: seed-to-sauce, EU-internal sourcing, and mixed
                  traceable.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/05-shipping-rates"
                className="block group"
              >
                <p className="label text-muted">
                  Position 05 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Shipping rates for small producers
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Cross-border parcel pricing as a structural single-market
                  barrier. Three Findings on Regulation (EU) 2018/644&rsquo;s
                  own framing of the problem, the cost asymmetry between large
                  contracted shippers and small operators, and the measurable
                  suppression of cross-border e-commerce that follows.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/06-energy-costs"
                className="block group"
              >
                <p className="label text-muted">
                  Position 06 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Energy costs in food SMEs
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Structurally elevated EU industrial energy prices, the food
                  sector&rsquo;s 17 per cent share of EU gross energy
                  consumption, and the Commission&rsquo;s repeated use of
                  temporary State aid frameworks as policy recognition that
                  the cost pressure is structural, not transient.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/07-packaging-ppwr"
                className="block group"
              >
                <p className="label text-muted">
                  Position 07 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Packaging compliance under PPWR
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Regulation (EU) 2025/40 — the Packaging and Packaging Waste
                  Regulation — applies from 12 August 2026. Three Findings on
                  the scale of the change, the absence of a general
                  micro-producer exemption, and the differential treatment of
                  glass packaging.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/08-novel-food-authorisation"
                className="block group"
              >
                <p className="label text-muted">
                  Position 08 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Novel food authorisation barriers
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Regulation (EU) 2015/2283 and the 31-month average
                  authorisation timeline. Three Findings on documented
                  evaluation duration, the procedural barrier for SMEs, and
                  the conditional 25-year evidence threshold of the
                  traditional-food pathway.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/09-geographical-indication-access"
                className="block group"
              >
                <p className="label text-muted">
                  Position 09 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Geographical indication access
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Regulation (EU) 2024/1143 and the practical access of small
                  producers to PDO, PGI, and TSG protection. Three Findings
                  on the two-phase procedure, registration cost (~EUR
                  8,000-12,000) and timeline (~28-34 months), and the
                  producer-group requirement.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/10-eudr-traceability"
                className="block group"
              >
                <p className="label text-muted">
                  Position 10 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  EUDR and traceability
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Regulation (EU) 2023/1115, the seven-commodity scope
                  (cattle, cocoa, coffee, oil palm, rubber, soya, wood), the
                  December 2025 postponement, and the indirect reach of EUDR
                  into small food producers using listed commodities as
                  secondary inputs.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/positions/11-chili-research-commentary"
                className="block group"
              >
                <p className="label text-muted">
                  Position 11 · Issued 2026-06-25
                </p>
                <p className="mt-2 text-xl font-semibold text-ink group-hover:text-accent">
                  Chilli research commentary
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground/85">
                  Methodological Position establishing the Council&rsquo;s
                  chilli, capsaicin, and Capsicum research commentary track.
                  Three Findings on research output growth, scope spanning
                  health and agronomy, and EFSA&rsquo;s role as canonical EU
                  primary source.
                </p>
              </Link>
            </li>
          </ul>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            Press and policy enquiries
          </h2>
          <div className="mt-6 text-base leading-relaxed text-foreground/85">
            <p>
              For questions about forthcoming Positions or to request comment on
              a Position once published, use the{" "}
              <Link
                href="/contact?topic=Press"
                className="text-ink underline underline-offset-2 hover:text-accent"
              >
                contact page
              </Link>
              .
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-rule flex justify-between text-sm">
            <Link href="/about" className="more-link">
              About the Council
            </Link>
            <Link href="/" className="more-link">
              Home
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
