import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";

export const metadata: Metadata = {
  title: "Membership benefits — European Heat Council",
  description:
    "Membership for independent European hot sauce producers. Directory listing, newswire coverage, reduced event coordination rates, and a roadmap of Council benefits in development.",
  alternates: { canonical: `${SITE_URL}/benefits` },
};

function Tick() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 mt-1 shrink-0 text-ink"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function Dot() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 mt-1 shrink-0 text-muted"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const available = [
  "Show up at more events for less. The Council books group stands at festivals and trade fairs, splits the cost across members and handles the on-site admin so you can focus on selling.",
  "Lower your unit costs on bottles, caps, labels and ingredients. The Council aggregates member orders to unlock pooled-volume pricing you couldn't reach alone.",
  "Skip the warehouse. Drop pallets at the Council's fulfilment hub and we handle storage, picking and dispatch, so you can scale production without building a logistics operation.",
  "Public and product liability cover at group rates. One Council-negotiated policy covers members, so you stop shopping the market every renewal.",
  "Ship orders cheaper and faster, including cross-border. Members consolidate volume into the Council's negotiated courier contracts.",
];

const roadmap = [
  "Pre-publication embargo access on Council releases.",
  "Voting rights on Council standards for provenance, blind tasting and organic claims.",
  "Discounted European Hot Sauce Awards entry fee.",
  "Translation support for press materials across DE, EN, FR, IT, ES and NL.",
  "Cross-border distribution introductions via Republic of Heat.",
  "Annual State of European Heat producer report.",
  "Speaking slots at Council convenings and trade events.",
  "Group buying and shared logistics across members.",
];

export default function BenefitsPage() {
  return (
    <>
      <TopBar />
      <SiteHeader />

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <p className="label text-muted mb-4">Membership</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
            Membership for European hot sauce producers.
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85">
            <p>
              The European Heat Council is a convening body for the
              continent&rsquo;s independent hot sauce industry. Membership
              connects producers to the Council&rsquo;s press, distribution and
              event infrastructure, run through its member organisations.
            </p>
            <p>
              Some benefits are live today, delivered through founding member
              Republic of Heat. Others are in development and ship as the
              Council grows. We list both honestly below.
            </p>
          </div>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            Who can join
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Independent hot sauce producers based in Europe, in active
              distribution or in pre-launch with verified small-batch
              production. No volume floor. Sole proprietors, partnerships and
              registered businesses all welcome.
            </p>
            <p>
              We currently do not accept membership from wholesalers,
              re-bottlers or producers whose primary line is imported and
              relabelled.
            </p>
          </div>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            What members get
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <section>
              <p className="label text-ink mb-4">Available now</p>
              <ul className="space-y-4 text-sm leading-relaxed text-foreground/85">
                {available.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <p className="label text-muted mb-4">Roadmap</p>
              <ul className="space-y-4 text-sm leading-relaxed text-foreground/75">
                {roadmap.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Dot />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-muted-soft leading-relaxed">
                Roadmap items are in development. Sequencing depends on member
                demand and Council capacity. We do not charge against benefits
                that are not yet live.
              </p>
            </section>
          </div>

          <h2 className="label text-ink mt-14 pb-2 border-b border-rule">
            How to apply
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Send a short introduction through the contact page. Include the
              producer name, country, the year you started bottling, and a link
              to where your sauces are currently sold. The Council reviews
              applications on a rolling basis.
            </p>
            <div className="pt-2">
              <Link
                href="/contact?topic=Membership"
                className="inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
              >
                Apply for membership
              </Link>
            </div>
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
