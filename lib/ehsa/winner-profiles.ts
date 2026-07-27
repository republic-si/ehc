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
  quote?: { text: string; attrib: string }; // verbatim; omit if not maker-approved
  find: { label: string; url: string }[];
  portrait?: string; // omit if no real maker photo available
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

  pandemonic: {
    slug: "pandemonic",
    maker: "Karol Wojciechowski",
    regionLong: {
      en: "Berlin, Germany, with the chilies grown in Poland",
      de: "Berlin, Deutschland, Chilis angebaut in Polen",
    },
    intro: {
      en: "The only producer to take two Best in Category in one year, judged blind: a Berlin chef who grows his own organic chilies on a family farm in Poland.",
      de: "Der einzige Hersteller mit zwei Kategoriesiegen in einem Jahr, blind verkostet: ein Berliner Koch, der seine Bio-Chilis auf einem Familienhof in Polen anbaut.",
    },
    story: {
      en: [
        "Pandemonic is Berlin chef Karol Wojciechowski's label, an alumnus of the city's two-Michelin-star Fischers Fritz, who grows his own organic chilies on a family farm in Poland and ships them to Berlin to ferment and bottle by hand.",
        "Small batches, a three-month natural fermentation, recipes built for flavour over Scoville. Chocoberrie and the chili oil Chili Chrisp both took Gold and Best in Category, two very different briefs from the same producer in the same year.",
      ],
      de: [
        "Pandemonic ist das Label des Berliner Kochs Karol Wojciechowski, der im Zwei-Sterne-Restaurant Fischers Fritz gekocht hat. Seine Bio-Chilis wachsen auf einem Familienhof in Polen und kommen zum Fermentieren und Abfüllen von Hand nach Berlin.",
        "Kleine Chargen, drei Monate natürliche Fermentation, Rezepte für Geschmack statt Schärferekorde. Chocoberrie und das Chiliöl Chili Chrisp holten beide Gold und Kategoriesieg, zwei sehr unterschiedliche Aufgaben vom selben Hersteller im selben Jahr.",
      ],
    },
    sauce: {
      en: "Chocoberrie is a fermented chocolate-Habanero sauce built like a restaurant pastry section: cocoa for depth, beet syrup for body, blackberry and blackcurrant for lift, with apple, red onion and sherry vinegar. Deep brown, sweet berries up front, dark cocoa underneath, the Habanero behind.",
      de: "Chocoberrie ist eine fermentierte Schokoladen-Habanero-Sauce, aufgebaut wie eine Patisserie: Kakao für Tiefe, Rote-Bete-Sirup für Körper, Brombeere und schwarze Johannisbeere für den Auftrieb, dazu Apfel, rote Zwiebel und Sherryessig. Tiefbraun, süße Beeren vorn, dunkler Kakao darunter, der Habanero dahinter.",
    },
    peppers: {
      en: "Chocolate Habanero, single-variety, organic, from Karol's family farm in Poland.",
      de: "Schokoladen-Habanero, sortenrein, biologisch, vom Familienhof in Polen.",
    },
    pairing: {
      en: "Built for cooking, not collecting.",
      de: "Zum Kochen gemacht, nicht zum Sammeln.",
    },
    find: [{ label: "pandemonic.com.pl", url: "https://pandemonic.com.pl" }],
  },

  munnvold: {
    slug: "munnvold",
    maker: "Kristoffer Vold",
    regionLong: { en: "Gamlebyen, Oslo, Norway", de: "Gamlebyen, Oslo, Norwegen" },
    intro: {
      en: "Twelve years in, from a Grønland kitchen: Best in Category against the deepest field of the year.",
      de: "Zwölf Jahre dabei, aus einer Küche in Grønland: Kategoriesieger im größten Feld des Jahres.",
    },
    story: {
      en: [
        "MUNNVOLD is Kristoffer Vold's kitchen project in Gamlebyen, Oslo: fermented, all-natural, gluten-free and vegan. It started in 2014 with a habanero sauce called Haba Nekro and launched as a brand in 2016.",
        "Stocked at Gutta på Haugen and poured into Bloody Marys at Kniven, Vaterland and Tons of Rock. Munnvold Yuzu topped the Medium Chili Sauce category, the deepest field at EHSA 2026 with 70 producers entering. Kristoffer is also a black-metal drummer, and the aesthetics and the taste are part of the same project.",
      ],
      de: [
        "MUNNVOLD ist Kristoffer Volds Küchenprojekt in Gamlebyen, Oslo: fermentiert, komplett natürlich, glutenfrei und vegan. Es begann 2014 mit einer Habanero-Sauce namens Haba Nekro und wurde 2016 als Marke gegründet.",
        "Gelistet bei Gutta på Haugen und als Bloody-Mary-Basis in Kniven, Vaterland und Tons of Rock. Munnvold Yuzu führte die Kategorie Medium Chili Sauce an, das größte Feld der EHSA 2026 mit 70 Herstellern. Kristoffer ist außerdem Black-Metal-Schlagzeuger, Ästhetik und Geschmack gehören zum selben Projekt.",
      ],
    },
    sauce: {
      en: "Munnvold Yuzu is Japanese yuzu and fermented scotch bonnet, a citrus-led build. Fresh and tangy up front, with the slow-building heat fermented scotch bonnets give.",
      de: "Munnvold Yuzu ist japanische Yuzu und fermentierte Scotch Bonnet, zitrusgeführt. Frisch und spritzig vorn, mit der langsam aufbauenden Schärfe, die fermentierte Scotch Bonnets geben.",
    },
    peppers: {
      en: "Fermented Scotch Bonnet, single-variety, with Japanese yuzu.",
      de: "Fermentierte Scotch Bonnet, sortenrein, mit japanischer Yuzu.",
    },
    pairing: {
      en: "Works on sushi and sashimi, grilled fish, oysters, fried chicken or a cucumber salad, wherever bright acidity needs a partner.",
      de: "Passt zu Sushi und Sashimi, gegrilltem Fisch, Austern, Fried Chicken oder Gurkensalat, überall wo helle Säure einen Partner braucht.",
    },
    quote: {
      text: "Honestly still speechless. MUNNVOLD started in 2014 with a habanero sauce called Haba Nekro, ran out of a Grønland kitchen, and 1st place in a blind European panel is hard to take in. Massive thanks to Gutta på Haugen, Kniven, Vaterland, Tons of Rock and everyone who put the sauce on a shelf or in a Bloody Mary.",
      attrib: "Kristoffer Vold, MUNNVOLD",
    },
    find: [{ label: "munnvold.no", url: "https://munnvold.no" }],
    portrait: "/ehsa/winners/munnvold/portrait.jpg",
  },

  spicepunk: {
    slug: "spicepunk",
    maker: "Marcus Pitschke & Mirjam Vogler",
    regionLong: { en: "Sursee, Canton Lucerne, Switzerland", de: "Sursee, Kanton Luzern, Schweiz" },
    intro: {
      en: "Europe's best Mild, from a small kitchen in Lucerne's cheese country, topping a 44-sauce field.",
      de: "Europas beste milde Sauce, aus einer kleinen Küche im Luzerner Käseland, an der Spitze eines Feldes von 44 Saucen.",
    },
    story: {
      en: [
        "Spicepunk is Marcus Pitschke and Mirjam Vogler's small-kitchen label in Sursee, built around character rather than heat-chasing. Original recipes, top-quality ingredients, finished by hand in small batches.",
        "Peach Riot took Gold and Best in Category in Mild Chili Sauce, topping a 44-strong field. A second Spicepunk sauce, Red Dynasty, added a Bronze in the same category.",
      ],
      de: [
        "Spicepunk ist das Kleinküchen-Label von Marcus Pitschke und Mirjam Vogler in Sursee, gebaut auf Charakter statt Schärfejagd. Eigene Rezepte, Zutaten in Top-Qualität, von Hand in kleinen Chargen fertiggestellt.",
        "Peach Riot holte Gold und Kategoriesieg bei Mild Chili Sauce, an der Spitze eines Feldes von 44 Saucen. Eine zweite Spicepunk-Sauce, Red Dynasty, kam in derselben Kategorie auf Bronze.",
      ],
    },
    sauce: {
      en: "Peach Riot is peach, mango and habanero, a fruity-mild take on the category. Fruit sweetness opens up front, the habanero builds gently behind it, and a clean tropical finish ties it together.",
      de: "Peach Riot ist Pfirsich, Mango und Habanero, eine fruchtig-milde Lesart der Kategorie. Fruchtsüße vorn, der Habanero baut sanft dahinter auf, ein klarer tropischer Abgang bindet alles zusammen.",
    },
    peppers: {
      en: "Habanero, single-variety, with peach and mango.",
      de: "Habanero, sortenrein, mit Pfirsich und Mango.",
    },
    pairing: {
      en: "Pulls double duty across a cheese plate, summer salads, tacos and bowls, even breakfast eggs.",
      de: "Macht doppelte Arbeit auf der Käseplatte, in Sommersalaten, Tacos und Bowls, sogar zu Frühstückseiern.",
    },
    quote: {
      text: "Honestly still speechless. Spicepunk runs out of a small kitchen in Sursee, by hand, in small batches, and taking 1st place in a blind European panel is hard to take in. Massive thanks to everyone who's been with us on this.",
      attrib: "Marcus Pitschke, Spicepunk",
    },
    find: [{ label: "spicepunk.ch", url: "https://spicepunk.ch" }],
    portrait: "/ehsa/winners/spicepunk/portrait.png",
  },
};

export function getProfile(slug: string): WinnerProfile | null {
  return PROFILES[slug] ?? null;
}

export const PROFILE_SLUGS = Object.keys(PROFILES);
