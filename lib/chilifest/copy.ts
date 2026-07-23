// EN/DE UI strings for the /chilifest microsite (+ /chilifest/makers).
// EN is default; ?lang=de switches. Maker stories live in makers.de.ts; the
// release lives in release.ts. Scope: chilifest pages only.

export type Lang = "en" | "de";
export function asLang(v: unknown): Lang {
  return v === "de" ? "de" : "en";
}

interface Copy {
  langName: string;
  // hero
  heroEyebrow: string;
  heroHeadline: string;
  heroLede: string;
  btnReleases: string;
  btnMedia: string;
  btnMeet: string;
  btnRequest: string;
  photoCredit: string;
  // mini nav
  navReleases: string;
  navMakers: string;
  navMedia: string;
  navRequest: string;
  // fact panel
  festivalLabel: string;
  festivalPara: string;
  lblWhen: string;
  lblWhere: string;
  lblTickets: string;
  lblOrganiser: string;
  hoursValue: string;
  pressPreviewWhen: string;
  ticketsValue: string;
  ticketsVia: string;
  organiserSub: string;
  // Neil pull-quote
  quoteText: string;
  quoteAttrib: string;
  quoteRole: string;
  // producers
  producersHeading: string;
  producersIntro: string;
  producersCta: string;
  // releases
  releasesHeading: string;
  releaseLabel: string;
  releaseTitle: string;
  releaseDate: string;
  dlEnglish: string;
  dlGerman: string;
  allReleases: string;
  // media
  mediaHeading: string;
  mediaIntro: string;
  mediaCtaHave: string;
  mediaCtaLogos: string;
  mediaCtaRequest: string;
  creditLabel: string;
  // request
  requestHeading: string;
  requestIntro: string;
  lblPressPreview: string;
  lblPlaces: string;
  // about + contact
  aboutHeading: string;
  aboutText: string;
  pressContact: string;
  pressOffice: string;
  contactCta: string;
  // makers page
  makersEyebrow: string;
  makersTitle: string;
  makersIntro: string;
  indexLabel: (n: number) => string;
  segHotSauces: string;
  segOilsCrisps: string;
  segSalsas: string;
  flagship: string;
  storyAngles: string;
  backToHub: string;
  photos: string;
  downloadImage: string;
  downloadLogo: string;
  // Republic of Heat partner block (makers page)
  partnerEyebrow: string;
  partnerLine: string;
  partnerCta: string;
  // profile press-action bar
  pressActions: string;
  actSample: string;
  actSampleSet: string;
  actInfo: string;
  actInterview: string;
  ehsaLegend: string;
}

