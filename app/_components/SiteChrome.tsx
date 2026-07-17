import Link from "next/link";
import Image from "next/image";

const TOPBAR_LINKS = [
  { href: "/", label: "Home" },
  { href: "/releases", label: "Releases" },
  { href: "/benefits", label: "Benefits" },
  { href: "/positions", label: "Positions" },
  { href: "/contact", label: "Contact" },
] as const;

const HEADER_LINKS = [
  { href: "/releases", label: "Releases" },
  { href: "/producers", label: "Producers" },
  { href: "/coverage", label: "Coverage" },
  { href: "/benefits", label: "Benefits" },
  { href: "/positions", label: "Positions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function TopBar() {
  return (
    <div className="bg-ink text-white text-[12px]">
      <div className="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between">
        <span className="tracking-wide opacity-80">
          European Heat Council &middot; europeanheatcouncil.eu
        </span>
        <div className="hidden sm:flex gap-5 opacity-80">
          {TOPBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-rule bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/ehc-logo-wide.png"
            alt="European Heat Council"
            width={4000}
            height={557}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm">
          {HEADER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep text-white/80 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
        <p>
          &copy; MMXXVI European Heat Council &middot;{" "}
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
        </p>
        <p className="flex gap-4">
          <Link href="/chilifest" className="hover:text-accent">
            ChiliFest press
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Contact
          </Link>
        </p>
      </div>
    </footer>
  );
}
