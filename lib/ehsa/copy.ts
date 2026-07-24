// EN/DE UI strings for the /ehsa press hub (European Hot Sauce Awards 2027).
// EN is default; ?lang=de switches. Scope: /ehsa pages only.
// House style: no em dashes, no emojis, evidence-only claims.

export type Lang = "en" | "de";
export function asLang(v: unknown): Lang {
  return v === "de" ? "de" : "en";
}

interface Copy {
  langName: string;
  // hero
  heroEyebrow: string;
  heroWhere: string;
  heroLede: string;
  btnRegister: string;
  btnContact: string;
  // story
  storyLabel: string;
  storyHeading: string;
  storyPara: string;
  feat1Title: string;
  feat1Text: string;
  feat2Title: string;
  feat2Text: string;
  feat3Title: string;
  feat3Text: string;
  // register
  registerHeading: string;
  registerIntro: string;
  registerNote: string;
  // about + contact
  aboutHeading: string;
  aboutText: string;
  pressContact: string;
  pressOffice: string;
  contactCta: string;
}

export const COPY: Record<Lang, Copy> = {
  en: {
    langName: "EN",
    heroEyebrow: "European Hot Sauce Awards · For press",
    heroWhere: "Berlin · February to March 2027 · venue to be announced",
    heroLede:
      "Europe's hot sauce awards return to Berlin. This is the press hub, where the story, the judges and the coverage come together. Register your interest to be part of it.",
    btnRegister: "Register your interest",
    btnContact: "Press contact",
    storyLabel: "The story",
    storyHeading: "A cuisine, not a dare.",
    storyPara:
      "European hot sauce is not pain content. It is a cuisine: regional ingredients, obsessive growers and small-batch makers working the same craft logic as natural wine or single-estate coffee. Flavours that exist nowhere else, because one person in one village is the only one making them. EHSA brings the best of them into one room.",
    feat1Title: "Craft, not heat",
    feat1Text:
      "Fermented, smoked, aged and blended by hand. Judged on flavour, not on who can take the most pain.",
    feat2Title: "From Greece to Iceland",
    feat2Text:
      "Regional chillies, styles and traditions from every corner of Europe, tasted side by side.",
    feat3Title: "The makers behind them",
    feat3Text:
      "One-person kitchens and family growers, each with a story worth telling and worth tasting.",
    registerHeading: "Register your interest",
    registerIntro:
      "Judges, journalists and editors: tell us you want in. We will come back to you as the 2027 dates, venue and programme are confirmed.",
    registerNote: "For press and trade only. No spam, one update at a time.",
    aboutHeading: "About EHSA",
    aboutText:
      "The European Hot Sauce Awards is the European Heat Council's juried award for hot sauce, spotlighting the small-batch makers defining the category across Europe.",
    pressContact: "Press contact",
    pressOffice: "EHC Press Office, Simon Gardner, press@republicofheat.com",
    contactCta: "Get in touch",
  },
  de: {
    langName: "DE",
    heroEyebrow: "European Hot Sauce Awards · Für Presse",
    heroWhere: "Berlin · Februar bis März 2027 · Veranstaltungsort folgt",
    heroLede:
      "Europas Hot-Sauce-Awards kehren nach Berlin zurück. Das ist der Presse-Hub, wo Geschichte, Jury und Berichterstattung zusammenkommen. Melde dein Interesse an und sei dabei.",
    btnRegister: "Interesse anmelden",
    btnContact: "Pressekontakt",
    storyLabel: "Die Geschichte",
    storyHeading: "Eine Küche, keine Mutprobe.",
    storyPara:
      "Europäische Hot Sauce ist kein Schmerz-Content. Sie ist eine Küche: regionale Zutaten, besessene Züchter und Small-Batch-Macher, die derselben Handwerkslogik folgen wie Naturwein oder Single-Estate-Kaffee. Aromen, die es nirgendwo sonst gibt, weil eine Person in einem Dorf die einzige ist, die sie macht. EHSA bringt die Besten davon in einen Raum.",
    feat1Title: "Handwerk, nicht Schärfe",
    feat1Text:
      "Fermentiert, geräuchert, gereift und von Hand gemischt. Bewertet wird der Geschmack, nicht wer am meisten aushält.",
    feat2Title: "Von Griechenland bis Island",
    feat2Text:
      "Regionale Chilis, Stile und Traditionen aus jedem Winkel Europas, direkt nebeneinander verkostet.",
    feat3Title: "Die Macher dahinter",
    feat3Text:
      "Ein-Personen-Küchen und Familienbetriebe, jeder mit einer Geschichte, die es zu erzählen und zu probieren lohnt.",
    registerHeading: "Interesse anmelden",
    registerIntro:
      "Jury, Journalistinnen und Redakteure: sagt uns, dass ihr dabei sein wollt. Wir melden uns, sobald Termine, Ort und Programm 2027 feststehen.",
    registerNote: "Nur für Presse und Handel. Kein Spam, ein Update nach dem anderen.",
    aboutHeading: "Über EHSA",
    aboutText:
      "Die European Hot Sauce Awards sind die jurierte Auszeichnung des European Heat Council für Hot Sauce und rücken die Small-Batch-Macher ins Licht, die die Kategorie in ganz Europa prägen.",
    pressContact: "Pressekontakt",
    pressOffice: "EHC Press Office, Simon Gardner, press@republicofheat.com",
    contactCta: "Kontakt aufnehmen",
  },
};
