import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TopBar, SiteHeader, SiteFooter } from "@/app/_components/SiteChrome";
import { PHOTO_CREDIT, IMAGES } from "@/lib/chilifest/media";
import { MAKERS, type Maker } from "@/lib/chilifest/makers";
import { MAKERS_DE } from "@/lib/chilifest/makers.de";
import { COPY, asLang, type Lang } from "@/lib/chilifest/copy";
import { MAKER_TEMPLATES, MAKER_IMAGES } from "@/lib/chilifest/templates";
import { ChiliFestNav } from "../../ChiliFestNav";

function BottleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 2h4v2.5l1 2.5v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-12l1-2.5V2z" />
      <path d="M9 12h6" />
    </svg>
  );
}

// Republic of Heat rendered as a producer profile (festival vendor + press partner).
const ROH_PROFILE: Maker = {
  id: "republic-of-heat",
  name: "Republic of Heat",
  legalName: "",
  maker: "",
  location: "Berlin, DE",
  track: "Flavour",
  flagship: "Curated European hot sauce sets",
  heat: "",
  awards: "",
  story:
    "Republic of Heat curates and ships Europe's best independent hot sauces from Berlin. At Berlin Chili Fest they showcase the European Hot Sauce Awards through three award sets, Europe's Best, Definitely Hot and the Reaper Collection, alongside their own creations including a Berlin BBQ Box built exclusively for the festival.",
  angles: [
    "Three sets from the European Hot Sauce Awards: Europe's Best, Definitely Hot, and the Reaper Collection.",
    "A Berlin BBQ Box built exclusively for Berlin Chili Fest.",
    "A discovery subscription for Europe's best independent hot sauces, delivered to the door.",
  ],
  photo: IMAGES.rohBox.src,
};

const ALL: Maker[] = [...MAKERS, ROH_PROFILE];

// Only makers who actually submitted content (plus ROH) get a profile page.
const HAS_PROFILE = new Set<string>([
  ...Object.keys(MAKER_TEMPLATES),
  "republic-of-heat",
]);

function getMaker(id: string): Maker | undefined {
  return ALL.find((m) => m.id === id);
}

type Params = Promise<{ id: string }>;
type SP = Promise<{ lang?: string }>;

export function generateStaticParams() {
  return ALL.filter((m) => HAS_PROFILE.has(m.id)).map((m) => ({ id: m.id }));
}

function storyOf(m: Maker, lang: Lang): string {
  return lang === "de" ? MAKERS_DE[m.id]?.story ?? m.story : m.story;
}
function anglesOf(m: Maker, lang: Lang): string[] {
  return lang === "de" ? MAKERS_DE[m.id]?.angles ?? m.angles : m.angles;
}
const heatLabel = (lang: Lang) => (lang === "de" ? "Schärfe" : "Heat");

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}): Promise<Metadata> {
  const { id } = await params;
  const m = getMaker(id);
  if (!m) return { title: "Maker not found" };
  const lang = asLang((await searchParams).lang);
  const canonical = `${SITE_URL}/chilifest/makers/${id}`;
  const description = storyOf(m, lang);
  return {
    title: `${m.name} — Berlin Chili Fest — ${SITE_NAME}`,
    description,
    alternates: {
      canonical,
      languages: { en: canonical, de: `${canonical}?lang=de` },
    },
    openGraph: {
      type: "profile",
      title: m.name,
      description,
      siteName: SITE_NAME,
      url: canonical,
      images: m.photo ? [`${SITE_URL}${m.photo}`] : [],
    },
  };
}

