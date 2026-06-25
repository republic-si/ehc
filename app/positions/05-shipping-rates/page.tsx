import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";

const POSITION_NUMBER = "05";
const POSITION_TITLE = "Shipping rates for small producers";
const ISSUED_DATE = "2026-06-25";
const CANONICAL = `${SITE_URL}/positions/05-shipping-rates`;

export const metadata: Metadata = {
  title: `Position ${POSITION_NUMBER} — ${POSITION_TITLE} — European Heat Council`,
  description:
    "The Council's position on cross-border parcel delivery costs as a structural single-market barrier for small EU producers.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `Position ${POSITION_NUMBER}: ${POSITION_TITLE}`,
    description:
      "European Heat Council position on cross-border parcel pricing asymmetries that fall hardest on small EU food producers.",
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
      "Regulation (EU) 2018/644 of the European Parliament and of the Council of 18 April 2018 on cross-border parcel delivery services.",
    url: "https://eur-lex.europa.eu/eli/reg/2018/644/oj/eng",
  },
  {
    n: 2,
    text:
      "European Commission, Price comparison tool for parcel delivery in the EU (operated by the Commission as part of its monitoring of cross-border tariffs).",
    url: "https://single-market-economy.ec.europa.eu/sectors/postal-services/parcel-delivery-eu/find-best-price-your-eu-parcel-delivery_en",
  },
  {
    n: 3,
    text:
      "European Commission, Parcel delivery in the EU (Internal Market, Industry, Entrepreneurship and SMEs).",
    url: "https://single-market-economy.ec.europa.eu/sectors/postal-services/parcel-delivery-eu_en",
  },
  {
    n: 4,
    text:
      "European Commission, Assessment of cross-border single-piece parcel tariffs.",
    url: "https://single-market-economy.ec.europa.eu/sectors/postal-services/parcel-delivery-eu/assessment-cross-border-single-piece-parcel-tariffs_en",
  },
  {
    n: 5,
    text:
      "Bruegel, E-commerce in Europe: parcel delivery prices in a digital single market (policy brief).",
    url: "https://www.bruegel.org/policy-brief/e-commerce-europe-parcel-delivery-prices-digital-single-market",
  },
  {
    n: 6,
    text:
      "Bruegel, European e-commerce needs better visibility into cross-border delivery prices.",
    url: "https://www.bruegel.org/blog-post/european-e-commerce-needs-better-visibility-cross-border-delivery-prices",
  },
  {
    n: 7,
    text:
      "European Commission, Cheaper cross-border parcel delivery to boost e-commerce in the EU (Shaping Europe's Digital Future).",
    url: "https://digital-strategy.ec.europa.eu/en/news/cheaper-cross-border-parcel-delivery-boost-e-commerce-eu",
  },
  {
    n: 8,
    text:
      "E-Commerce in Europe: Parcel Delivery Prices in a Digital Single Market (Springer Nature, peer-reviewed analysis).",
    url: "https://link.springer.com/chapter/10.1007/978-3-319-46046-8_10",
  },
  {
    n: 9,
    text:
      "European Commission, Cross-Border Parcel Delivery Operations and its Cost Drivers (Commission study).",
    url: "https://ec.europa.eu/docsroom/documents/15943/attachments/1/translations/en/renditions/native",
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

export default function PositionFivePage() {
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
            The Council&rsquo;s position on cross-border parcel pricing as a
            structural single-market barrier that falls hardest on small EU
            food producers.
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
              The Council records three conditions affecting cross-border
              shipping for small EU producers. Each is supported by sources
              cited at the foot of this Position.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 1. Cross-border parcel pricing is recognised by EU law
              as a single-market barrier.
            </h3>
            <p className="text-foreground/85">
              Regulation (EU) 2018/644 was adopted explicitly to address the
              concern that the relatively high level of tariffs applicable to
              cross-border parcel delivery services, the lack of transparency,
              and the limited regulatory oversight of such services constituted
              an obstacle to the functioning of the internal market
              <Ref ns={[1]} />. The European Commission operates a public
              price comparison tool for cross-border parcel delivery within
              the EU, the existence of which is itself institutional
              recognition that price variance is a known barrier
              <Ref ns={[2]} />. The Commission&rsquo;s dedicated parcel
              delivery policy page identifies cross-border parcel costs as a
              priority area for ongoing intervention
              <Ref ns={[3]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 2. Small shippers face a structural cost asymmetry they
              cannot negotiate away.
            </h3>
            <p className="text-foreground/85">
              The European Commission&rsquo;s assessment of cross-border
              single-piece parcel tariffs records that the published prices
              charged in many Member States are higher than can be explained
              by known cost differences alone, and that small shippers appear
              to have few alternatives to the national postal operators and
              often pay the full published price
              <Ref ns={[4]} />. Independent analysis by Bruegel documents that
              small retail shippers consistently identify high cross-border
              parcel delivery prices as a serious barrier to conducting
              business in other EU Member States
              <Ref ns={[5]} />. A separate Bruegel review records that
              transparency tools, while useful, do not by themselves correct
              the underlying pricing asymmetry between large contracted
              shippers and small operators paying retail rates
              <Ref ns={[6]} />.
            </p>

            <h3 className="text-lg font-semibold text-ink mt-8">
              Finding 3. The cost barrier suppresses cross-border e-commerce
              for small producers, with measurable scale.
            </h3>
            <p className="text-foreground/85">
              The European Commission records that, of EU consumers who buy
              online, 44 per cent buy in their own country but only 15 per
              cent buy from another EU Member State, with high cross-border
              delivery costs among the most-cited obstacles
              <Ref ns={[7]} />. Peer-reviewed analysis confirms the persistence
              of this gap between domestic and cross-border e-commerce, and
              identifies parcel pricing structures as a material contributor
              <Ref ns={[8]} />. The Commission&rsquo;s own technical study of
              cross-border parcel delivery cost drivers documents that
              operators without in-house customs and routing capacity incur
              costs that scale unfavourably for small consignment volumes
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
                Cross-border parcel delivery cost asymmetry is a structural
                feature of the EU postal market, not a market signal. The EU
                has itself recognised this since 2018, and the trajectory of
                policy intervention since then has not closed the gap for
                small operators.
              </li>
              <li>
                Transparency tools, while necessary, are not sufficient.
                Publishing the price differential does not allow a small
                producer to negotiate it. Effective intervention requires
                instruments that materially alter the cost faced by small
                shippers, not only the visibility of it.
              </li>
              <li>
                The Council holds that small EU producers shipping a sauce
                from one Member State to another should not face per-parcel
                costs that exceed the unit margin of the product. Where they
                do, the Single Market is not yet functioning for that producer.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Part III. Commitments
            </h2>
            <p className="text-foreground/85">The Council will:</p>
            <ol className="list-decimal list-outside pl-6 space-y-4 text-foreground/85 marker:text-muted">
              <li>
                Maintain a watchlist of intra-EU parcel rates on the corridors
                most used by members, and publish summaries at regular
                intervals.
              </li>
              <li>
                Submit comment in EU consultations touching cross-border
                parcel delivery, postal services regulation, and SME
                e-commerce policy where the impact on small food producers is
                material.
              </li>
              <li>
                Where member volumes permit, explore aggregated shipping
                arrangements that bring small EU producers within reach of
                rates currently available only to large contracted shippers.
              </li>
            </ol>

            <h2 className="label text-ink mt-16 pb-2 border-b border-rule">
              Revision
            </h2>
            <p className="text-foreground/85">
              This Position will be reviewed annually, or sooner if Regulation
              (EU) 2018/644 is materially revised or if the Commission
              publishes a new assessment of cross-border parcel tariffs.
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
