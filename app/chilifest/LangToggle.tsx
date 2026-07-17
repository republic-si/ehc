import Link from "next/link";
import type { Lang } from "@/lib/chilifest/copy";

// EN | DE switch. `base` is the path without query (e.g. "/chilifest");
// EN drops the param, DE adds ?lang=de. Styled for a dark background.
export function LangToggle({
  base,
  current,
}: {
  base: string;
  current: Lang;
}) {
  const opts: { lang: Lang; label: string }[] = [
    { lang: "en", label: "EN" },
    { lang: "de", label: "DE" },
  ];
  return (
    <div className="inline-flex items-center gap-2 text-xs print:hidden">
      {opts.map((o, i) => (
        <span key={o.lang} className="inline-flex items-center gap-2">
          {i > 0 ? <span className="text-white/30">|</span> : null}
          <Link
            href={o.lang === "en" ? base : `${base}?lang=de`}
            className={
              o.lang === current
                ? "font-bold text-white"
                : "text-white/60 hover:text-white"
            }
          >
            {o.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
