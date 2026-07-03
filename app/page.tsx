import Image from "next/image";
import Link from "next/link";
import { TopBar, SiteHeader } from "@/app/_components/SiteChrome";

const stories = [
  {
    label: "Pula, HR",
    date: "22 May 2026",
    title:
      "Pula craft kitchen takes three Golds in three categories at EHSA 2026",
    excerpt:
      "OPG Ljutistra, run by chef and producer Patrik Prnjak in the Pula and Fažana area, places Gold in Extract Based, Garlic and Salt & Condiments.",
    href: "/releases/opg-ljutistra",
    img: "/img/ehsa-istria.png",
  },
  {
    label: "Murrhardt, DE",
    date: "23 May 2026",
    title:
      "Schwäbischer Wald kitchen takes three Golds in three different categories",
    excerpt:
      "Chilma, a kitchen in Murrhardt run by Gerd Ihle, places Gold in Chili Ketchup, Chili Oil and Salt & Condiments with Salsa Habanero, Spicy Chili Crisp and Carolina Reaper Salz.",
    href: "/releases/chilma",
    img: "/img/news-maker.png",
  },
  {
    label: "Albufeira, PT",
    date: "21 May 2026",
    title:
      "Algarve piri-piri farm takes two Golds, 180 varieties grown on one Albufeira plot",
    excerpt:
      "Piri-Piri & Co, a 15-year piri-piri farm at Quinta do Piri-Piri run by Romeu Santos, places Gold in Extra Hot with Asinhas Infernais and Gold in Mild with Manga e Mel.",
    href: "/releases/piri-piri-co",
    img: "/img/producers/piri-piri-co.jpg",
    imgPosition: "top" as const,
  },
];

const members = [
  {
    name: "Republic of Heat",
    short: "ROH",
    remit:
      "Distribution and press partner to independent European hot sauce makers. Operates cross-border logistics, photography, and editorial.",
    seat: "Berlin",
    founded: "Founded 2023",
    href: "https://republicofheat.com",
  },
];


function Hero() {
  return (
    <section className="relative bg-ink-deep text-white border-b border-rule overflow-hidden">
      <Image
        src="/img/hero-market.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-deep/95 via-ink-deep/60 to-ink-deep/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-transparent to-ink-deep/30"
      />
      <div className="relative max-w-6xl mx-auto px-6 py-28 sm:py-36 lg:py-44">
        <div className="max-w-xl">
          <p className="label text-white/70 mb-6">
            The voice of Europe&rsquo;s independent hot sauce makers.
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white">
            Uniting Europe&rsquo;s chilli community,
            <br className="hidden sm:block" /> from seed to shelf.
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-white/85 max-w-lg">
            The European Heat Council connects growers, makers, retailers and
            partners across the entire hot sauce ecosystem, driving standards,
            trust and growth together.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#mandate"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-ink text-sm font-medium tracking-wide hover:bg-paper-green transition-colors"
            >
              Join. Collaborate. Elevate.
            </a>
            <a
              href="#press"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/40 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors"
            >
              Press &amp; media
            </a>
          </div>
          <p className="mt-12 italic text-white/55 text-sm tracking-wide">
            In ardore concordia
          </p>
        </div>
      </div>
    </section>
  );
}

