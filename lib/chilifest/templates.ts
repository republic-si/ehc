// The makers' own submissions: verbatim template text + their raw photos.
// Kept separate from the editorial card copy in makers.ts. Shown on the
// individual producer pages under "In the maker's own words".
// storyLang flags stories the maker wrote in a language other than English.

export interface MakerTemplate {
  sauceName?: string;
  heat?: string;
  story?: string;
  storyDe?: string; // German verbatim, shown on the ?lang=de site; story holds the English
  storyLang?: "en" | "de" | "pt";
  pairings?: string[];
  pairingsDe?: string[];
  allergens?: string;
  funFact?: string;
}

export const MAKER_TEMPLATES: Record<string, MakerTemplate> = {
  "harissa-co": {
    sauceName: "Smoky Artisanal Tunisian Harissa",
    heat: "3/10",
    story:
      "Every summer, my family made harissa stock from scratch in Tunisia, a family and communal tradition that meant celebrating a piece of our culinary heritage while keeping it alive. That is why the \"& Co\" in the brand name refers to the community behind the harissa-making tradition: the women who have passed this recipe and know-how down for generations, the farmers, the artisans who still smoke the Baklouti the traditional way. Our harissa is for everyone who cares about clean ingredients, misses real North African flavour in Germany, or is done with harissa that tastes like a spicy watery paste with no flavour, and is adventurous enough to try something new.",
    storyLang: "en",
    pairings: [
      "Stirred through scrambled eggs for a spicy breakfast",
      "Simmered into tomato sauce for a pasta dish upgrade",
      "Used as a marinade for meat, fish or vegetables",
    ],
    funFact: "Keep it unapologetically spicy.",
  },
  "instant-taste": {
    sauceName: "Chimichurri Crisp",
    heat: "1–2/10",
    story:
      "If chili crisp and chimichurri had a child, it would be this jar. I'm addicted to chili crisp. Not to the heat, but to the crunch, the depth, and that one spoonful that turns a good meal into a seriously good one. I love classic chimichurri, but after two days the bright green is gone and the herbs are past their best. The trick was the same as with Sichuan chili crisp: it's the hot oil that turns herbs into something you want to spoon straight from the jar. This isn't a new chimichurri. It's exactly the jar I'd been looking for, for years.",
    storyDe:
      "Wenn Chili Crisp und Chimichurri ein Kind hätten, wäre es dieses Glas. Ich bin süchtig nach Chili Crisp. Nicht nach Schärfe, aber nach Crunch, Tiefe und diesem einen Löffel, der aus einem guten Essen plötzlich ein verdammt gutes macht. Klassisches Chimichurri liebe ich, aber nach zwei Tagen ist das leuchtende Grün verschwunden und die Kräuter haben ihre beste Zeit schon hinter sich. Der Trick war derselbe wie beim Szechuan Chili Crisp: Erst das heiße Öl macht aus Kräutern etwas, das man löffeln möchte. Das hier ist kein neues Chimichurri. Es ist genau das Glas, das ich jahrelang gesucht habe.",
    pairings: [
      "Burrata, ciabatta, Chimichurri Crisp. Long day? Ready in 45 seconds.",
      "Greek yoghurt, poached eggs, Chimichurri Crisp.",
      "Cold pasta, roasted tomatoes, Chimichurri Crisp. A crowd-pleaser for any garden party.",
    ],
    pairingsDe: [
      "Burrata, Ciabatta, Chimichurri Crisp. Langer Tag? Fertig in 45 Sekunden.",
      "Griechischer Joghurt, pochierte Eier, Chimichurri Crisp.",
      "Kalte Pasta, Ofentomaten, Chimichurri Crisp. Ein Crowdpleaser für jede Gartenparty.",
    ],
    allergens: "Almonds",
  },
  "luchadoras-del-sabor": {
    sauceName: "La Quebradora (Salsa Verde)",
    heat: "1–3/10",
    story:
      "I've been cooking my own chilli sauces for a good 30 years. For my friends. For my family. For myself. For decades my friends kept telling me: 'You have to sell your sauces!' I've finally brought myself to do it. Industrial bottling is out of the question for me, I cook every sauce by hand. Alongside my hot ones, my Salsa Verde came out of my first trip to Mexico many years ago, perfect for a Sunday plate of Chilaquiles Verdes. The sauces are named after lucha libre wrestling moves.",
    storyDe:
      "Ich koche seit gut 30 Jahren meine eigenen Chilisaucen. Für meine Freunde. Für meine Familie. Für mich. Seit Jahrzehnten liegen mir meine Freunde in den Ohren: 'Du musst deine Saucen verkaufen!' Nun konnte ich mich endlich dazu überwinden. Industrielle Abfüllungen kommen für mich nicht in Frage, ich koche alle Saucen eigenhändig. Neben meinen Hot-Ones ist im Zuge meines ersten Mexiko-Aufenthaltes vor vielen Jahren meine Salsa Verde entstanden, perfekt für sonntägliche Chilaquiles Verdes. Die Saucen sind nach Lucha-Libre-Griffen benannt.",
    pairings: [
      "Chilaquiles Verdes, the classic Mexican breakfast, with cheese, red onion and crema",
      "As a snack with taquitos or papitas",
      "With scrambled eggs, for enchiladas, or just on its own. Para bañarse!",
    ],
    pairingsDe: [
      "Chilaquiles Verdes, das klassische mexikanische Frühstücksgericht, mit Käse, roten Zwiebeln und Crema",
      "Zum Snacken mit Taquitos oder Papitas",
      "Mit Rührei, für Enchiladas, oder einfach nur so. Para bañarse!",
    ],
    allergens: "None. No additives, unfiltered, handmade and hand-labeled.",
    funFact: "You could live without them. But why should you?",
  },
  "neck-dart": {
    sauceName: "Garlic Habamayo",
    heat: "2/10",
    story:
      "After an extensive search for a delicious and spicy vegan mayo, I decided to make my own. This sauce represents a bridge between fans of spiciness and those who avoid it. Truly works with any kind of food.",
    storyLang: "en",
    pairings: [
      "A spread for toasted baguette or Brötchen with your favourite cheese or charcuterie, a great addition to any cheese board",
      "Grilled or fried fish tacos with lime, a perfect pairing",
      "Linguini with grilled prawn, olive oil and black pepper, one large spoon of Habamayo tossed through",
    ],
    allergens: "Mustard, garlic",
  },
  chillipeterson: {
    sauceName: "Zpečený Indian",
    story:
      "This was the first sauce we ever made, combining different influences from Indian cookbooks, and it immediately took us off the ground. The best mild tikka-masala-based sauce you ever had: rich in flavour, smells irresistibly, very addictive. Our sauces are all made by hand, from cutting peppers to labeling bottles, all from fresh products. Our aim is to produce sauces based on taste and fire.",
    storyLang: "en",
    pairings: ["Great with meat", "In noodles or salads", "On pizza"],
    funFact:
      "I can proudly say that our sauce has attracted hundreds of new people to chilli and hot food in general.",
  },
  "marie-sharp-s": {
    sauceName: "Mango Pepper",
    heat: "2/10",
    story:
      "Created by the legendary Marie Sharp's in Belize, brought to Europe by an Ammersee-based German eco hippie named Jürgen Rahm, who spent 20 years in the tiny Caribbean country of origin. The brand is still under the leadership of the 86-year-old founder and fighter for women's rights and opportunities in Belize.",
    storyLang: "en",
    pairings: [
      "Watermelon feta salad with a few mint leaves. Sprinkle the Mango Pepper over the watermelon and be surprised what happens.",
      "Cottage or cream cheese, Mango Pepper, done",
      "A dash or two in your breakfast cereal",
    ],
    funFact:
      "On Marie Sharp's farm in Belize the mangoes can fully ripen because the processing takes place a 15-minute tractor ride from the facility.",
  },
  "ti-dodo-epice": {
    sauceName: "Compote Tamarin",
    heat: "2/10",
    story:
      "Vaanee grew up in Mauritius surrounded by its melting-pot cuisine, her mother's cooking most of all, and missed it when she moved to the Netherlands, so she started making it herself. Her Compote Tamarin began as leftovers: tamarind pulp saved from her Pima Tamarin, cooked into the same sticky compote her mum used to hide from her and her brothers.",
    storyLang: "en",
    pairings: [
      "As good on vanilla ice cream",
      "As on a cheese board",
    ],
    funFact:
      "Upcycling with flavour: the compote is made from the tamarind pulp left over from her hot Pima Tamarin sauce.",
  },
  "momo-haus": {
    sauceName: "Snakebite Chilli Oil",
    heat: "7/10",
    story:
      "At Momo Haus, every plate of momo reminded us of home, but something was always missing: the unmistakable aroma of Nepali Timur, the wild Himalayan pepper that gives Nepali food its unique citrusy, tingling character. We created Snakebite Chilli Oil to bring that feeling into every bite, so people can experience the taste of the Himalayas wherever they are. It isn't just about heat; it's about sharing a piece of Nepal, our family traditions, and the flavours we grew up with. The name Snakebite reflects the first bold kick of chilli, followed by the signature tingling sensation of Timur that keeps you reaching for more.",
    storyLang: "en",
    pairings: [
      "Steamed momo (dumplings): drizzle it over to experience the authentic Nepali flavour",
      "Fried rice or chow mein: the Timur adds a bright, citrusy depth",
      "Grilled vegetables or fried eggs: a spoonful brings warmth, crunch and a taste of the Himalayas",
    ],
    allergens: "May contain traces of sesame",
    funFact:
      "The star ingredient is Nepali Timur, a wild Himalayan pepper prized for its citrus aroma and gentle tingling sensation. Flavour first, with a satisfying 7/10 heat, not just spice for the sake of spice.",
  },
  "teig-fullung": {
    sauceName: "Crispy Chili Öl",
    heat: "4/10",
    story:
      "When I was 25, I spent a year travelling across Asia, visiting ten countries and completing more than 25 internships in hotel kitchens, restaurants and street food stalls. The crispy chili oils I discovered in Taiwan and Hong Kong stayed with me long after I returned home. Years later, while preparing for the Berlin Chili Fest, I wanted the perfect topping for my handmade German dumplings (Maultaschen), so I created my own crispy chili oil: full of flavour, crunch and balanced heat. It works brilliantly on dumplings, noodles, rice, pizza and many other dishes.",
    storyLang: "en",
    pairings: [
      "Maultaschen (German dumplings): a spoonful adds crunch, umami and just the right amount of heat",
      "Fried or scrambled eggs: turns a simple breakfast into something rich and full of flavour",
      "Pizza: drizzle over for crispy texture and a balanced chili kick without masking the toppings",
    ],
    funFact:
      "Winner of the Gold Medal at the European Hot Sauce Awards 2025.",
  },
  "yak-thai": {
    sauceName: "Namprik Sam Het",
    heat: "4–5/10",
    story:
      "Nam Prik Sam Het is inspired by a traditional Thai chili paste whose name translates to 'three mushrooms chili paste'. A beloved staple in Thai home cooking, it combines rich umami flavors with a gentle chili kick, making it incredibly versatile as a dip, spread or cooking ingredient. We produce it in Germany using fresh ingredients and traditional Thai recipes, carefully crafting each batch to deliver authentic flavor without compromise.",
    storyLang: "en",
    pairings: [
      "Stir-fried in the pan, adding to anything",
      "As a seasoning paste on the table",
    ],
    allergens: "Vegan",
    funFact:
      "We did not adjust any of our recipes to make them more 'German'. We use whatever we used in Thailand: fish sauce, shrimp paste, oyster sauce.",
  },
  "dr-john-s-hot-sauce": {
    sauceName: "Trippy Habanero Mango",
    heat: "7/10",
    story:
      "This is the one that started it all, the sauce my brother couldn't stop talking about, the one that turned a joke gift into Dr. John's. I've always been obsessed with habanero, that fruity punch hiding under the heat that most people burn away by over-processing it. I wanted to protect that flavor, not bury it, so I paired it with ripe mango to push the fruitiness even further. The result hits different: sweet, sharp, tropical, with a heat that creeps up on you almost like it's messing with your head. That's exactly why I called it Trippy.",
    storyLang: "en",
    pairings: [
      "Fried eggs: the fruit and acidity lift the egg without drowning it",
      "Pasta alla Puttanesca: heat and fruit balance the salty caper bite",
      "Pizza: adds acidity and fruit without overpowering the toppings",
    ],
    allergens: "None",
    funFact:
      "My dog is named Chili, my wife's got a chili pepper tattoo, and our hallway at home is a gallery of nothing but photos of the dog Chili and other chili-related things. At this point it's less of an obsession, more of a lifestyle.",
  },
  "julies-chili": {
    sauceName: "Yellow Habanero",
    heat: "3/10",
    story:
      "When I first moved to Germany from Congo, I quickly started missing the spice I was used to with my food. And because I wasn't able to buy anything that came even close, I decided to just make my own line of sauces. I created this yellow habanero sauce specifically for my son's friends who wanted to incorporate some spice into their lives but found the original red habanero version to be too much. According to his feedback, it was a big hit!",
    storyLang: "en",
    pairings: [
      "Chickpea salad with feta: the caramelised onion pairs well with the salt of the cheese",
      "Baked salmon: the brightness of the habanero enhances the savoury notes of the fish",
      "Mushroom omelette: gentle heat is a great kick to start the morning without coffee",
    ],
    allergens: "Vegan, natural ingredients",
  },
  "qudo-tjes": {
    sauceName: "Stormur Chili Crisp",
    heat: "2/10",
    story:
      "After years of writing software, it was literally time to spice up my work, so I turned my hobby into my craft. Stormur was inspired by my travels through Iceland, the land of ice and fire: a smoky chili crisp with apple pieces, pine nuts and smoked chipotle flakes, warm and full of flavour.",
    storyLang: "en",
    pairings: [
      "Flammkuchen with bacon and mushrooms: the chipotle enhances the smoky bacon",
      "A cheese sandwich: the creamy cheese balances the heat and the smoky crunch lifts it",
      "Stamppot, Dutch mashed potato with kale: a spoonful adds smoke, crunch and heat",
    ],
    allergens: "Soybean oil, walnut oil, wheat flour",
    funFact:
      "I'm proud I can take my company to events like Berlin Chili Fest, an eight-hour drive away. Most of the time I sleep in a tent to keep the cost down.",
  },
  "don-cabron": {
    sauceName: "Smoky-Sweet Chili Oil",
    heat: "6/10",
    story:
      "This smoky and sweet salsa is a traditional Mexican chili oil, with a deep smoky flavour from Mexican peppers. We added cranberries for a sweet touch and some seeds for a crunch. It reminds Mexicans of home, and shows the rest of the world what Mexico has to offer.",
    storyLang: "en",
    pairings: [
      "A few drops over scrambled eggs",
      "Drizzled over pasta",
      "Finish your tacos with a spoonful",
    ],
    funFact: "Absolutely proud that Mexicans love these salsas.",
  },
  "roots-radicals": {
    sauceName: "Fermented Jalapeño Hot Sauce",
    heat: "3/10",
    story:
      "Founded by Peruvian scientist and chef Mónica Kisic Aguirre, Roots Radicals transforms overlooked and imperfect ingredients into bold sauces through circular cooking. Their Fermented Jalapeño ferments the chillies for six weeks, then blends them with roasted garlic and apple cider vinegar into a simple, bold, flavourful hot sauce. The fermented chilli stems are infused in vinegar to make a bright, spicy chilli vinegar, a byproduct made to add a kick to recipes or enjoyed as a morning shot.",
    storyLang: "en",
    pairings: ["Eggs", "Beans", "Bloody Marys"],
    funFact:
      "Circular cooking with at least 40% rescued ingredients, where every byproduct gets a second life.",
  },
  chiliwerk: {
    sauceName: "Hot Honey",
    storyLang: "en",
  },
  "salsa-boy": {
    sauceName: "Salsa Boy 01",
    heat: "2/10",
    story:
      "Two weeks of fermented jalapeños and cayenne for a deep, umami-rich foundation, rounded off with fresh lime.",
    storyLang: "en",
  },
  "not-that-spicy": {
    sauceName: "Princess Passion",
    storyLang: "en",
    funFact:
      "Flavour over burn, no extracts. Three Golds at the 2026 European Hot Sauce Awards.",
  },
  moja: {
    sauceName: "Chunky Chili Oil",
    story:
      "Moja means 'delicious' and 'fun' in Bengali. Born from Maliha's Bengali roots and her life across continents, Moja blends the nostalgic flavours of home with bold flavours from abroad, creating a product that feels like home for those of us with many homes.",
    storyLang: "en",
  },
};

