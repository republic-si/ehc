// EHSA press-hub copy (EN/DE). Mirrors the lib/chilifest/copy.ts shape.
//
// ⚠️ DRAFT COPY — needs Simon's sign-off before this route is published.
// Facts are kept restrained and defensible (no invented dates or quotes).
// Anything marked TODO is a decision for Simon (final positioning, exact
// figures, whether to name Neil / how to frame the ROH partnership).

export type Lang = "en" | "de";

export function asLang(v: string | undefined): Lang {
  return v === "de" ? "de" : "en";
}

// Microsite scope tag for releases (kebab), matches getReleasesByCampaign()
// and the chilifest convention (campaign='berlin-chili-fest').
export const RELEASE_CAMPAIGN = "ehsa-2026";

// Press contact (see ~/ehc-press house rules).
export const PRESS_EMAIL = "press@republicofheat.com";

// TODO(Simon): paste the EHSA 2026 media-kit Google Drive folder share link
// (Anyone-with-link → Viewer) to activate the "Download press kit" button.
export const PRESS_KIT_URL = "";

interface Copy {
  eyebrow: string;
  heroTitle: string;
  heroLede: string;
  whatTitle: string;
  whatBody: string;
  statEntries: string;
  statEntriesLabel: string;
  statAwards: string;
  statAwardsLabel: string;
  releasesTitle: string;
  releasesEmpty: string;
  kitTitle: string;
  kitBody: string;
  kitButton: string;
  contactTitle: string;
  contactBody: string;
  boilerplate: string;
}

export const COPY: Record<Lang, Copy> = {
  en: {
    eyebrow: "European Heat Council · Press",
    heroTitle: "European Hot Sauce Awards 2026",
    heroLede:
      "The results, the makers, and the releases behind Europe's hot sauce awards — a press home for journalists covering the 2026 edition.",
    whatTitle: "What the awards are",
    whatBody:
      "The European Hot Sauce Awards judge independent producers from across the continent, with Gold, Silver and Bronze given per category. The European Heat Council hosts the press materials; Republic of Heat is the awards' subscription and press partner.", // TODO(Simon): confirm framing of Neil / ROH / EHC roles.
    statEntries: "nearly 400",
    statEntriesLabel: "entries judged in 2026",
    statAwards: "Gold · Silver · Bronze",
    statAwardsLabel: "awarded per category",
    releasesTitle: "Press releases",
    releasesEmpty:
      "Releases for the 2026 edition will appear here as they are published. In the meantime, contact us for the current results and maker details.",
    kitTitle: "Press kit",
    kitBody:
      "High-resolution photography, the results, and maker background are available to journalists on request.",
    kitButton: "Download press kit",
    contactTitle: "Press contact",
    contactBody: "For results, interviews, samples or images, get in touch.",
    boilerplate:
      "The European Heat Council is the trade body for Europe's chilli and hot sauce makers. It hosts press materials and coverage for industry awards and events, including the European Hot Sauce Awards.", // TODO(Simon): confirm EHC boilerplate wording.
  },
  de: {
    eyebrow: "European Heat Council · Presse",
    heroTitle: "European Hot Sauce Awards 2026",
    heroLede:
      "Die Ergebnisse, die Macher und die Pressemitteilungen hinter Europas Hot-Sauce-Awards — ein Presseportal für die Berichterstattung zur Ausgabe 2026.",
    whatTitle: "Was die Awards sind",
    whatBody:
      "Die European Hot Sauce Awards zeichnen unabhängige Hersteller aus ganz Europa aus, mit Gold, Silber und Bronze je Kategorie. Der European Heat Council stellt die Pressematerialien bereit; Republic of Heat ist Abo- und Pressepartner der Awards.", // TODO(Simon): Formulierung prüfen.
    statEntries: "fast 400",
    statEntriesLabel: "Einreichungen bewertet 2026",
    statAwards: "Gold · Silber · Bronze",
    statAwardsLabel: "je Kategorie vergeben",
    releasesTitle: "Pressemitteilungen",
    releasesEmpty:
      "Mitteilungen zur Ausgabe 2026 erscheinen hier, sobald sie veröffentlicht sind. Für aktuelle Ergebnisse und Details kontaktieren Sie uns gerne.",
    kitTitle: "Pressekit",
    kitBody:
      "Hochauflösende Fotos, die Ergebnisse und Hintergründe zu den Machern stehen Journalisten auf Anfrage zur Verfügung.",
    kitButton: "Pressekit herunterladen",
    contactTitle: "Pressekontakt",
    contactBody: "Für Ergebnisse, Interviews, Muster oder Bilder melden Sie sich.",
    boilerplate:
      "Der European Heat Council ist der Branchenverband für Europas Chili- und Hot-Sauce-Hersteller. Er stellt Pressematerialien und Berichterstattung für Branchen-Awards und Events bereit, darunter die European Hot Sauce Awards.", // TODO(Simon): Formulierung prüfen.
  },
};
