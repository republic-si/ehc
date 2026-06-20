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
              Position is dated, signed by a named Council voice, and revised
              as evidence accumulates.
            </p>
            <p>
              Positions are not advocacy. They describe how the Council itself
              operates, what it asks of members, and what buyers, journalists
              and other producers can take from a Council-issued claim.
            </p>
          </div>

          <div className="mt-14 bg-paper-green border border-rule p-6 sm:p-8">
            <p className="label text-ink mb-3">Status</p>
            <p className="text-base leading-relaxed text-foreground/85">
              The first Council Position is being drafted. It will publish here.
            </p>
          </div>

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
