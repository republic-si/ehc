import Link from "next/link";
import Image from "next/image";
import { COPY, type Lang } from "@/lib/chilifest/copy";
import { LangToggle } from "./LangToggle";

// Sticky mini-nav for the Berlin Chili Fest microsite. Present on the hub and
// the makers subpage; section links point at the hub's anchors so they work
// from either page. `langBase` is the current page's path (no query) so the
// EN|DE toggle keeps you where you are.
export function ChiliFestNav({
  lang,
  current,
  langBase = "/chilifest",
}: {
  lang: Lang;
  current: "home" | "makers";
  langBase?: string;
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
    <nav className="sticky top-0 z-40 bg-[#2f6b2e] text-white shadow-sm print:hidden">
      <div className="max-w-5xl mx-auto px-6">
        <ul className="flex items-center gap-5 sm:gap-7 h-14 overflow-x-auto text-sm whitespace-nowrap">
          {items.map((it) => {
            const active = it.key === current;
            if (it.brand) {
              return (
                <li key={it.key} className="mr-auto">
                  <Link
                    href={it.href}
                    className="flex items-center gap-2.5 font-semibold hover:opacity-90 transition-opacity"
                  >
                    <span className="inline-flex bg-white rounded-md p-1">
                      <Image
                        src="/chilifest/bcf-logo.png"
                        alt="Berlin Chili Fest"
                        width={26}
                        height={27}
                      />
                    </span>
                    <span>Berlin Chili Fest</span>
                  </Link>
                </li>
              );
            }
            const cls = active
              ? "font-semibold underline underline-offset-[10px] decoration-2 decoration-white"
              : "text-white/80 hover:text-white transition-colors";
            return (
              <li key={it.key}>
                <Link href={it.href} className={cls}>
                  {it.label}
                </Link>
              </li>
            );
          })}
          <li className="pl-1 border-l border-white/25 ml-1">
            <LangToggle base={langBase} current={lang} />
          </li>
        </ul>
      </div>
    </nav>
  );
}