export const COPY: Record<Lang, Copy> = {
  en: {
    langName: "English",
    heroEyebrow: "European Heat Council · Press hub",
    heroHeadline: "Berlin Chili Fest returns to Berlin.",
    heroLede:
      "Three days of hot sauce and chilli culture: 50+ artisan producers from across Europe, hundreds of sauces to taste, vegan street food, brewery beer, live entertainment, and Berlin's Best Homemade Hot Sauce Competition.",
    btnReleases: "Read the releases",
    btnMedia: "Download media",
    btnMeet: "Meet the makers",
    btnRequest: "Get your pass",
    photoCredit: "Photo: Berlin Chili Fest",
    navReleases: "Releases",
    navMakers: "Makers",
    navMedia: "Media Files",
    navRequest: "Get your pass",
    festivalLabel: "The festival",
    festivalPara:
      "Berlin Chili Fest is Berlin's festival of hot sauce and chilli culture, held at Berliner Berg Brauerei in Neukölln. It runs twice a year, each spring and autumn, gathering independent makers, growers and the public across a weekend of tasting, trade and competition.",
    lblWhen: "When",
    lblWhere: "Where",
    lblTickets: "Tickets",
    lblOrganiser: "Organiser",
    hoursValue: "Fri 6–10pm, Sat & Sun 12–10pm",
    pressPreviewWhen:
      "Industry preview: Fri 4 September, 16:30 — for press, influencers & trade",
    ticketsValue: "€7 day / €12 weekend",
    ticketsVia: "via chilifest.eu",
    organiserSub: "Press handled by the European Heat Council",
    quoteText:
      "Judging a hot sauce purely by its heat is like judging a wine purely by its alcohol, or a coffee purely by its caffeine. Berlin Chili Fest is built on everything that number leaves out.",
    quoteAttrib: "Neil Numb",
    quoteRole: "Founder & Organiser, Berlin Chili Fest",
    producersHeading: "Meet the producers",
    producersIntro:
      "Berlin Chili Fest brings together more than 50 independent makers. These {n} have offered samples and interviews to press, gathered here one maker a page.",
    producersCta: "Meet the {n} featured producers",
    releasesHeading: "Press releases",
    releaseLabel: "Press release",
    releaseTitle: "At Berlin Chili Fest, the makers ask to be judged on flavour, not heat",
    releaseDate: "18 July 2026",
    dlEnglish: "English (PDF)",
    dlGerman: "German (PDF)",
    allReleases: "All Council releases",
    mediaHeading: "Media files",
    mediaIntro:
      "High-resolution photography from Berlin Chili Fest, ready to publish. Free for editorial use with credit to Berlin Chili Fest.",
    mediaCtaHave: "Download all images",
    mediaCtaLogos: "Download logos",
    mediaCtaRequest: "Request the full image pack",
    creditLabel: "Credit: Berlin Chili Fest",
    requestHeading: "Get your industry pass",
    requestIntro:
      "A pass to the industry preview, before the public doors, for press, creators and trade. Press and creators can add a sample box too. Name and email to start. Industry preview:",
    lblPressPreview: "Industry preview",
    lblPlaces: "Places",
    aboutHeading: "About Berlin Chili Fest",
    aboutText:
      "Established in 2020, Berlin Chili Fest has grown into one of Europe's premier hot sauce celebrations. The festival combines professional competitions with grassroots community spirit, proving that you don't need corporate backing to build something meaningful. It attracts thousands of attendees, partners with industry leaders like Clifton Chili Club and Republic of Heat, and maintains its commitment to supporting independent, artisan hot sauce makers.",
    pressContact: "Press contact",
    pressOffice: "European Heat Council press office",
    contactCta: "Contact the Council",
    makersEyebrow: "Press selection · sample-ready makers",
    makersTitle: "The Makers of the Harvest",
    makersIntro:
      "Berlin Chili Fest brings together more than 50 independent makers. The twenty featured here have offered samples and interviews to press ahead of the show, gathered one maker a page: who they are, how the sauce tastes, and what to put it on.",
    indexLabel: (n) => `Index · ${n} featured makers`,
    segHotSauces: "Hot sauces",
    segOilsCrisps: "Chilli oils & crisps",
    segSalsas: "Salsas, pastes & condiments",
    flagship: "Flagship",
    storyAngles: "Story angles",
    backToHub: "Back to the press hub",
    photos: "Photos",
    downloadImage: "Download image",
    downloadLogo: "Logos",
    partnerEyebrow: "Berlin Chili Fest partner",
    partnerLine:
      "Republic of Heat will be showcasing the European Hot Sauce Awards with two hot sauce sets, Europe's Best and Definitely Hot, plus their own collections including the Berlin BBQ Box Set, made exclusively for the festival.",
    partnerCta: "Explore the subscription",
    pressActions: "For press",
    actSample: "Get a sample of this sauce",
    actSampleSet: "Request a sample set",
    actInfo: "Request more information",
    actInterview: "Request an interview",
    ehsaLegend: "= a medal at the 2026 European Hot Sauce Awards.",
  },
  de: {
    langName: "Deutsch",
    heroEyebrow: "European Heat Council · Presse-Hub",
    heroHeadline: "Berlin Chili Fest kehrt nach Berlin zurück.",
    heroLede:
      "Drei Tage Hot Sauce und Chili-Kultur: über 50 handwerkliche Produzenten aus ganz Europa, Hunderte Saucen zum Probieren, veganes Streetfood, Bier aus der Brauerei, Live-Programm und die Berlin's Best Homemade Hot Sauce Competition.",
    btnReleases: "Mitteilungen lesen",
    btnMedia: "Bildmaterial",
    btnMeet: "Die Macher",
    btnRequest: "Pass sichern",
    photoCredit: "Foto: Berlin Chili Fest",
    navReleases: "Mitteilungen",
    navMakers: "Die Macher",
    navMedia: "Bildmaterial",
    navRequest: "Pass sichern",
    festivalLabel: "Das Festival",
    festivalPara:
      "Das Berlin Chili Fest ist Berlins Festival der Hot Sauce und Chili-Kultur, ausgerichtet in der Berliner Berg Brauerei in Neukölln. Es findet zweimal im Jahr statt, im Frühjahr und im Herbst, und bringt unabhängige Macher, Erzeuger und Publikum an einem Wochenende aus Verkostung, Handel und Wettbewerb zusammen.",
    lblWhen: "Wann",
    lblWhere: "Wo",
    lblTickets: "Tickets",
    lblOrganiser: "Veranstalter",
    hoursValue: "Fr 18–22 Uhr, Sa & So 12–22 Uhr",
    pressPreviewWhen:
      "Fachvorschau: Fr. 4. September, 16:30 Uhr — für Presse, Influencer & Handel",
    ticketsValue: "7 € Tag / 12 € Wochenende",
    ticketsVia: "über chilifest.eu",
    organiserSub: "Presse über den European Heat Council",
    quoteText:
      "Eine Hot Sauce nur nach ihrer Schärfe zu beurteilen, ist wie einen Wein nur nach seinem Alkohol zu beurteilen oder einen Kaffee nur nach seinem Koffein. Das Berlin Chili Fest lebt von allem, was diese eine Zahl weglässt.",
    quoteAttrib: "Neil Numb",
    quoteRole: "Gründer & Organisator, Berlin Chili Fest",
    producersHeading: "Die Produzenten",
    producersIntro:
      "Das Berlin Chili Fest bringt mehr als 50 unabhängige Macher zusammen. Diese {n} haben der Presse Muster und Interviews angeboten, hier versammelt, ein Macher pro Seite.",
    producersCta: "Alle {n} Produzenten ansehen",
    releasesHeading: "Pressemitteilungen",
    releaseLabel: "Pressemitteilung",
    releaseTitle: "Beim Berlin Chili Fest wollen die Macher am Geschmack gemessen werden, nicht an der Schärfe",
    releaseDate: "18. Juli 2026",
    dlEnglish: "Englisch (PDF)",
    dlGerman: "Deutsch (PDF)",
    allReleases: "Alle Mitteilungen des Councils",
    mediaHeading: "Bildmaterial",
    mediaIntro:
      "Hochauflösende Fotografie vom Berlin Chili Fest, druckfertig. Zur redaktionellen Nutzung mit Quellenangabe „Berlin Chili Fest“ frei.",
    mediaCtaHave: "Alle Bilder herunterladen",
    mediaCtaLogos: "Logos herunterladen",
    mediaCtaRequest: "Das vollständige Bildpaket anfragen",
    creditLabel: "Bildnachweis: Berlin Chili Fest",
    requestHeading: "Sichern Sie sich Ihren Fachbesucher-Pass",
    requestIntro:
      "Ein Pass zur Fachvorschau, vor dem Publikumseinlass, für Presse, Creator und Handel. Presse und Creator können zusätzlich ein Musterpaket erhalten. Name und E-Mail genügen zum Start. Fachvorschau:",
    lblPressPreview: "Fachvorschau",
    lblPlaces: "Plätze",
    aboutHeading: "Über Berlin Chili Fest",
    aboutText:
      "Das 2020 gegründete Berlin Chili Fest hat sich zu einer der bedeutendsten Hot-Sauce-Feiern Europas entwickelt. Das Festival verbindet professionelle Wettbewerbe mit basisnahem Gemeinschaftsgeist und zeigt, dass es keine Konzernförderung braucht, um etwas Bedeutsames aufzubauen. Es zieht Tausende Besucher an, arbeitet mit Branchengrößen wie dem Clifton Chili Club und Republic of Heat zusammen und bleibt seinem Engagement für unabhängige, handwerkliche Hot-Sauce-Macher verpflichtet.",
    pressContact: "Pressekontakt",
    pressOffice: "European Heat Council, Pressebüro",
    contactCta: "Den Council kontaktieren",
    makersEyebrow: "Presseauswahl · musterbereite Macher",
    makersTitle: "Die Macher der Harvest",
    makersIntro:
      "Das Berlin Chili Fest bringt mehr als 50 unabhängige Macher zusammen. Die zwanzig hier vorgestellten haben der Presse vor dem Festival Muster und Interviews angeboten, ein Macher pro Seite: wer sie sind, wie die Sauce schmeckt und wozu sie passt.",
    indexLabel: (n) => `Index · ${n} ausgewählte Macher`,
    segHotSauces: "Hot Sauces",
    segOilsCrisps: "Chiliöle & Crisps",
    segSalsas: "Salsas, Pasten & Condiments",
    flagship: "Aushängeschild",
    storyAngles: "Story-Ansätze",
    backToHub: "Zurück zum Presse-Hub",
    photos: "Fotos",
    downloadImage: "Bild herunterladen",
    downloadLogo: "Logos",
    partnerEyebrow: "Berlin Chili Fest Partner",
    partnerLine:
      "Republic of Heat präsentiert die European Hot Sauce Awards mit zwei Hot-Sauce-Sets, Europe's Best und Definitely Hot, sowie eigene Kollektionen, darunter das exklusiv für das Festival gemachte Berlin BBQ Box Set.",
    partnerCta: "Zum Entdecker-Abo",
    pressActions: "Für die Presse",
    actSample: "Muster dieser Sauce anfragen",
    actSampleSet: "Musterset anfragen",
    actInfo: "Weitere Informationen anfragen",
    actInterview: "Interview anfragen",
    ehsaLegend: "= eine Medaille bei den European Hot Sauce Awards 2026.",
  },
};
