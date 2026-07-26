// Deep profiles for the /ehsa/winners/[slug] pages. Every field traces to the
// verified press kit: the signed-off release (release-EN.txt) and the maker's
// own words (MAKER_FEEDBACK.md). No invented sauce notes; where a fact is not
// disclosed (e.g. chili variety), we say so. Maker quotes stay verbatim.

export interface ProfileT {
  en: string;
  de: string;
}

export interface WinnerProfile {
  slug: string;
  maker: string; // the person behind it
  regionLong: ProfileT;
  intro: ProfileT;
  story: { en: string[]; de: string[] };
  sauce: ProfileT;
  peppers: ProfileT; // ingredient/pepper note, evidence-based
  pairing: ProfileT;
  quote: { text: string; attrib: string }; // verbatim, maker's own words
  find: { label: string; url: string }[];
  portrait: string;
}

export const PROFILES: Record<string, WinnerProfile> = {
  ornitodrinko: {
    slug: "ornitodrinko",
    maker: "Roberto Colnaghi",
    regionLong: {
      en: "Brembate, in the province of Bergamo, northern Italy",
      de: "Brembate, Provinz Bergamo, Norditalien",
    },
    intro: {
      en: "A first-year kitchen project that took Gold in one of the hardest categories the awards run, first time out.",
      de: "Ein Küchenprojekt im ersten Jahr, das auf Anhieb Gold in einer der härtesten Kategorien holte.",
    },
    story: {
      en: [
        "Ornitodrinko is Roberto Colnaghi's own kitchen project in Brembate, built around fermentation rather than heat-chasing. Chilies grown from seed in Lombardy soil, fermented over weeks, bottled by hand in small batches.",
        "It is early days: a growing range of sauces still in development, no shop or website yet, and Instagram as the only public channel. Which makes a Gold, first time out, in the BBQ Chili Sauce category all the more striking.",
      ],
      de: [
        "Ornitodrinko ist Roberto Colnaghis eigenes Küchenprojekt in Brembate, das auf Fermentation setzt statt auf reine Schärfe. Chilis aus eigenem Saatgut in lombardischer Erde, über Wochen fermentiert, von Hand in kleinen Chargen abgefüllt.",
        "Es ist ein früher Anfang: eine wachsende Reihe von Saucen in Entwicklung, noch kein Shop, keine Website, Instagram als einziger öffentlicher Kanal. Umso bemerkenswerter ist ein Gold auf Anhieb in der Kategorie BBQ Chili Sauce.",
      ],
    },
    sauce: {
      en: "Smoked Ananas BBQ is smoked pineapple and fermented chili: sweet and smoky up front, with the acidity long fermentation gives it. A tropical-meets-grill take that pushes BBQ well beyond the ketchup-and-sugar version.",
      de: "Smoked Ananas BBQ ist geräucherte Ananas und fermentierter Chili: vorne süß und rauchig, mit der Säure, die lange Fermentation mitbringt. Eine tropisch-gegrillte Lesart, die BBQ weit über die Ketchup-und-Zucker-Variante hinausführt.",
    },
    peppers: {
      en: "Chili grown and fermented from Roberto's own seed. The variety is not publicly disclosed.",
      de: "Chili aus Robertos eigenem Saatgut, angebaut und fermentiert. Die Sorte wird nicht öffentlich genannt.",
    },
    pairing: {
      en: "Made for grilled meats, burgers and BBQ.",
      de: "Gemacht für Gegrilltes, Burger und BBQ.",
    },
    quote: {
      text: "We grow, ferment and bottle everything ourselves, starting from the seed, so seeing this process recognized at a European level is incredible. Ornitodrinko has always been about patience, experimentation and real craft across a growing range of sauces, and this result means a lot to us.",
      attrib: "Roberto Colnaghi, Ornitodrinko",
    },
    find: [{ label: "Instagram @ornitodrinko", url: "https://instagram.com/ornitodrinko" }],
    portrait: "/ehsa/winners/ornitodrinko/portrait.jpg",
  },
};

export function getProfile(slug: string): WinnerProfile | null {
  return PROFILES[slug] ?? null;
}

export const PROFILE_SLUGS = Object.keys(PROFILES);