export const MAKER_IMAGES: Record<string, string[]> = {
  "harissa-co": [
    "/chilifest/makers/raw/harissa-co/1.jpg",
    "/chilifest/makers/raw/harissa-co/2.jpg",
  ],
  "instant-taste": ["/chilifest/makers/raw/instant-taste/1.jpg"],
  "luchadoras-del-sabor": [
    "/chilifest/makers/raw/luchadoras-del-sabor/1.jpg",
    "/chilifest/makers/raw/luchadoras-del-sabor/2.jpg",
    "/chilifest/makers/raw/luchadoras-del-sabor/3.jpg",
    "/chilifest/makers/raw/luchadoras-del-sabor/4.jpg",
  ],
  "neck-dart": ["/chilifest/makers/raw/neck-dart/1.jpg"],
  "marie-sharp-s": ["/chilifest/makers/raw/marie-sharp-s/1.jpg"],
  "momo-haus": [
    "/chilifest/makers/raw/momo-haus/1.jpg",
    "/chilifest/makers/raw/momo-haus/2.jpg",
    "/chilifest/makers/raw/momo-haus/3.jpg",
  ],
  "teig-fullung": [
    "/chilifest/makers/raw/teig-fullung/1.jpg",
    "/chilifest/makers/raw/teig-fullung/2.jpg",
  ],
  "yak-thai": [
    "/chilifest/makers/raw/yak-thai/1.jpg",
    "/chilifest/makers/raw/yak-thai/2.jpg",
    "/chilifest/makers/raw/yak-thai/3.jpg",
  ],
  "dr-john-s-hot-sauce": [
    "/chilifest/makers/raw/dr-john-s-hot-sauce/1.jpg",
    "/chilifest/makers/raw/dr-john-s-hot-sauce/2.jpg",
    "/chilifest/makers/raw/dr-john-s-hot-sauce/3.jpg",
  ],
  "julies-chili": [
    "/chilifest/makers/raw/julies-chili/1.jpg",
    "/chilifest/makers/raw/julies-chili/2.jpg",
    "/chilifest/makers/raw/julies-chili/3.jpg",
  ],
  "qudo-tjes": ["/chilifest/makers/raw/qudo-tjes/1.jpg"],
  "don-cabron": ["/chilifest/makers/raw/don-cabron/1.jpg"],
  chiliwerk: ["/chilifest/makers/raw/chiliwerk/1.jpg"],
  "republic-of-heat": [
    "/chilifest/makers/raw/republic-of-heat/1.jpg",
    "/chilifest/makers/raw/republic-of-heat/2.jpg",
  ],
};
