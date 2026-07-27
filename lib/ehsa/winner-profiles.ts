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
  pairing?: ProfileT;
  quote?: { text: string; attrib: string }; // verbatim; omit if not maker-approved
  find: { label: string; url: string }[];
  portrait?: string; // omit if no real maker photo available
  portraitPos?: string; // object-position for the portrait crop; default "center"
  coverageSlug?: string; // pickups.maker_slug if it differs from the winner slug
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

  pohorc: {
    slug: "pohorc",
    maker: "Denis Ledinek",
    regionLong: {
      en: "Šentjanža hills near Dravograd, Koroška, Slovenia",
      de: "Šentjanža-Hügel bei Dravograd, Koroška, Slowenien",
    },
    intro: {
      en: "The only certified-organic Slovenian hot honey on the market, from a family farm certified organic for over twenty years.",
      de: "Der einzige zertifiziert biologische slowenische Hot Honey am Markt, von einem seit über zwanzig Jahren biozertifizierten Familienhof.",
    },
    story: {
      en: [
        "POHORC BIO CHILI is a certified-organic family farm in the Šentjanža hills near Dravograd, run by Denis Ledinek. The chili work started with twelve pepper seedlings, a birthday gift from Denis's brother, and now runs to roughly five hundred plants a season in the greenhouse.",
        "Hand-bottled and small-batch, every plant named from germination to fruit. Hot Honey is built on the village apiary's organic honey and Denis's grandfather's hazelnut vinegar from the family land, the only certified-organic Slovenian hot honey on the market.",
      ],
      de: [
        "POHORC BIO CHILI ist ein biozertifizierter Familienhof in den Šentjanža-Hügeln bei Dravograd, geführt von Denis Ledinek. Die Chili-Arbeit begann mit zwölf Pflänzchen, einem Geburtstagsgeschenk von Denis' Bruder, und umfasst heute rund fünfhundert Pflanzen pro Saison im Gewächshaus.",
        "Von Hand abgefüllt, in kleinen Chargen, jede Pflanze von der Keimung bis zur Frucht benannt. Hot Honey basiert auf dem Bio-Honig der Dorfimkerei und dem Haselnussessig von Denis' Großvater vom eigenen Land, der einzige zertifiziert biologische slowenische Hot Honey am Markt.",
      ],
    },
    sauce: {
      en: "Hot Honey is organic Slovenian honey from the village beehives, apple cider vinegar drawn from Denis's grandfather's old wild hazelnut tree, chili and spices stirred through and infused for several days. Floral and runny on the pour, gentle sweetness up front with the heat building through the back.",
      de: "Hot Honey ist biologischer slowenischer Honig aus den Dorfbienenstöcken, Apfelessig vom alten wilden Haselnussbaum von Denis' Großvater, Chili und Gewürze eingerührt und mehrere Tage infundiert. Blumig und flüssig beim Ausgießen, sanfte Süße vorn, die Schärfe baut sich nach hinten auf.",
    },
    peppers: {
      en: "Chili and spices infused into organic Slovenian honey; the chili variety is not named.",
      de: "Chili und Gewürze, infundiert in biologischen slowenischen Honig; die Chilisorte wird nicht genannt.",
    },
    pairing: {
      en: "Runny and pourable, made to go on everything.",
      de: "Flüssig und gießbar, für alles gemacht.",
    },
    quote: {
      text: "We've put Slovenia firmly on the European chili map. What started in a small boutique kitchen on our family organic farm Ržen, driven by passion, bold ideas, and our own handcrafted recipes, grew into something far bigger. This victory belongs to the entire team that poured its energy, talent, and heart into every jar.",
      attrib: "Denis Ledinek, Pohorc Bio Chili",
    },
    find: [{ label: "cilipohorc.com", url: "https://cilipohorc.com" }],
    portrait: "/ehsa/winners/pohorc/portrait.jpg",
  },

  gaston: {
    slug: "gaston",
    maker: "Radovan Fron",
    regionLong: { en: "Ostrava, Czech Republic", de: "Ostrava, Tschechien" },
    intro: {
      en: "Four medals across four categories from a husband-and-wife kitchen, led by a Depeche Mode tribute in cuttlefish ink.",
      de: "Vier Medaillen in vier Kategorien aus einer Küche von zweien, angeführt von einer Depeche-Mode-Hommage in Tintenfischtinte.",
    },
    story: {
      en: [
        "Gaston Chilli is a craft kitchen in Ostrava run by Radovan Fron and his wife, every bottle passing through Radovan's hands. The chillies are grown for the kitchen by a family-run nursery on the city's outskirts.",
        "Four placements across Freestyle, Extra Hot, Asian Style and Mild, from one kitchen reading four very different briefs. DEAD MORUGA took Best in Category in Freestyle.",
      ],
      de: [
        "Gaston Chilli ist eine Handwerksküche in Ostrava, geführt von Radovan Fron und seiner Frau, jede Flasche geht durch Radovans Hände. Die Chilis werden von einer Familiengärtnerei am Stadtrand exklusiv für die Küche angebaut.",
        "Vier Platzierungen in Freestyle, Extra Hot, Asian Style und Mild, aus einer Küche, die vier sehr unterschiedliche Aufgaben liest. DEAD MORUGA holte den Kategoriesieg im Freestyle.",
      ],
    },
    sauce: {
      en: "DEAD MORUGA is Radovan's tribute to Depeche Mode, built to be black like a proper DM record: blueberries and cuttlefish ink darken the base, with Moruga peppers carrying the heat. Marine umami and dark fruit under the Moruga, a profile you do not see on the shelf.",
      de: "DEAD MORUGA ist Radovans Hommage an Depeche Mode, schwarz gebaut wie eine echte DM-Platte: Blaubeeren und Tintenfischtinte färben die Basis dunkel, Moruga-Chilis tragen die Schärfe. Maritimes Umami und dunkle Frucht unter dem Moruga, ein Profil, das man im Regal nicht sieht.",
    },
    peppers: {
      en: "Trinidad Moruga Scorpion, with blueberries and cuttlefish ink.",
      de: "Trinidad Moruga Scorpion, mit Blaubeeren und Tintenfischtinte.",
    },
    quote: {
      text: "We are thrilled that a small producer from Ostrava like us has succeeded against competitors from all over the continent. Handmade production, quality ingredients, and our own original recipes have helped us win four awards.",
      attrib: "Radovan Fron, Gaston Chilli",
    },
    find: [{ label: "gastonchilli.cz", url: "https://gastonchilli.cz" }],
    portrait: "/ehsa/winners/gaston/portrait.jpg",
    coverageSlug: "gaston-chilli",
  },

  hotzeg: {
    slug: "hotzeg",
    maker: "Vlad Rojnik & family",
    regionLong: { en: "Uccle, Brussels, Belgium", de: "Uccle, Brüssel, Belgien" },
    intro: {
      en: "Two Golds and a Bronze across three categories, from a family kitchen growing its own chilies in the city.",
      de: "Zwei Gold und eine Bronze in drei Kategorien, aus einer Familienküche, die ihre Chilis mitten in der Stadt anbaut.",
    },
    story: {
      en: [
        "HotZeg is a small-batch family kitchen in Uccle, Brussels, run by Vlad Rojnik and his family, growing its own chilies in-house and sourcing the rest from Belgian organic farms.",
        "Three sauces, three medals: CHEE-LY took Best in Category in Asian Style, ADIXION took Gold in Sweet and #6 in Europe's Top 10 overall, and KIKEBICHE a Bronze in Mild, all built without leaving the city.",
      ],
      de: [
        "HotZeg ist eine Small-Batch-Familienküche in Uccle, Brüssel, geführt von Vlad Rojnik und seiner Familie, mit eigenen Chilis aus dem Anbau im Haus und dem Rest von belgischen Biohöfen.",
        "Drei Saucen, drei Medaillen: CHEE-LY holte den Kategoriesieg bei Asian Style, ADIXION Gold bei Sweet und Platz 6 in Europas Top 10, KIKEBICHE Bronze bei Mild, alles gebaut, ohne die Stadt zu verlassen.",
      ],
    },
    sauce: {
      en: "CHEE-LY is lychee folded into chili with a build of Asian aromatics, umami carrying through floral notes. Designed to cross multiple Asian cuisines rather than sit in one.",
      de: "CHEE-LY ist Litschi, in Chili eingefaltet, mit einem Aufbau asiatischer Aromatik, Umami trägt durch florale Noten. Gemacht, um mehrere asiatische Küchen zu überspannen, statt in einer zu sitzen.",
    },
    peppers: {
      en: "Habanero, single-variety, with lychee (23%), ginger and miso.",
      de: "Habanero, sortenrein, mit Litschi (23%), Ingwer und Miso.",
    },
    quote: {
      text: "We started HotZeg with one goal, prove to ourselves that we could make tasty hot sauces with natural ingredients only and keep the pleasure hand in hand with spiciness.",
      attrib: "Vlad, HotZeg",
    },
    find: [{ label: "Instagram @hotzeg.bxl", url: "https://instagram.com/hotzeg.bxl" }],
    portrait: "/ehsa/winners/hotzeg/portrait.jpg",
    portraitPos: "25% center",
  },

  svilis: {
    slug: "svilis",
    maker: "Jānis Svilis",
    regionLong: { en: "Augšligatne, Cēsis, Latvia", de: "Augšligatne, Cēsis, Lettland" },
    intro: {
      en: "One of Latvia's largest chili farms, growing everything it bottles.",
      de: "Einer der größten Chilihöfe Lettlands, der alles selbst anbaut, was er abfüllt.",
    },
    story: {
      en: [
        "Svilis Pepper Farm is one of Latvia's largest chili farms, founded by Jānis Svilis after he realised Latvia needed wider availability of chili peppers. From a home kitchen in Riga's Andrejsala, it scaled to a full farm in the Līgatne area where visitors can tour the production and taste the range.",
        "Latvian-grown chillies processed into sauces, spicy jams and pickles, the produce at the centre of the operation. Garlic Chilli took Gold and Best in Category, with two further placings from the same farm.",
      ],
      de: [
        "Svilis Pepper Farm ist einer der größten Chilihöfe Lettlands, gegründet von Jānis Svilis, nachdem er erkannte, dass Lettland Chili breiter verfügbar machen musste. Aus einer Heimküche in Rigas Andrejsala wuchs er zu einem Hof im Līgatne-Gebiet, wo Besucher die Produktion sehen und die Range verkosten können.",
        "In Lettland angebaute Chilis, verarbeitet zu Saucen, scharfen Konfitüren und Pickles, das eigene Erzeugnis im Zentrum. Garlic Chilli holte Gold und Kategoriesieg, dazu zwei weitere Platzierungen vom selben Hof.",
      ],
    },
    sauce: {
      en: "Garlic Chilli is a four-chili flavour bouquet built around a heavy garlic content, around 50% of the sauce is garlic, including Espelette and other hot varieties. Mild-to-medium heat.",
      de: "Garlic Chilli ist ein Aromabouquet aus vier Chilis rund um einen hohen Knoblauchanteil, etwa 50% der Sauce sind Knoblauch, darunter Espelette und weitere scharfe Sorten. Milde bis mittlere Schärfe.",
    },
    peppers: {
      en: "Espelette and other hot varieties, with around 50% garlic.",
      de: "Espelette und weitere scharfe Sorten, mit rund 50% Knoblauch.",
    },
    pairing: {
      en: "Pairs with pasta, garlic bread, pizza, roasted potatoes, grilled meat and eggs.",
      de: "Passt zu Pasta, Knoblauchbrot, Pizza, Röstkartoffeln, Gegrilltem und Eiern.",
    },
    quote: {
      text: "Happy to hear our sauce won European Hot Sauce Awards in the garlic chili type sauce category. The award means to us that we are doing something right, and it motivates us to grow forward and make more delicious products. Also, it's nice to become recognisable in the European chili world. Stay Spicy!",
      attrib: "Jānis Svilis, Svilis Pepper Farm",
    },
    find: [],
  },

  filfla: {
    slug: "filfla",
    maker: "Malcolm Ricci",
    regionLong: { en: "Malta", de: "Malta" },
    intro: {
      en: "A Maltese kitchen that reads its chili paste as an olive tapenade, and topped the category.",
      de: "Eine maltesische Küche, die ihre Chilipaste als Oliventapenade liest, und die Kategorie anführte.",
    },
    story: {
      en: [
        "Filfla Chilli Co. is a craft Maltese kitchen run by Malcolm Ricci, built around Mediterranean and Maltese ingredients: sun-dried tomatoes, olives, oranges, carob syrup and extra virgin olive oil. It is named after the small island south of Malta.",
        "Three placements in 2026: Gold and Best in Category in Chili Paste with BUWĠI, plus silver and bronze in Sambal, Chutney and Pickles.",
      ],
      de: [
        "Filfla Chilli Co. ist eine handwerkliche maltesische Küche von Malcolm Ricci, gebaut auf mediterrane und maltesische Zutaten: sonnengetrocknete Tomaten, Oliven, Orangen, Johannisbrotsirup und natives Olivenöl extra. Benannt nach der kleinen Insel südlich von Malta.",
        "Drei Platzierungen 2026: Gold und Kategoriesieg bei Chili Paste mit BUWĠI, dazu Silber und Bronze bei Sambal, Chutney und Pickles.",
      ],
    },
    sauce: {
      en: "BUWĠI is a Maltese chili paste built off green and kalamata olives, sultanas, green chillies and extra virgin olive oil, gently heated and blended by hand. An olive-tapenade backbone with the chili layered through.",
      de: "BUWĠI ist eine maltesische Chilipaste aus grünen und Kalamata-Oliven, Sultaninen, grünen Chilis und nativem Olivenöl extra, sanft erhitzt und von Hand gemixt. Ein Oliven-Tapenade-Rückgrat mit durchgezogenem Chili.",
    },
    peppers: {
      en: "Green chillies, layered through an olive-tapenade base.",
      de: "Grüne Chilis, durch eine Oliven-Tapenade-Basis gezogen.",
    },
    pairing: {
      en: "Works on bruschetta, grilled fish, lamb plates and the Maltese ftira platter.",
      de: "Passt zu Bruschetta, gegrilltem Fisch, Lamm und der maltesischen Ftira-Platte.",
    },
    quote: {
      text: "We are incredibly proud of this. BUWĠI is a Maltese chili paste, with green and kalamata olives, sultanas, green chillies and extra virgin olive oil. I wanted to create my own version of an olive tapenade, with the sultanas added to bring in a sweet element.",
      attrib: "Malcolm Ricci, Filfla Chilli Co.",
    },
    find: [],
    portrait: "/ehsa/winners/filfla/portrait.jpg",
  },

  "de-vergulde-tong": {
    slug: "de-vergulde-tong",
    maker: "Albert",
    regionLong: {
      en: "Volendam, North Holland, Netherlands",
      de: "Volendam, Nordholland, Niederlande",
    },
    intro: {
      en: "A one-person sambal kitchen with a recipe traced back to 1960s Indonesian sailors.",
      de: "Eine Ein-Personen-Sambal-Küche mit einem Rezept, das auf indonesische Seeleute der 1960er zurückgeht.",
    },
    story: {
      en: [
        "De Vergulde Tong, Dutch for The Gilded Tongue, is a one-person sambal kitchen run by Albert in Volendam. Production is deliberately small, sixty jars made by hand over four hours per batch, no shortcuts on ingredients.",
        "Milde sambal van koksmaat Kees took Gold and Best in Category. The recipe came from Albert's old colleague Kees, now 84, who learned to make sambal in the 1960s from Indonesian colleagues on board ship. The jar honours Kees on the label.",
      ],
      de: [
        "De Vergulde Tong, niederländisch für Die Vergoldete Zunge, ist eine Ein-Personen-Sambal-Küche von Albert in Volendam. Die Produktion ist bewusst klein, sechzig Gläser von Hand in rund vier Stunden pro Charge, keine Kompromisse bei den Zutaten.",
        "Milde sambal van koksmaat Kees holte Gold und Kategoriesieg. Das Rezept stammt von Alberts altem Kollegen Kees, heute 84, der das Sambal-Machen in den 1960ern von indonesischen Kollegen an Bord lernte. Das Etikett ehrt Kees.",
      ],
    },
    sauce: {
      en: "Milde sambal van koksmaat Kees is a mild sambal built on fresh Spanish peppers from the Westland greenhouse region. It leads with the pepper itself, the heat dialled back so it sits comfortably on rice, satay or eggs without taking over.",
      de: "Milde sambal van koksmaat Kees ist ein mildes Sambal aus frischen spanischen Paprika aus dem Westland-Gewächshausgebiet. Es führt mit der Paprika selbst, die Schärfe zurückgenommen, damit es auf Reis, Satay oder Eiern sitzt, ohne zu übernehmen.",
    },
    peppers: {
      en: "Fresh Spanish peppers, sourced through Westlandpeppers.",
      de: "Frische spanische Paprika, bezogen über Westlandpeppers.",
    },
    pairing: {
      en: "Sits comfortably on rice, satay or eggs.",
      de: "Passt zu Reis, Satay oder Eiern.",
    },
    quote: {
      text: "I am really proud and honored that, in a blind tasting competition, expert European judges and makers within the European hot sauce community have rated my mild sambal as overall winner in the category sambal, chutney and pickles. Thank you so much!",
      attrib: "Albert, De Vergulde Tong",
    },
    find: [{ label: "deverguldetong.nl", url: "https://deverguldetong.nl" }],
    portrait: "/ehsa/winners/de-vergulde-tong/portrait.jpg",
  },
};

export function getProfile(slug: string): WinnerProfile | null {
  return PROFILES[slug] ?? null;
}

export const PROFILE_SLUGS = Object.keys(PROFILES);
