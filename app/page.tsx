import Image from "next/image";

const stories = [
  {
    label: "Awards",
    date: "10 June 2026",
    title:
      "EHSA 2026 concludes with 15 medals awarded across European producers",
    excerpt:
      "The second edition of the European Hot Sauce Awards closes its blind-tasting rounds with winners across nine categories and twelve countries represented.",
    href: "#",
    img: "/img/ehsa-istria.png",
  },
  {
    label: "Events",
    date: "5 June 2026",
    title: "Berlin Chili Fest 2026 sets dates and opens stand registration",
    excerpt:
      "The annual industry gathering returns to the capital this autumn, with producer stands, judging, and an industry day for trade and press.",
    href: "#",
    img: "/img/hero-berlin.png",
  },
  {
    label: "Distribution",
    date: "28 May 2026",
    title: "Republic of Heat adds Croatian, Maltese, and Spanish producers",
    excerpt:
      "Twelve makers join ROH's cross-border distribution programme this quarter, with first shipments expected ahead of the autumn trade season.",
    href: "#",
    img: "/img/news-product.jpg",
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
  {
    name: "Berlin Chili Fest",
    short: "BCF",
    remit:
      "Annual convening of producers, judges, and trade in the German capital. Includes a public festival day and an industry day for press and buyers.",
    seat: "Berlin",
    founded: "Founded 2024",
    href: null,
  },
  {
    name: "European Hot Sauce Awards",
    short: "EHSA",
    remit:
      "Blind-tasted competition recognising excellence across European production. Conducted by a rotating jury of producers, chefs, and writers.",
    seat: "Brussels-adjacent",
    founded: "Founded 2025",
    href: "https://heatawards.eu",
  },
];

function TopBar() {
  return (
    <div className="bg-ink text-white text-[12px]">
      <div className="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between">
        <span className="tracking-wide opacity-80">
          European Heat Council &middot; europeanheatcouncil.eu
        </span>
        <div className="hidden sm:flex gap-5 opacity-80">
          <a href="#" className="hover:opacity-100">
            EN
          </a>
          <a href="#" className="hover:opacity-100">
            DE
          </a>
          <a href="#press" className="hover:opacity-100">
            Press
          </a>
          <a href="#contact" className="hover:opacity-100">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-rule bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-4">
          <Image
            src="/ehc-logo.png"
            alt="European Heat Council"
            width={760}
            height={420}
            priority
            className="h-16 w-auto"
          />
        </a>
        <nav aria-label="Primary" className="hidden md:flex gap-8 text-sm">
          <a href="#mandate" className="hover:text-accent">
            Mandate
          </a>
          <a href="#members" className="hover:text-accent">
            Members
          </a>
          <a href="#stories" className="hover:text-accent">
            Stories
          </a>
          <a href="#press" className="hover:text-accent">
            Press
          </a>
          <a href="#contact" className="hover:text-accent">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-paper-green border-b border-rule">
      <div className="max-w-3xl mx-auto px-6 py-24 sm:py-32 text-center">
        <p className="label text-ink mb-6">
          European Heat Council &middot; Est. MMXXVI
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.15] tracking-tight text-ink">
          Growing Europe&rsquo;s heat makers.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground/80 max-w-xl mx-auto">
          The European Heat Council promotes sustainable chilli cultivation,
          preserves heritage varieties, and connects independent producers
          across the continent.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a href="#mandate" className="btn-primary">
            About the Council
          </a>
          <a href="#press" className="btn-secondary">
            Press &amp; media
          </a>
        </div>
        <p className="mt-10 italic text-muted text-sm tracking-wide">
          In ardore concordia
        </p>
      </div>
    </section>
  );
}

function Initiatives() {
  const items = [
    {
      title: "Heritage preservation",
      body: "Documenting and protecting Europe's indigenous chilli varieties through producer partnerships and seed-saving programmes.",
    },
    {
      title: "Producer support",
      body: "Connecting independent makers with distribution, judging, and press infrastructure run through the Council's three member organisations.",
    },
    {
      title: "Quality standards",
      body: "Establishing pan-European reference standards for blind tasting, provenance, and small-batch production.",
    },
  ];
  return (
    <section id="initiatives" className="bg-white border-b border-rule">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="label text-ink mb-4">Key initiatives</p>
        <h2 className="text-3xl sm:text-4xl font-semibold leading-[1.15] tracking-tight text-ink">
          What we do
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted max-w-2xl mx-auto">
          Three work programmes coordinated across the Council&rsquo;s member
          organisations and delivered to producers throughout the year.
        </p>
        <ul className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {items.map((it) => (
            <li key={it.title} className="flex flex-col items-center text-center">
              <svg
                viewBox="0 0 48 48"
                className="w-12 h-12 mb-5 text-ink"
                aria-hidden
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <circle cx="24" cy="24" r="3" fill="currentColor" />
              </svg>
              <h3 className="text-base font-semibold text-ink mb-2 tracking-tight">
                {it.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted max-w-xs">
                {it.body}
              </p>
            </li>
          ))}
        </ul>
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
          through any of its three member organisations or directly via the
          press office.
        </p>
        <a
          href="mailto:press@europeanheatcouncil.eu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink text-sm font-medium hover:bg-paper-green transition-colors"
        >
          Get in touch
        </a>
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
            Latest from the Council
          </h2>
          <a href="#" className="more-link">
            All updates
          </a>
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
                  className="object-cover"
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
              The Council operates across distribution, competition, and
              convening. Its members run year-round programmes serving makers
              from Galway to Sofia, and convene the trade once a year in
              Berlin.
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
              <p className="label text-muted">Member organisations</p>
              <p className="font-semibold text-ink mt-1">Three</p>
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
              alt="Award-winning bottles from Croatian producer Ljutistra photographed at the Roman temple in Pula, Istria."
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xs text-muted-soft mt-2 leading-relaxed">
            Bottles from a member-recognised Istrian producer, photographed in
            Pula. Photo: Republic of Heat / European Hot Sauce Awards 2026
            (AI-generated composite).
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
          <span className="label text-muted">Three</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <a href="mailto:press@europeanheatcouncil.eu" className="more-link">
            press@europeanheatcouncil.eu
          </a>
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
            <li>
              <span className="text-white/70">Berlin Chili Fest</span>
            </li>
            <li>
              <a href="https://heatawards.eu" className="hover:text-accent">
                European Hot Sauce Awards
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-white/60 mb-3">Contact</p>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:press@europeanheatcouncil.eu"
                className="hover:text-accent break-all"
              >
                press@europeanheatcouncil.eu
              </a>
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
      <Header />
      <Hero />
      <Mandate />
      <Initiatives />
      <Stories />
      <Members />
      <Press />
      <JoinBand />
      <Footer />
    </>
  );
}
