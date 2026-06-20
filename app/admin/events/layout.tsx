import Link from "next/link";

export const metadata = {
  title: "Events Pipeline — EHC Admin",
  robots: { index: false, follow: false },
};

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-ink text-white text-[12px]">
        <div className="max-w-6xl mx-auto px-6 h-9 flex items-center justify-between">
          <span className="tracking-[0.18em] uppercase text-[10.5px] opacity-80 font-medium">
            European Heat Council · Admin
          </span>
          <div className="hidden sm:flex gap-5 opacity-80">
            <Link href="/admin/events" className="hover:opacity-100">
              Pipeline
            </Link>
            <Link href="/admin/events/deadlines" className="hover:opacity-100">
              Deadlines
            </Link>
            <Link href="/admin/events/table" className="hover:opacity-100">
              Table
            </Link>
            <Link href="/" className="hover:opacity-100">
              Site
            </Link>
          </div>
        </div>
      </div>
      <main className="bg-white min-h-[80vh]">{children}</main>
      <footer className="bg-ink-deep text-white/60 text-[11px]">
        <div className="max-w-6xl mx-auto px-6 py-5 tracking-[0.12em] uppercase">
          European Heat Council · Internal · Not crawled
        </div>
      </footer>
    </>
  );
}