function SupplyChain() {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const stages = [
    {
      label: "Growing",
      icon: (
        <svg {...iconProps}>
          <path d="M9 4c1.6 0 2.4.9 2.4 2 0 .9-.6 1.5-1.5 1.6" />
          <path d="M10 7c2.5 1.2 7 5 7 10.3 0 1.7-1.6 2.7-3.6 2.7-4 0-7.4-3.6-7.4-8 0-2.6 1.4-4.2 3-5" />
        </svg>
      ),
    },
    {
      label: "Fermentation",
      icon: (
        <svg {...iconProps}>
          <path d="M9 4h6" />
          <path d="M9 4v2.5l-1.2 1.6c-.5.6-.8 1.4-.8 2.2V19a1 1 0 001 1h8a1 1 0 001-1v-8.7c0-.8-.3-1.6-.8-2.2L15 6.5V4" />
          <path d="M7 13.5h10" />
        </svg>
      ),
    },
    {
      label: "Makers",
      icon: (
        <svg {...iconProps}>
          <path d="M10 4h4" />
          <path d="M10 4v3l-1 1.8a3 3 0 00-.4 1.5V19a1 1 0 001 1h4.8a1 1 0 001-1v-8.7a3 3 0 00-.4-1.5L14 7V4" />
          <path d="M8.6 12.5h6.8" />
        </svg>
      ),
    },
    {
      label: "Packaging",
      icon: (
        <svg {...iconProps}>
          <path d="M4 7.5l8 3.5 8-3.5" />
          <path d="M12 11v9.5" />
          <path d="M4 7.5v9L12 20.5l8-4V7.5L12 4z" />
          <path d="M8 5.6l8 3.5" />
        </svg>
      ),
    },
    {
      label: "Retail",
      icon: (
        <svg {...iconProps}>
          <path d="M4 9l1.4-4h13.2L20 9" />
          <path d="M5 9v11h14V9" />
          <path d="M10 20v-5h4v5" />
          <path d="M4 9a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0" />
        </svg>
      ),
    },
    {
      label: "Events",
      icon: (
        <svg {...iconProps}>
          <path d="M5 5v15" />
          <path d="M5 5h11l-2 3 2 3H5" />
        </svg>
      ),
    },
    {
      label: "Trade",
      icon: (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
          <path d="M12 4c2.5 2.2 2.5 13.6 0 16M12 4c-2.5 2.2-2.5 13.6 0 16" />
        </svg>
      ),
    },
    {
      label: "Logistics",
      icon: (
        <svg {...iconProps}>
          <path d="M3 7h10v9H3z" />
          <path d="M13 10h4l3 3v3h-7" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
      ),
    },
  ];
  return (
    <section
      aria-label="From seed to shelf"
      className="bg-paper-green border-b border-rule"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="label text-muted text-center mb-8">From seed to shelf</p>
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-10">
          {stages.map((s, i) => (
            <li
              key={s.label}
              className="relative flex flex-col items-center text-center px-2"
            >
              <div className="w-10 h-10 text-ink mb-4">{s.icon}</div>
              <p className="label text-ink text-[11px] leading-tight">
                {s.label}
              </p>
              {i < stages.length - 1 ? (
                <span
                  aria-hidden
                  className="hidden lg:block absolute right-0 top-5 translate-x-1/2 text-ink/30"
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 4h9m0 0L7 1m3 3L7 7"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Benefits() {
  const available = [
    "Show up at more events for less, with the Council booking group stands and splitting cost and admin across members",
    "Lower unit costs on bottles, caps, labels and ingredients through the Council's pooled purchasing",
    "Skip the warehouse: drop pallets at the Council's fulfilment hub and we handle storage, picking and dispatch",
    "Public and product liability cover at group rates, without shopping the market every renewal",
    "Ship cheaper and faster, including cross-border, on the Council's negotiated courier rates",
  ];
  const roadmap = [
    "Pre-publication embargo access on Council releases",
    "Voting rights on Council standards",
    "Discounted European Hot Sauce Awards entry fee",
    "Translation support across six European languages",
    "Cross-border distribution introductions",
  ];
  return (
    <section id="benefits" className="bg-paper-green border-b border-rule">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="label text-ink mb-4">Membership</p>
          <h2 className="text-3xl sm:text-4xl font-semibold leading-[1.15] tracking-tight text-ink">
            Why independent producers join the Council.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/85 max-w-2xl">
            Membership connects producers to the Council&rsquo;s press,
            distribution and event infrastructure. Some benefits are live today
            through founding member Republic of Heat. Others ship as the
            Council grows. We list both honestly.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="label text-ink mb-4">Available now</p>
            <ul className="space-y-3 text-sm leading-relaxed text-foreground/85">
              {available.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mt-1 shrink-0 text-ink"
                    aria-hidden
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-muted mb-4">Roadmap</p>
            <ul className="space-y-3 text-sm leading-relaxed text-foreground/75">
              {roadmap.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mt-1 shrink-0 text-muted"
                    aria-hidden
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/benefits"
            className="inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
          >
            Full membership benefits
          </Link>
          <Link
            href="/contact?topic=Membership"
            className="inline-flex items-center px-6 py-3 rounded-full border border-ink/30 text-ink text-sm font-medium tracking-wide hover:bg-white transition-colors"
          >
            Apply for membership
          </Link>
        </div>
      </div>
    </section>
  );
}

function JoinBand() {
  return (
    <section className="bg-ink text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.2] mb-4">
          Working with European heat makers?
        </h2>
        <p className="text-white/75 max-w-2xl mx-auto text-base leading-relaxed mb-8">
          Producers, journalists, and trade buyers can reach the Council
          through its member organisations or directly via the contact page.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink text-sm font-medium hover:bg-paper-green transition-colors"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section id="stories" className="bg-white border-b border-rule">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-rule">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Latest releases
          </h2>
          <Link href="/releases" className="more-link">
            All releases
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {stories.map((s) => (
            <article key={s.title} className="flex flex-col">
              <a
                href={s.href}
                className="relative block aspect-[4/3] overflow-hidden bg-rule-soft mb-5"
              >
                <Image
                  src={s.img}
                  alt=""
                  fill
                  className={`object-cover ${s.imgPosition === "top" ? "object-top" : ""}`}
                />
              </a>
              <p className="label text-ink mb-3">
                {s.label}
                <span className="text-muted font-medium tracking-normal normal-case ml-3">
                  {s.date}
                </span>
              </p>
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink mb-2">
                <a href={s.href} className="hover:text-accent">
                  {s.title}
                </a>
              </h3>
              <p className="text-sm leading-relaxed text-muted mb-4">
                {s.excerpt}
              </p>
              <a href={s.href} className="more-link mt-auto self-start">
                More information
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mandate() {
  return (
    <section id="mandate" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <p className="label text-ink mb-4">Mandate</p>
          <h2 className="text-3xl sm:text-4xl font-semibold leading-[1.15] tracking-tight text-ink mb-6">
            A convening body for the European hot sauce industry.
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-foreground/85 max-w-2xl">
            <p>
              The European Heat Council coordinates the work of its member
              organisations, advances quality and provenance standards, and
              supports the independent producers shaping European chilli
              culture.
            </p>
            <p>
              The Council operates across distribution, heritage, and
              quality. Its member programmes serve independent makers from
              Galway to Sofia, working year-round across borders.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 text-sm">
            <div>
              <p className="label text-muted">Founded</p>
              <p className="font-semibold text-ink mt-1">MMXXVI</p>
            </div>
            <div>
              <p className="label text-muted">Seat</p>
              <p className="font-semibold text-ink mt-1">Berlin</p>
            </div>
            <div>
              <p className="label text-muted">Producers represented</p>
              <p className="font-semibold text-ink mt-1">200+</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] bg-rule-soft overflow-hidden">
            <Image
              src="/img/ehsa-istria.png"
              alt="Bottles from a Croatian producer photographed at the Roman temple in Pula, Istria."
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xs text-muted-soft mt-2 leading-relaxed">
            Bottles from an Istrian producer, photographed in Pula. Photo:
            Republic of Heat (AI-generated composite).
          </p>
        </div>
      </div>
    </section>
  );
}

function Members() {
  return (
    <section id="members" className="bg-white border-t border-b border-rule">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-rule">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Member organisations
          </h2>
          <span className="label text-muted">Founding member</span>
        </div>
        <ul className="grid grid-cols-1 max-w-md mx-auto gap-8">
          {members.map((m) => (
            <li
              key={m.short}
              className="bg-white border border-rule flex flex-col"
            >
              <div className="h-1 bg-ink" aria-hidden />
              <div className="p-6 flex flex-col flex-1">
                <p className="label text-muted">{m.short}</p>
                <h3 className="text-xl font-semibold tracking-tight text-ink mt-2 mb-3 leading-snug">
                  {m.name}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80 mb-5">
                  {m.remit}
                </p>
                <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-5 pt-4 border-t border-rule-soft">
                  <dt className="label text-muted-soft">Seat</dt>
                  <dd className="text-ink font-medium text-right">{m.seat}</dd>
                  <dt className="label text-muted-soft">Status</dt>
                  <dd className="text-ink font-medium text-right">
                    {m.founded}
                  </dd>
                </dl>
                {m.href ? (
                  <a href={m.href} className="more-link mt-auto self-start">
                    Visit member site
                  </a>
                ) : (
                  <span className="text-xs text-muted-soft mt-auto self-start">
                    Member site in preparation
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Press() {
  return (
    <section id="press" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="label text-ink mb-4">Press</p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink leading-[1.15] mb-6">
            For journalists and editors covering European chilli culture.
          </h2>
          <p className="text-base leading-relaxed text-foreground/85 mb-6 max-w-prose">
            The Council distributes embargoed releases, judging results, and
            high-resolution photography through its member press operations.
            Working press are welcome at member events and tastings on
            accreditation.
          </p>
          <Link href="/contact?topic=Press" className="more-link">
            Contact the Council
          </Link>
        </div>
        <aside className="bg-white border border-rule p-6">
          <p className="label text-muted mb-4">Resources</p>
          <ul className="divide-y divide-rule-soft text-sm">
            {[
              ["Releases archive", "Forthcoming"],
              ["Photography library", "By request"],
              ["Member contact directory", "By request"],
              ["Embargo policy", "Forthcoming"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between py-3 text-foreground/85"
              >
                <span>{k}</span>
                <span className="text-muted-soft text-xs uppercase tracking-wider">
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="contact"
      className="bg-ink-deep text-white/85 text-sm mt-auto"
    >
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="label text-white/60 mb-3">The Council</p>
          <p className="font-semibold text-white text-base mb-2">
            European Heat Council
          </p>
          <p className="italic text-white/70 text-sm mb-1">
            In ardore concordia
          </p>
          <p className="text-white/60 text-xs">Established MMXXVI</p>
        </div>
        <div>
          <p className="label text-white/60 mb-3">About</p>
          <ul className="space-y-2">
            <li>
              <a href="#mandate" className="hover:text-accent">
                Mandate
              </a>
            </li>
            <li>
              <a href="#members" className="hover:text-accent">
                Members
              </a>
            </li>
            <li>
              <a href="#stories" className="hover:text-accent">
                Updates
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-white/60 mb-3">Members</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://republicofheat.com"
                className="hover:text-accent"
              >
                Republic of Heat
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-white/60 mb-3">Contact</p>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="hover:text-accent">
                Contact the Council
              </Link>
            </li>
            <li>
              <Link href="/benefits" className="hover:text-accent">
                Membership
              </Link>
            </li>
            <li className="text-white/70">Seat: Berlin</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/60">
          <p>&copy; MMXXVI European Heat Council. All rights reserved.</p>
          <p>europeanheatcouncil.eu</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <TopBar />
      <SiteHeader />
      <Hero />
      <SupplyChain />
      <Mandate />
      <Benefits />
      <Stories />
      <Members />
      <Press />
      <JoinBand />
      <Footer />
    </>
  );
}