export default async function MakerDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { id } = await params;
  const m = getMaker(id);
  if (!m || !HAS_PROFILE.has(id)) notFound();
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  const angles = anglesOf(m, lang);
  const template = MAKER_TEMPLATES[id];
  const makerImages = MAKER_IMAGES[id] ?? [];
  const tmplStory =
    lang === "de" && template?.storyDe ? template.storyDe : template?.story;
  const tmplPairings =
    lang === "de" && template?.pairingsDe ? template.pairingsDe : template?.pairings;
  const makersHref = lang === "de" ? "/chilifest/makers?lang=de" : "/chilifest/makers";

  // Press-action deep links: carry the maker + intent into the hub request form.
  const isRoh = id === "republic-of-heat";
  const q = lang === "de" ? "&lang=de" : "";
  const reqBase = `/chilifest?maker=${encodeURIComponent(m.name)}`;
  const sampleHref = `${reqBase}&sauce=${encodeURIComponent(m.flagship)}&ask=sample${q}#request`;
  const infoHref = `${reqBase}&ask=info${q}#request`;
  const interviewHref = `${reqBase}&ask=interview${q}#request`;

  return (
    <>
      <div className="print:hidden">
        <TopBar />
        <SiteHeader />
      </div>
      <ChiliFestNav lang={lang} current="makers" langBase={`/chilifest/makers/${id}`} />

      <header className="bg-ink-deep text-white border-b border-rule">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <Link href={makersHref} className="label text-white/60 hover:text-white">
            ← {t.navMakers}
          </Link>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10 sm:py-14">
          {/* Layer 1: Nightjar hero */}
          {m.photo ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-rule bg-paper-green/50">
              <Image
                src={m.photo}
                alt={`${m.name} at Berlin Chili Fest`}
                fill
                sizes="(max-width:896px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="mt-8">
            {m.location ? <p className="label text-muted">{m.location}</p> : null}
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
              {m.name}
            </h1>
            {m.maker ? <p className="mt-1 text-muted">{m.maker}</p> : null}
            {m.awards ? (
              <p className="mt-4">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.05em]"
                  style={{ background: "#f4c518", color: "#1a1a1a" }}
                >
                  <span aria-hidden>★</span> EHSA · {m.awards}
                </span>
              </p>
            ) : null}
          </div>

          {m.flagship || m.heat ? (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-rule py-5">
              {m.flagship ? (
                <div>
                  <dt className="label text-muted">{t.flagship}</dt>
                  <dd className="mt-1 text-foreground/90">{m.flagship}</dd>
                </div>
              ) : null}
              {m.heat ? (
                <div>
                  <dt className="label text-muted">{heatLabel(lang)}</dt>
                  <dd className="mt-1 text-foreground/90">{m.heat}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{storyOf(m, lang)}</p>

          {/* Press-action bar: sample / info / interview, plus asset downloads */}
          <section className="mt-8 rounded-lg border border-rule bg-paper-green/40 p-5 sm:p-6 print:hidden">
            <p className="label text-muted">{t.pressActions}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <Link
                href={sampleHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
              >
                <BottleIcon /> {isRoh ? t.actSampleSet : t.actSample}
              </Link>
              <Link
                href={infoHref}
                className="inline-flex items-center rounded-full border border-ink/25 text-ink text-sm font-semibold px-4 py-2.5 hover:bg-ink hover:text-white transition-colors"
              >
                {t.actInfo}
              </Link>
              <Link
                href={interviewHref}
                className="inline-flex items-center rounded-full border border-ink/25 text-ink text-sm font-semibold px-4 py-2.5 hover:bg-ink hover:text-white transition-colors"
              >
                {t.actInterview}
              </Link>
            </div>
            {m.photo ? (
              <div className="mt-4 pt-4 border-t border-rule/70 flex flex-wrap gap-2">
                <a
                  href={m.photo}
                  download={`${m.id}-berlin-chili-fest.jpg`}
                  className="inline-flex items-center gap-1 rounded bg-ink/85 text-white text-xs font-semibold px-3 py-2 hover:bg-accent transition-colors"
                >
                  ↓ {t.downloadImage}
                </a>
                {m.logo ? (
                  <a
                    href={m.logo}
                    download={`${m.id}-logo.png`}
                    className="inline-flex items-center gap-1 rounded bg-ink/85 text-white text-xs font-semibold px-3 py-2 hover:bg-accent transition-colors"
                  >
                    ↓ {t.downloadLogo}
                  </a>
                ) : null}
              </div>
            ) : null}
          </section>

          {angles.length > 0 ? (
            <section className="mt-10 border-t border-rule pt-8">
              <p className="label text-muted">{t.storyAngles}</p>
              <ul className="mt-3 space-y-2">
                {angles.map((a, i) => (
                  <li
                    key={i}
                    className="text-foreground/80 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Layer 2: the maker's own photos */}
          {makerImages && makerImages.length > 0 ? (
            <section className="mt-10 border-t border-rule pt-8">
              <p className="label text-muted">
                {lang === "de" ? "Fotos des Machers" : "Maker's own photos"}
              </p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {makerImages.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    download={`${m.id}-${i + 1}.jpg`}
                    aria-label={`${t.downloadImage}: ${m.name} ${i + 1}`}
                    className="group relative block aspect-square overflow-hidden border border-rule"
                  >
                    <Image
                      src={src}
                      alt={`${m.name} photo ${i + 1}`}
                      fill
                      sizes="(max-width:640px) 50vw, 30vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded bg-ink/85 text-white text-[10px] font-semibold px-2 py-1 opacity-90 group-hover:bg-accent transition-colors">
                      ↓ {t.downloadImage}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {/* Layer 3: the maker's verbatim template response */}
          {template ? (
            <section className="mt-10 border-t border-rule pt-8">
              <p className="label text-muted">
                {lang === "de" ? "In den Worten des Machers" : "In the maker's own words"}
              </p>
              <dl className="mt-4 space-y-5 text-foreground/90">
                {template.sauceName ? (
                  <div>
                    <dt className="label text-muted">{t.flagship}</dt>
                    <dd className="mt-1">{template.sauceName}</dd>
                  </div>
                ) : null}
                {template.heat ? (
                  <div>
                    <dt className="label text-muted">{heatLabel(lang)}</dt>
                    <dd className="mt-1">{template.heat}</dd>
                  </div>
                ) : null}
                {tmplStory ? (
                  <div>
                    <dt className="label text-muted">{lang === "de" ? "Geschichte" : "Story"}</dt>
                    <dd className="mt-1 leading-relaxed whitespace-pre-line">{tmplStory}</dd>
                  </div>
                ) : null}
                {tmplPairings && tmplPairings.length > 0 ? (
                  <div>
                    <dt className="label text-muted">{lang === "de" ? "Pairings" : "Pairings"}</dt>
                    <dd className="mt-1">
                      <ul className="list-disc pl-5 space-y-1">
                        {tmplPairings.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ) : null}
                {template.allergens ? (
                  <div>
                    <dt className="label text-muted">{lang === "de" ? "Allergene" : "Allergens"}</dt>
                    <dd className="mt-1">{template.allergens}</dd>
                  </div>
                ) : null}
                {template.funFact ? (
                  <div>
                    <dt className="label text-muted">{lang === "de" ? "Fun Fact" : "Fun fact"}</dt>
                    <dd className="mt-1">{template.funFact}</dd>
                  </div>
                ) : null}
              </dl>
            </section>
          ) : null}

          <div className="mt-12 pt-8 border-t border-rule flex justify-between text-sm">
            <Link href={makersHref} className="more-link">
              ← {t.navMakers}
            </Link>
            <p className="text-xs text-muted-soft">
              {t.photos}: {PHOTO_CREDIT}
            </p>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
