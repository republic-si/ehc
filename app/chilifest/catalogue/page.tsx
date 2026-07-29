import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { PHOTO_CREDIT, IMAGES } from "@/lib/chilifest/media";
import { MAKERS, type Maker } from "@/lib/chilifest/makers";
import { COPY, asLang, type Lang } from "@/lib/chilifest/copy";

// Print-oriented Berlin Chili Fest catalogue: a paginated A4 document that
// reuses the /chilifest maker data + copy and renders to a clean PDF via the
// browser's print-to-PDF. Screen preview shows the same paginated sheets.
// Site chrome (nav/footer) is intentionally absent — this is the catalogue only.

const CANONICAL = `${SITE_URL}/chilifest/catalogue`;
const OG_IMAGE = `${SITE_URL}/chilifest/og.jpg`;

// Republic of Heat award sets shown at the festival. Copy follows the ROH voice:
// evidence-only, no em dashes, no emojis. Photos: Republic of Heat.
const ROH_PRODUCTS = [
  {
    name: "Europe's Best",
    tag: "3 sauces · award winners",
    desc: "The top three sauces from the 2026 European Hot Sauce Awards, judged blind across hundreds of entries.",
    img: "/chilifest/roh/europes-best.webp",
    alt: "Republic of Heat Europe's Best box with three award-winning hot sauces on a rustic plate.",
  },
  {
    name: "Definitely Hot",
    tag: "the hot end of the range",
    desc: "The bottles built to bring the burn, for the ones who came in asking for the hot stuff. Very hot, we checked.",
    img: "/chilifest/roh/definitely-hot.webp",
    alt: "Republic of Heat Definitely Hot box with three hot sauces and dried chillies on a dark background.",
  },
  {
    name: "The Reaper Collection",
    tag: "7 sauces · reaper heat",
    desc: "Seven Carolina Reaper hot sauces from independent European makers. For the brave.",
    img: "/chilifest/roh/reaper-collection.webp",
    alt: "Republic of Heat The Reaper Collection box with grim reaper artwork and Carolina Reaper chillies.",
  },
];

type SP = Promise<{ lang?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];
  return {
    title: `Catalogue — Berlin Chili Fest — ${SITE_NAME}`,
    description: t.makersIntro,
    robots: { index: false, follow: false },
    alternates: { canonical: CANONICAL },
    openGraph: {
      type: "website",
      title: "Berlin Chili Fest — Official Catalogue",
      description: t.makersIntro,
      siteName: SITE_NAME,
      url: CANONICAL,
      images: [OG_IMAGE],
    },
  };
}

