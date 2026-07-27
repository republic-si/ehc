import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteFooter } from "@/app/_components/SiteChrome";
import { asLang, type Lang } from "@/lib/ehsa/copy";
import { WINNERS } from "@/lib/ehsa/winners";
import { getProfile, PROFILE_SLUGS, type ProfileT } from "@/lib/ehsa/winner-profiles";

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

const YELLOW = "#f5c518";
const INK = "#0c0c0c";
const CREAM = "#faf8ef";

type PP = Promise<{ slug: string }>;
type SP = Promise<{ lang?: string }>;

export function generateStaticParams() {
  return PROFILE_SLUGS.map((slug) => ({ slug }));
}

const L = (t: ProfileT, lang: Lang) => t[lang];

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PP;
  searchParams: SP;
}): Promise<Metadata> {
  const { slug } = await params;
  const lang = asLang((await searchParams).lang);
  const profile = getProfile(slug);
  const winner = WINNERS.find((w) => w.slug === slug);
  if (!profile || !winner) return { title: `EHSA 2026 winner — ${SITE_NAME}` };
  const canonical = `${SITE_URL}/ehsa/winners/${slug}`;
  const desc = L(profile.intro, lang);
  return {
    title: `${winner.brand} — ${winner.sauce} — EHSA 2026 — ${SITE_NAME}`,
    description: desc,
    alternates: {
      canonical,
      languages: { en: canonical, de: `${canonical}?lang=de` },
    },
    openGraph: {
      type: "article",
      title: `${winner.brand} — ${winner.sauce}`,
      description: desc,
      siteName: SITE_NAME,
      images: [winner.photo],
    },
  };
}

export default async function WinnerProfilePage({
  params,
  searchParams,
}: {
  params: PP;
  searchParams: SP;
}) {
  const { slug } = await params;
  const lang = asLang((await searchParams).lang);
  const profile = getProfile(slug);
  const winner = WINNERS.find((w) => w.slug === slug);
  if (!profile || !winner) notFound();

  const otherLang = lang === "de" ? "en" : "de";
  const base = `/ehsa/winners/${slug}`;
  const otherHref = otherLang === "de" ? `${base}?lang=de` : base;
  const winnersHref = lang === "de" ? "/ehsa?lang=de#winners" : "/ehsa#winners";
  const backLabel = lang === "de" ? "Zurück zu den Gewinnern 2026" : "Back to 2026 winners";
  const t = (en: string, de: string) => (lang === "de" ? de : en);

  return (
    <>
      <TopBar />

      {/* Hero */}
      <section style={{ background: YELLOW, color: INK }}>
        <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex items-center justify-between gap-6">
            <Link href={winnersHref} className="text-sm font-bold uppercase tracking-wide hover:underline">
              ← {backLabel}
            </Link>
            <Link
              href={otherHref}
              className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-[#0c0c0c] hover:text-[#f5c518]"
              style={{ borderColor: INK }}
            >
              {otherLang.toUpperCase()}
            </Link>
          </div>

          <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em]">
                {winner.category} · {L(profile.regionLong, lang)}
              </p>
              <h1 className={`${anton.className} mt-3 text-5xl sm:text-6xl uppercase leading-[0.95] tracking-tight`}>
                {winner.brand}
              </h1>
              <p className="mt-2 text-xl sm:text-2xl font-semibold">{winner.sauce}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide" style={{ background: INK, color: YELLOW }}>
                  Gold
                </span>
                {winner.bestInCategory ? (
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide" style={{ borderColor: INK }}>
                    {t("Best in Category", "Kategoriesieger")}
                  </span>
                ) : null}
              </div>
              <p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed">{L(profile.intro, lang)}</p>
            </div>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl bg-white">
              <Image src={winner.photo} alt={`${winner.brand} ${winner.sauce}`} fill priority sizes="(min-width:768px) 40vw, 90vw" className="object-contain p-4" />
            </div>
          </div>
        </div>
      </section>

      {/* The sauce */}
      <section style={{ background: CREAM, color: INK }} className="border-b border-black/10">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-18">
          <h2 className={`${anton.className} text-3xl sm:text-4xl uppercase tracking-tight`}>
            {t("The sauce", "Die Sauce")}
          </h2>
          <span className="mt-4 block h-1.5 w-20" style={{ background: INK }} />
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed">{L(profile.sauce, lang)}</p>
          <dl className="mt-10 grid grid-cols-1 gap-8 border-t border-black/15 pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-black/45">{t("Chili", "Chili")}</dt>
              <dd className="mt-2 text-sm leading-relaxed">{L(profile.peppers, lang)}</dd>
            </div>
            {profile.pairing ? (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-black/45">{t("Pairing", "Passt zu")}</dt>
                <dd className="mt-2 text-sm leading-relaxed">{L(profile.pairing, lang)}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-black/45">{t("Category", "Kategorie")}</dt>
              <dd className="mt-2 text-sm leading-relaxed">{winner.category} · Gold</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* The maker */}
      <section style={{ background: INK, color: "#fff" }}>
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-20">
          <h2 className={`${anton.className} text-3xl sm:text-4xl uppercase tracking-tight`} style={{ color: YELLOW }}>
            {t("The maker", "Der Macher")}
          </h2>
          <span className="mt-4 block h-1.5 w-20" style={{ background: YELLOW }} />
          <div className={`mt-8 grid gap-10 md:gap-12 ${profile.portrait ? "md:grid-cols-5" : ""}`}>
            {profile.portrait ? (
              <div className="md:col-span-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src={profile.portrait}
                    alt={profile.maker}
                    fill
                    sizes="(min-width:768px) 40vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: profile.portraitPos ?? "center" }}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold">{profile.maker}</p>
              </div>
            ) : null}
            <div className={profile.portrait ? "md:col-span-3" : "max-w-2xl"}>
              {!profile.portrait ? (
                <p className="mb-4 text-sm font-semibold text-white/60">{profile.maker}</p>
              ) : null}
              {profile.story[lang].map((para, i) => (
                <p
                  key={i}
                  className={`${i === 0 ? "" : "mt-4"} text-base sm:text-lg leading-relaxed text-white/90`}
                >
                  {para}
                </p>
              ))}
              {profile.quote ? (
                <figure className="mt-8 border-l-2 pl-5" style={{ borderColor: YELLOW }}>
                  <blockquote className="text-lg sm:text-xl font-semibold leading-snug">
                    {profile.quote.text}
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-white/60">
                    {profile.quote.attrib}
                  </figcaption>
                </figure>
              ) : null}
              {profile.find.length ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {profile.find.map((f) => (
                    <a
                      key={f.url}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-[#f5c518] hover:text-[#f5c518]"
                    >
                      {f.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-12 border-t border-white/15 pt-8">
            <Link href={winnersHref} className="text-sm font-bold uppercase tracking-wide text-white/80 hover:text-[#f5c518]">
              ← {backLabel}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
