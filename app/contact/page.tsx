import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — European Heat Council",
  description:
    "Send the European Heat Council a message about membership, press, event coordination or corrections.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

function FormFallback() {
  return (
    <div className="mt-10 h-96 border border-rule-soft bg-paper-green/40 animate-pulse" />
  );
}

export default function ContactPage() {
  return (
    <>
      <TopBar />
      <SiteHeader />

      <main className="bg-white">
        <article className="max-w-2xl mx-auto px-6 py-16">
          <p className="label text-muted mb-4">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
            Send the Council a message.
          </h1>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Use this form for membership applications, press queries, event
              coordination, corrections to a published release, or anything
              else. Pick the topic that fits closest and the Council will route
              your message internally.
            </p>
          </div>

          <Suspense fallback={<FormFallback />}>
            <ContactForm />
          </Suspense>

          <div className="mt-16 pt-8 border-t border-rule flex justify-between text-sm">
            <Link href="/benefits" className="more-link">
              Membership benefits
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