// One producer feature. Generous image on one side, editorial on the other,
// alternating each entry for rhythm. Story angles are pulled in as press-ready
// highlights. Never splits across a page.
function ProducerBlock({ maker: m, flip }: { maker: Maker; flip: boolean }) {
  return (
    <article
      className={`cat-producer break-inside-avoid${flip ? " cat-producer--flip" : ""}`}
    >
      <div className="cat-producer__photo">
        {m.photo ? (
          <Image
            src={m.photo}
            alt={`${m.name} at Berlin Chili Fest`}
            fill
            sizes="60vw"
            className="object-cover"
          />
        ) : (
          <span className="cat-producer__ph">{m.name}</span>
        )}
        {m.flagship ? (
          <span className="cat-producer__flagchip">
            {m.flagship}
            {m.heat ? <span className="cat-heat"> · {m.heat}</span> : null}
          </span>
        ) : null}
      </div>
      <div className="cat-producer__body">
        <p className="cat-eyebrow">{m.location}</p>
        <h3 className="cat-producer__name">{m.name}</h3>
        {m.maker ? <p className="cat-producer__maker">{m.maker}</p> : null}
        {m.awards ? (
          <p className="cat-award">
            <span aria-hidden>★</span> EHSA · {m.awards}
          </p>
        ) : null}
        <p className="cat-producer__story">{m.story}</p>
        {m.angles && m.angles.length > 0 ? (
          <div className="cat-angles">
            <p className="cat-angles__label">Story angles</p>
            <ul className="cat-angles__list">
              {m.angles.map((a, i) => (
                <li key={i} className="cat-angles__item">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const lang = asLang((await searchParams).lang);
  const t = COPY[lang];

  // Split producers around the ROH spread so ROH lands in the middle.
  const mid = Math.ceil(MAKERS.length / 2);
  const firstHalf = MAKERS.slice(0, mid);
  const secondHalf = MAKERS.slice(mid);

  return (
    <div className="catalogue">
      <style>{CATALOGUE_CSS}</style>

      {/* 1 — Cover */}
      <section className="sheet sheet--cover">
        <Image
          src={IMAGES.hero.src}
          alt={IMAGES.hero.alt}
          fill
          priority
          sizes="210mm"
          className="cat-cover__bg"
        />
        <div className="cat-cover__scrim" />
        <div className="cat-cover__inner">
          <Image
            src="/chilifest/bcf-logo.png"
            alt="Berlin Chili Fest"
            width={120}
            height={120}
            className="cat-cover__logo"
          />
          <p className="cat-eyebrow cat-eyebrow--light">
            Berlin Chili Fest · Berliner Berg Brauerei, Neukölln
          </p>
          <h1 className="cat-cover__title">Official Catalogue</h1>
          <p className="cat-cover__sub">
            The makers, the sauces, and the festival — a taster&apos;s guide to
            Berlin Chili Fest.
          </p>
          <p className="cat-cover__credit">Photo: {PHOTO_CREDIT}</p>
        </div>
      </section>

      {/* 2 — What is Berlin Chili Fest */}
      <section className="sheet sheet--intro">
        <div className="cat-intro__head">
          <p className="cat-eyebrow">{t.festivalLabel}</p>
          <h2 className="cat-intro__title">{t.heroHeadline}</h2>
        </div>
        <p className="cat-intro__lede">{t.heroLede}</p>
        <p className="cat-intro__para">{t.festivalPara}</p>

        <dl className="cat-facts">
          <div className="cat-fact">
            <dt>{t.lblWhen}</dt>
            <dd>{t.hoursValue}</dd>
          </div>
          <div className="cat-fact">
            <dt>{t.lblWhere}</dt>
            <dd>Berliner Berg Brauerei, Neukölln, Berlin</dd>
          </div>
          <div className="cat-fact">
            <dt>{t.lblTickets}</dt>
            <dd>{t.ticketsValue}</dd>
          </div>
          <div className="cat-fact">
            <dt>{t.lblOrganiser}</dt>
            <dd>European Heat Council</dd>
          </div>
        </dl>

        <div className="cat-intro__photo">
          <Image
            src={IMAGES.sauces.src}
            alt={IMAGES.sauces.alt}
            fill
            sizes="190mm"
            className="object-cover"
          />
        </div>
        <p className="cat-credit">Photo: {PHOTO_CREDIT}</p>
      </section>

      {/* 3 — Producers, first half */}
      <section className="sheet sheet--producers">
        <header className="cat-section__head">
          <p className="cat-eyebrow">The makers</p>
          <h2 className="cat-section__title">{t.makersTitle}</h2>
          <p className="cat-section__intro">{t.makersIntro}</p>
        </header>
        <div className="cat-producer-list">
          {firstHalf.map((m, i) => (
            <ProducerBlock key={m.id} maker={m} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* 4 — Republic of Heat, full middle spread: 3-product showcase */}
      <section className="sheet sheet--roh">
        <header className="cat-roh__head">
          <p className="cat-eyebrow cat-eyebrow--roh">{t.partnerEyebrow}</p>
          <h2 className="cat-roh__title">Republic of Heat</h2>
          <p className="cat-roh__line">
            The subscription that hand-picks Europe&apos;s independent hot sauce
            makers, delivered from Berlin. At the festival they are pouring three
            award sets from the European Hot Sauce Awards, tasted side by side.
          </p>
        </header>

        <div className="cat-roh__grid">
          {ROH_PRODUCTS.map((p) => (
            <article key={p.name} className="cat-roh__card">
              <div className="cat-roh__photo">
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  sizes="60mm"
                  className="object-cover"
                />
              </div>
              <div className="cat-roh__cardbody">
                <p className="cat-roh__tag">{p.tag}</p>
                <h3 className="cat-roh__name">{p.name}</h3>
                <p className="cat-roh__desc">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="cat-roh__cta">
          See the full range at republicofheat.com
        </p>
      </section>

      {/* 5 — Producers, second half */}
      <section className="sheet sheet--producers">
        <div className="cat-producer-list">
          {secondHalf.map((m, i) => (
            <ProducerBlock key={m.id} maker={m} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* 6 — Back: how to visit / buy */}
      <section className="sheet sheet--back">
        <div className="cat-back__inner">
          <Image
            src="/chilifest/bcf-logo.png"
            alt="Berlin Chili Fest"
            width={96}
            height={96}
            className="cat-back__logo"
          />
          <h2 className="cat-back__title">Come and taste for yourself</h2>
          <p className="cat-back__para">{t.pressPreviewWhen}</p>
          <dl className="cat-facts cat-facts--back">
            <div className="cat-fact">
              <dt>Tickets</dt>
              <dd>
                {t.ticketsValue} · {t.ticketsVia}
              </dd>
            </div>
            <div className="cat-fact">
              <dt>Press office</dt>
              <dd>European Heat Council</dd>
            </div>
          </dl>
          <p className="cat-credit">Photos: {PHOTO_CREDIT}</p>
        </div>
      </section>
    </div>
  );
}

const CATALOGUE_CSS = `
@page { size: A4; margin: 0; }

.catalogue {
  --cat-ink: #122a1d;
  --cat-paper: #ecefe7;
  --cat-accent: #ea580c;
  --cat-rule: rgba(18,42,29,0.14);
  background: #6b6b6b;
  color: var(--cat-ink);
  font-family: inherit;
}

/* One A4 sheet. On screen: centred cards with a gap. On print: exact pages. */
.sheet {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 8mm auto;
  padding: 18mm 16mm;
  background: #fff;
  box-shadow: 0 2px 18px rgba(0,0,0,0.28);
  overflow: hidden;
  box-sizing: border-box;
  break-after: page;
}
.sheet:last-child { break-after: auto; }

@media print {
  .catalogue { background: #fff; }
  .sheet {
    margin: 0;
    box-shadow: none;
    break-after: page;
  }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

.cat-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cat-accent);
  margin: 0;
}
.cat-eyebrow--light { color: rgba(255,255,255,0.8); }

.cat-credit {
  font-size: 9px;
  color: rgba(18,42,29,0.5);
  margin-top: 6mm;
}

/* --- Cover --- */
.sheet--cover { padding: 0; color: #fff; }
.cat-cover__bg { object-fit: cover; }
.cat-cover__scrim {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(18,42,29,0.35) 0%, rgba(18,42,29,0.85) 78%);
}
.cat-cover__inner {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 22mm 18mm;
}
.cat-cover__logo { margin-bottom: 10mm; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)); }
.cat-cover__title {
  font-size: 56px; line-height: 1.02; font-weight: 700;
  letter-spacing: -0.02em; margin: 6px 0 0;
}
.cat-cover__sub {
  font-size: 16px; line-height: 1.5; max-width: 130mm;
  color: rgba(255,255,255,0.9); margin: 10px 0 0;
}
.cat-cover__credit {
  font-size: 9px; color: rgba(255,255,255,0.6); margin: 12mm 0 0;
}

/* --- Intro --- */
.cat-intro__title {
  font-size: 34px; line-height: 1.06; font-weight: 700;
  letter-spacing: -0.02em; margin: 6px 0 0; color: var(--cat-ink);
}
.cat-intro__lede {
  font-size: 15px; line-height: 1.55; font-weight: 500;
  margin: 10mm 0 0; color: var(--cat-ink);
}
.cat-intro__para {
  font-size: 12px; line-height: 1.6; margin: 5mm 0 0;
  color: rgba(18,42,29,0.85);
}
.cat-facts {
  display: grid; grid-template-columns: 1fr 1fr; gap: 5mm 8mm;
  margin: 8mm 0 0; padding: 6mm 0; border-top: 1px solid var(--cat-rule);
  border-bottom: 1px solid var(--cat-rule);
}
.cat-facts--back { border-bottom: none; }
.cat-fact dt {
  font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--cat-accent);
}
.cat-fact dd { font-size: 13px; margin: 3px 0 0; color: var(--cat-ink); }
.cat-intro__photo {
  position: relative; width: 100%; height: 78mm;
  margin: 8mm 0 0; border-radius: 2px; overflow: hidden;
}

/* --- Section head --- */
.cat-section__head { margin-bottom: 9mm; }
.cat-section__title {
  font-size: 30px; line-height: 1.06; font-weight: 700;
  letter-spacing: -0.02em; margin: 6px 0 0; color: var(--cat-ink);
}
.cat-section__intro {
  font-size: 12px; line-height: 1.6; margin: 5mm 0 0; max-width: 150mm;
  color: rgba(18,42,29,0.85);
}

/* --- Producer feature --- */
.cat-producer-list { display: flex; flex-direction: column; gap: 10mm; }
.cat-producer {
  display: flex; gap: 9mm; align-items: stretch;
  padding-bottom: 10mm; border-bottom: 1px solid var(--cat-rule);
}
.cat-producer--flip { flex-direction: row-reverse; }
.cat-producer:last-child { border-bottom: none; padding-bottom: 0; }
.cat-producer__photo {
  position: relative; flex: 0 0 66mm; min-height: 70mm; align-self: stretch;
  background: var(--cat-paper); border-radius: 3px; overflow: hidden;
}
.cat-producer__ph {
  position: absolute; inset: 0; display: flex; align-items: center;
  justify-content: center; padding: 6mm; text-align: center;
  font-weight: 600; font-size: 13px; color: rgba(18,42,29,0.6);
}
.cat-producer__flagchip {
  position: absolute; left: 0; bottom: 4mm;
  max-width: 90%; padding: 5px 10px 5px 8px;
  background: var(--cat-ink); color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: -0.005em;
  border-radius: 0 3px 3px 0;
}
.cat-producer__flagchip .cat-heat { color: rgba(255,255,255,0.6); font-weight: 500; }
.cat-producer__body { flex: 1 1 auto; padding-top: 1mm; }
.cat-producer__name {
  font-size: 22px; font-weight: 700; letter-spacing: -0.015em;
  line-height: 1.08; margin: 5px 0 0; color: var(--cat-ink);
}
.cat-producer__maker { font-size: 11px; margin: 3px 0 0; color: rgba(18,42,29,0.6); }
.cat-award {
  display: inline-block; margin: 7px 0 0; padding: 3px 8px;
  background: #f4c518; color: #1a1a1a; border-radius: 999px;
  font-size: 9px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
}
.cat-producer__story {
  font-size: 12.5px; line-height: 1.55; margin: 8px 0 0;
  color: rgba(18,42,29,0.9);
}
.cat-heat { color: rgba(18,42,29,0.6); }

/* Story angles — press-ready hooks pulled from the maker data. */
.cat-angles {
  margin: 7mm 0 0; padding: 5mm 0 0; border-top: 1px solid var(--cat-rule);
}
.cat-angles__label {
  font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--cat-accent); margin: 0 0 3mm;
}
.cat-angles__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2.5mm; }
.cat-angles__item {
  position: relative; padding-left: 5mm;
  font-size: 11px; line-height: 1.45; color: rgba(18,42,29,0.8);
}
.cat-angles__item::before {
  content: ""; position: absolute; left: 0; top: 5px;
  width: 5px; height: 5px; border-radius: 999px; background: var(--cat-accent);
}

/* --- ROH middle spread: product showcase --- */
.sheet--roh {
  --roh-crimson: #b3123f;
  color: #fff; background: #17130f;
  display: flex; flex-direction: column; justify-content: center;
}
.cat-roh__head { max-width: 165mm; }
.cat-eyebrow--roh { color: var(--roh-crimson); }
.cat-roh__title {
  font-size: 44px; line-height: 1.02; font-weight: 700;
  letter-spacing: -0.02em; margin: 8px 0 0; color: #fff;
}
.cat-roh__line {
  font-size: 14px; line-height: 1.55; margin: 8px 0 0;
  color: rgba(255,255,255,0.82);
}
.cat-roh__grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 7mm; margin: 11mm 0 0;
}
.cat-roh__card {
  background: #fff; border-radius: 3px; overflow: hidden;
  display: flex; flex-direction: column;
}
.cat-roh__photo { position: relative; width: 100%; aspect-ratio: 4 / 3; background: #eee; }
.cat-roh__cardbody { padding: 6mm 5mm 7mm; display: flex; flex-direction: column; }
.cat-roh__tag {
  font-size: 8.5px; font-weight: 800; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--roh-crimson); margin: 0;
}
.cat-roh__name {
  font-size: 17px; font-weight: 700; letter-spacing: -0.01em;
  line-height: 1.1; margin: 3px 0 0; color: var(--cat-ink);
}
.cat-roh__desc {
  font-size: 10.5px; line-height: 1.5; margin: 5px 0 0;
  color: rgba(18,42,29,0.82);
}
.cat-roh__cta {
  font-size: 13px; font-weight: 700; letter-spacing: 0.02em;
  color: var(--roh-crimson); margin: 12mm 0 0; text-align: center;
}

/* --- Back --- */
.sheet--back { background: var(--cat-paper); }
.cat-back__inner { display: flex; flex-direction: column; height: 100%; }
.cat-back__logo { margin-bottom: 10mm; }
.cat-back__title {
  font-size: 34px; line-height: 1.06; font-weight: 700;
  letter-spacing: -0.02em; margin: 0; color: var(--cat-ink);
}
.cat-back__para { font-size: 13px; line-height: 1.55; margin: 6mm 0 0; color: rgba(18,42,29,0.85); }
`;
