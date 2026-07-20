// German (native recompose, not translation) of the 19 maker stories + angles.
// Keyed by maker id; the makers page / teaser pick this when lang === "de".
// Names, flagships and locations stay as in makers.ts.

export interface MakerDe {
  story: string;
  angles: string[];
}

export const MAKERS_DE: Record<string, MakerDe> = {
  "instant-taste": {
    story:
      "Eine Österreicherin in Berlin nahm sich Argentiniens Chimichurri vor, die grüne Kräutersauce, über die dort gestritten wird, und machte sie knusprig: ein Chiliöl, das man für den Geschmack löffelt, nicht für die Schärfe.",
    angles: [
      "Eine Österreicherin in Berlin, die Argentiniens Chimichurri ins Glas bringt.",
      "Der Boom der knusprigen Chiliöle, hier kräuterbetont und mild für die Geschmacksfraktion.",
      "Ein löffelbares Öl, gebaut für Textur und Geschmack statt Schärfe. Enthält Mandeln.",
    ],
  },
  "luchadoras-del-sabor": {
    story:
      "Dreißig Jahre lang machte ein in Wien geborener Neuköllner Koch Salsa nur für Freunde, die ihm sagten, er solle sie verkaufen. Jetzt tut er es: drei Salsas, jede nach einem Wurfgriff des Lucha Libre benannt.",
    angles: [
      "Ein in Wien geborener, seit Jahrzehnten in Neukölln lebender Koch, der endlich die Salsas abfüllt, die er für Freunde machte.",
      "Lucha-Libre-Branding auf authentischer Salsa im Oaxaca-Stil: Geschichte und Optik in einem.",
      "La Quebradora, eine frische Tomatillo-Salsa verde bei 1–3, die milde eines Dreier-Teams.",
    ],
  },
  "neck-dart": {
    story:
      "Ein Berliner Sommelier begann im Lockdown, Habaneros zu fermentieren, und holt heute Medaillen bei den European Hot Sauce Awards. Seine mildeste Flasche, eine vegane Knoblauch-Chili-Mayo, soll genau die überzeugen, die am Tisch behaupten, Hot Sauce zu hassen.",
    angles: [
      "Ein Berliner Sommelier, der im Lockdown anfing, Habaneros zu fermentieren.",
      "Lebendig fermentierte, unpasteurisierte Saucen auf der Welle der Darmgesundheit.",
      "Garlic Habamayo, eine vegane Chili-Mayo bei 2/10, die Schärfe-Fans und -Muffel verbindet.",
    ],
  },
  "queima-beicas": {
    story:
      "Madeira ist für Likörwein bekannt, nicht für Chili. Francisco Silva füllt die Insel trotzdem ab: Saucen aus Guave und Zuckerrohrhonig, bei denen zuerst die Frucht kommt und die Schärfe erst am Ende grüßt.",
    angles: [
      "Ein junger Macher, der Madeiras eigene Speisekammer abfüllt, von Guave bis Zuckerrohrhonig.",
      "Fruchtbetonte Saucen, bei denen der Geschmack führt und die Schärfe folgt, für Abenteuerlustige, nicht für Masochisten.",
      "Goiaba, eine Guaven-Sauce bei 1/10, zu Käse oder gegrilltem Schwein.",
    ],
  },
  chillipeterson: {
    story:
      "In der tschechischen Stahlstadt Ostrava füllt Petr Schejbal Chilisauce ganz ohne Konservierungsstoffe ab. Seine allererste, die rauchige „Zpečený Indián“, wurde beim Mechov-Chilifestival zum Produkt des Jahres gewählt.",
    angles: [
      "Ein Macher aus Ostrava, der seit 2020 konservierungsstofffreie Chilisauce abfüllt.",
      "Mitteleuropäisches Chili-Handwerk, ein Preisträger aus dem tschechischen Stahlgürtel.",
      "„Zpečený Indián“, eine milde, rauchige Sauce im Tikka-Stil, seine erste und ein Festival-Produkt des Jahres.",
    ],
  },
  "marie-sharp-s": {
    story:
      "Marie Sharp machte sich in Belize einen Namen, indem sie den Essig in der Flasche durch Karotten ersetzte. Ihre deutschen Fürsprecher bringen die Mango-Variante, die sanfteste der Reihe, nach Berlin.",
    angles: [
      "Ein deutscher Importeur, der sich für Marie Sharp's einsetzt, die belizische Marke, die Essig durch Karotten tauschte.",
      "Eine Traditionsmarken-Geschichte: Karotte und Habanero als die ursprüngliche geschmacksbetonte Hot Sauce.",
      "Mango Pepper bei 2/10, mild genug für Wassermelonensalat oder das Frühstücksmüsli.",
    ],
  },
  chiliwerk: {
    story:
      "Ein Berliner Macher, der mit seiner gerösteten Zitronen-Habanero-Sauce EHSA-Silber 2025 holte, will hier mit etwas Sanfterem vorangehen: einem Hot Honey.",
    angles: [
      "Ein Berliner Macher, der von zitrusmild bis Carolina Reaper reicht und mit der sanfteren Idee führt.",
      "Hot Honey, das Crossover-Condiment, das aus dem Chili-Regal ausbricht.",
      "Ein Hot Honey zum Einstieg und die EHSA-Silber-Zitrone-Habanero fürs Schärfe-Ressort.",
    ],
  },
  "don-cabron": {
    story:
      "Eine nordmexikanische Köchin füllt von den Niederlanden aus die regionalen Salsas ihrer Familie ab und bringt Salsa Macha, Mexikos knuspriges Chiliöl, nach Europa, genau zur richtigen Zeit.",
    angles: [
      "Eine nordmexikanische Köchin, die von den Niederlanden aus die regionalen Salsas ihrer Familie abfüllt.",
      "Salsa Macha, Mexikos knuspriges Chiliöl, das in Europa ankommt, während es gerade durchstartet.",
      "Eine knusprige Salsa Macha als Bestseller, für die Knusperöl-Fraktion.",
    ],
  },
  moja: {
    story:
      "Ein Berliner Chiliöl, das bengalische Gewürze mit, in den Worten der Macherin, sierra-leonischer Seele verbindet, von Hand gemacht von einer Reisejournalistin, die sich durch mehr als hundert Länder gegessen hat.",
    angles: [
      "Eine Reisejournalistin, die sich durch über 100 Länder gegessen hat und jetzt in Berlin abfüllt.",
      "Knuspriges Chiliöl und Diaspora-Geschmack: bengalische Gewürze treffen sierra-leonischen Einfluss.",
      "Ein veganes, stückiges Chiliöl in den Varianten Original, Hotter und Mango.",
    ],
  },
  "not-that-spicy": {
    story:
      "Der Name ist das Versprechen: Geschmack vor Schärfe, keine Extrakte. Dieser Berliner Macher holte bei den European Hot Sauce Awards 2026 gerade drei Goldmedaillen, um es zu untermauern.",
    angles: [
      "Ein Berliner Macher, der seine ganze Philosophie in den Markennamen packte.",
      "Geschmack vor Schärfe, keine Extrakte: die Anti-Superhot-Bewegung, mit drei Gold 2026.",
      "Princess Passion, eine geschmacksbetonte Sauce, gebaut für Genuss, nicht für Strafe.",
    ],
  },
  "qudo-tjes": {
    story:
      "Ein niederländischer Softwareentwickler ließ den Bildschirm hinter sich, um Hot Sauce von Hand zu machen. Seine nach Stürmen benannten Chili-Crisps holten bei den European Hot Sauce Awards 2026 zwei Silbermedaillen.",
    angles: [
      "Ein Softwareentwickler, der den Bildschirm aufgab, um Hot Sauce von Hand zu machen.",
      "Chili Crisp, die Kategorie, der alle nachjagen, mit zwei EHSA-Silber 2026.",
      "Stormur, ein Chili Crisp, der mit Geschmack führt und mild genug bleibt.",
    ],
  },
  "ti-dodo-epice": {
    story:
      "Vaanee wuchs auf Mauritius auf und vermisste die Küche ihrer Mutter, als sie in die Niederlande zog, also brachte sie sie sich selbst bei. Ihre Compote Tamarin begann als Rest: das Tamarindenmark, das von einer schärferen Sauce übrig blieb, eingekocht zu jenem süßen, klebrigen Kompott, das ihre Mutter einst vor ihr und ihren Brüdern verstecken musste.",
    angles: [
      "Eine mauritische Köchin in den Niederlanden, die die Saucen und Pickles abfüllt, die zu Hause zu jedem Gericht gehörten.",
      "Upcycling mit Geschmack: Das Kompott entsteht aus dem Tamarindenmark, das von ihrer schärferen Pima-Tamarin-Sauce übrig bleibt.",
      "Compote Tamarin bei 2/10, süß, klebrig und würzig mit Chili-Abgang, auf Vanilleeis so gut wie auf dem Käsebrett.",
    ],
  },
  "momo-haus": {
    story:
      "Jeder Teller Momo in diesem Berliner Restaurant schmeckte nach Heimat, bis auf eine Sache: den wilden Himalaya-Timur-Pfeffer. Biplav Dahal füllte ihn als Snakebite Chilli Oil ab, erst ein Chili-Kick, dann das zitrische Prickeln Nepals, das einen immer wieder zugreifen lässt.",
    angles: [
      "Ein Berliner Momo-Restaurant, das den Himalaya-Timur-Pfeffer abfüllt, der sein Essen nach Heimat schmecken ließ.",
      "Timur, der zitrisch prickelnde Himalaya-Verwandte des Sichuanpfeffers, auf dem Weg aus nepalesischen Küchen ins Regal.",
      "Snakebite Chilli Oil bei 7/10: erst der Chili-Kick, dann das betäubende Zitrusspiel des Timur.",
    ],
  },
  "teig-fullung": {
    story:
      "Ein schwäbischer Koch kochte sich ein Jahr lang durch asiatische Restaurants und kam süchtig nach taiwanesischem Crispy Chili Oil zurück. Er baute sein eigenes, um die Maultaschen seiner Familie zu krönen.",
    angles: [
      "Ein schwäbischer Koch, der in asiatischen Küchen hospitierte und ein Chiliöl für die eigenen Maultaschen baute.",
      "Crispy Chili Oil, das Format der Stunde, von einem deutschen Macher und kein Import.",
      "Crispy Chili Öl bei 4/10, gemacht, um einen Teller handgemachter Maultaschen zu heben.",
    ],
  },
  "harissa-co": {
    story:
      "Eine in Berlin lebende tunesische Ingenieurin machte aus dem Rezept ihrer Großmutter ein Unternehmen, das auf einer einzigen Harissa steht: alte Baklouti-Chilisorten, über zwölf Stunden über Olivenholz geräuchert.",
    angles: [
      "Eine in Berlin lebende tunesische Ingenieurin, die auf dem Rezept ihrer Großmutter ein Unternehmen aufbaut.",
      "Single-Origin-Harissa mit nur einem Produkt: Herkunft und alte Chilisorten fürs Slow-Food-Ressort.",
      "Eine geräucherte Harissa, alte Baklouti-Chilis über Olivenholz, kompromisslos scharf.",
    ],
  },
  "roots-radicals": {
    story:
      "Ein Berliner Produzent, gegründet von einer Molekularbiologin und Köchin, die das unperfekte Gemüse, das Märkte wegwerfen, in fermentierte Hot Sauces verwandelt.",
    angles: [
      "Eine Molekularbiologin und Köchin, die einen Zero-Waste-Produzenten in Berlin führt.",
      "Hot Sauce aus geretteten, aufgewerteten Zutaten: der Nachhaltigkeitswinkel fürs Wirtschafts- oder Öko-Ressort.",
      "Eine fermentierte Harissa-Hot-Sauce, gebaut aus dem Gemüse, das Märkte wegwerfen.",
    ],
  },
  "yak-thai": {
    story:
      "Eine thailändische Bäckerin, die fünfzehn Jahre lang ihren eigenen Laden führte, macht heute im ländlichen Bayern von Hand Curry- und Chilipasten und importiert ihre getrockneten Chilis aus Thailand, weil die europäischen nicht gut genug waren.",
    angles: [
      "Eine thailändische Bäckerin, die fünfzehn Jahre ihren eigenen Laden führte und heute im ländlichen Bayern Pasten macht.",
      "Authentische Curry- und Chilipasten, ohne Zusätze, mit für den echten Geschmack importierten Chilis.",
      "Thailändische Curry- und Chilipasten, bewertet auf ihrer eigenen Schärfeskala, auf Bestellung gemacht.",
    ],
  },
  "dr-john-s-hot-sauce": {
    story:
      "Ein unabhängiger Hot-Sauce-Macher in Nürnberg, der handgefüllte Flaschen durch Franken und darüber hinaus verschickt.",
    angles: [
      "Ein unabhängiger Macher aus Nürnberg, im chili-freundlichen Franken.",
      "Frankens unabhängige Hot-Sauce-Szene, fürs Regionalressort.",
      "Handgemachte Hot Sauce, deutschlandweit verschickt.",
    ],
  },
  "salsa-boy": {
    story:
      "Ein Ein-Mann-Projekt aus Berlin mit ernster Miene und einer kühnen Behauptung auf dem Etikett: „Berlins Premium-Chilisauce“.",
    angles: [
      "Ein Ein-Mann-Projekt aus Berlin, das auf dem Etikett groß auftrumpft.",
      "Premium-Positionierung eines Einzelmachers: „Berlins Premium-Chilisauce“.",
      "In kleinen Chargen in Berlin abgefüllt.",
    ],
  },
  "julies-chili": {
    story:
      "Nachdem sie von Kongo nach Deutschland gezogen war, fand Julie die Schärfe ihrer Kindheit nirgends wieder und baute sich kurzerhand ihre eigene Saucenlinie auf. Diese mildere gelbe Habanero machte sie für die Freunde ihres Sohnes, denen die rote Version zu scharf war, und traf damit genau ins Schwarze. Vegan, mit natürlichen Zutaten.",
    angles: [
      "Eine Köchin, die von Kongo nach Deutschland zog und ihre eigene Linie aufbaute, um die vermisste Schärfe zu ersetzen.",
      "Eine mildere gelbe Habanero, gemacht für die nächste Generation: die Freunde ihres Sohnes, denen die rote zu scharf war.",
      "Yellow Habanero bei 3/10, vegan und geschmacksbetont, das milde Ende einer selbst aufgebauten Reihe.",
    ],
  },
};
