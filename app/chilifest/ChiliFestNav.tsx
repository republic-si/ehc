import Link from "next/link";
import { COPY, type Lang } from "@/lib/chilifest/copy";

// Sticky mini-nav for the Berlin Chili Fest microsite. Present on the hub and
// the makers subpage; section links point at the hub's anchors so they work
// from either page.
export function ChiliFestNav({
  lang,
  current,
}: {
  lang: Lang;
  current: "home" | "makers";
}) {
  const t = COPY[lang];
  const q = lang === "de" ? "?lang=de" : "";
  const items: {
    key: string;
    label: string;
    href: string;
    brand?: boolean;
  }[] = [
    { key: "home", label: "Berlin Chili Fest", href: `/chilifest${q}`, brand: true },
    { key: "releases", label: t.navReleases, href: `/chilifest${q}#releases` },
    { key: "makers", label: t.navMakers, href: `/chilifest/makers${q}` },
    { key: "media", label: t.navMedia, href: `/chilifest${q}#media` },
    { key: "request", label: t.navRequest, href: `/chilifest${q}#request` },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rule">
      <div className="max-w-5xl mx-auto px-6">
        <ul className="flex items-center gap-5 sm:gap-7 h-12 overflow-x-auto text-sm whitespace-nowrap">
          {items.map((it) => {
            const active = it.key === current;
            const cls = it.brand
              ? "font-semibold text-ink hover:text-accent transition-colors"
              : active
                ? "text-accent font-medium"
                : "text-muted hover:text-accent transition-colors";
            return (
              <li key={it.key} className={it.brand ? "mr-auto" : ""}>
                <Link href={it.href} className={cls}>
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
