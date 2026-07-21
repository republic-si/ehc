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
      "Ein Berliner Sommelier begann im Lockdown, Habaneros zu fermentieren. Seine mildeste Flasche, eine vegane Knoblauch-Chili-Mayo, soll genau die überzeugen, die am Tisch behaupten, Hot Sauce zu hassen.",
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
      "In der tschechischen Stahlstadt Ostrava füllt Petr Schejbal Chilisauce ganz ohne Konservierungsstoffe ab. Seine allererste, die milde „Zpečený Indián“, brachte die Marke ins Rollen.",
    angles: [
      "Ein Macher aus Ostrava, der seit 2020 konservierungsstofffreie Chilisauce abfüllt.",
      "Mitteleuropäisches Chili-Handwerk aus dem tschechischen Stahlgürtel.",
      "„Zpečený Indián“, eine milde Sauce im Tikka-Stil, seine erste.",
    ],
  },
  "marie-sharp-s": {
    story:
      "Marie Sharp machte sich in Belize einen Namen, indem sie den Essig in der Flasche durch Karotten ersetzte. Ihre deutschen Fürsprecher bringen die Mango-Variante, die sanfteste der Reihe, nach Berlin.",
    angles: [
      "Ein deutscher Importeur, der sich für Marie Sharp's einsetzt, die belizische Marke, die sie nach 20 Jahren in Belize zur Legende machte.",
      "Eine Traditionsmarken-Geschichte: Karotte und Habanero als die ursprüngliche geschmacksbetonte Hot Sauce.",
      "Mango Pepper bei 2/10, mild genug für Wassermelonensalat oder das Frühstücksmüsli.",
    ],
  },
  chiliwerk: {
    story:
      "Ein Berliner Macher will hier mit etwas Sanfterem vorangehen als einer Sauce: einem Hot Honey.",
    angles: [
      "Ein Berliner Macher, der von zitrusmild bis Carolina Reaper reicht und mit der sanfteren Idee führt.",
      "Hot Honey, das Crossover-Condiment, das aus dem Chili-Regal ausbricht.",
      "Ein Hot Honey zum Einstieg und eine geröstete Zitronen-Habanero fürs Schärfe-Ressort.",
    ],
  },
  "don-cabron": {
    story:
      "Eine nordmexikanische Köchin füllt von den Niederlanden aus die regionalen Salsas ihrer Familie ab. Ihr Smoky-Sweet Chili Oil („Macha Ahumada Dulce“) ist eine traditionelle knusprige Macha, tief und rauchig von mexikanischen Chilis, mit Cranberries für die Süße und Saaten für den Crunch.",
    angles: [
      "Eine nordmexikanische Köchin, die von den Niederlanden aus die regionalen Salsas ihrer Familie abfüllt.",
      "Smoky-Sweet Chili Oil, eine knusprige mexikanische Macha mit tiefem Rauch und Cranberry-Süße, im Knusperöl-Trend.",
      "Ihre Salsa Macha holte Bronze bei den European Hot Sauce Awards 2026.",
    ],
  },
  moja: {
    story:
      "Moja bedeutet auf Bengali „lecker“ und „Spaß“. Geboren aus Malihas bengalischen Wurzeln und ihrem Leben über Kontinente hinweg, verbindet dieses Berliner Chiliöl die nostalgischen Aromen der Heimat mit kräftigen Aromen aus der Ferne, gemacht für alle, die viele Zuhause haben.",
    angles: [
      "Eine Berliner Macherin, die ihre bengalischen Wurzeln mit Aromen aus einem Leben über Kontinente hinweg verbindet.",
      "Stückiges Chiliöl und Diaspora-Geschmack: der Geschmack von Heimat, neu gedacht für Menschen mit vielen Zuhause.",
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
      "Vaanee wuchs auf Mauritius inmitten seiner Melting-Pot-Küche auf, allen voran der ihrer Mutter, und vermisste sie, als sie in die Niederlande zog, also fing sie an, sie selbst zu kochen. Ihre Compote Tamarin begann als Rest: Tamarindenmark, das von ihrer Pima Tamarin übrig blieb, eingekocht zu jenem klebrigen Kompott, das ihre Mutter einst vor ihr und ihren Brüdern versteckte.",
    angles: [
      "Eine mauritische Kleinproduzentin in den Niederlanden, die die Saucen und Pickles abfüllt, die zu Hause zu jedem Gericht gehörten.",
      "Upcycling mit Geschmack: Das Kompott entsteht aus dem Tamarindenmark, das von ihrer scharfen Pima-Tamarin-Sauce übrig bleibt.",
      "Compote Tamarin bei 2/10, süß, klebrig und würzig mit Chili-Abgang, auf Vanilleeis so gut wie auf dem Käsebrett.",
    ],
  },
  "momo-haus": {
    story:
      "Jeder Teller Momo in diesem Berliner Restaurant schmeckte nach Heimat, bis auf eine Sache: den wilden Himalaya-Timur-Pfeffer. Biplav Dahal füllte ihn als Snakebite Chilli Oil ab, erst ein Chili-Kick, dann das zitrische Prickeln Nepals, das einen immer wieder zugreifen lässt.",
    angles: [
      "Ein Berliner Momo-Restaurant, das den Himalaya-Timur-Pfeffer abfüllt, der sein Essen nach Heimat schmecken ließ.",
      "Timur, der zitrisch prickelnde Himalaya-Verwandte des Sichuanpfeffers, auf dem Weg aus nepalesischen Küchen ins Regal.",
      "Snakebite Chilli Oil bei 7/10: erst der Chili-Kick, dann das kribbelnde Zitrusspiel des Timur.",
    ],
  },
  "teig-fullung": {
    story:
      "Ein schwäbischer Koch kochte sich ein Jahr lang durch die Küchen Taiwans und Hongkongs und kam süchtig nach Crispy Chili Oil zurück, also baute er sein eigenes. Es begann mit den Maultaschen seiner Familie, macht sich aber genauso gut auf Dumplings, Nudeln, Reis, sogar Pizza.",
    angles: [
      "Ein schwäbischer Koch, der in Taiwan und Hongkong hospitierte und in Deutschland sein eigenes Crispy Chili Oil baute.",
      "Crispy Chili Oil, das Format der Stunde, von einem deutschen Macher und kein Import.",
      "Crispy Chili Öl bei 4/10, auf Dumplings, Nudeln und Reis so gut wie auf handgemachten Maultaschen.",
    ],
  },
  "harissa-co": {
    story:
      "Eine in Berlin lebende tunesische Ingenieurin machte aus dem Rezept ihrer Großmutter, was sie Deutschlands erste handwerkliche geräucherte Harissa nennt: alte Baklouti-Chilis, über zwölf Stunden über Olivenholz geräuchert. Das „& Co“ steht für die Gemeinschaft dahinter, die Frauen, die das Rezept weitergaben, und die Bauern, die die Baklouti noch auf die alte Art räuchern.",
    angles: [
      "Eine in Berlin lebende tunesische Ingenieurin, die auf dem Rezept ihrer Großmutter und der sommerlichen Harissa-Tradition ihrer Familie ein Unternehmen aufbaut.",
      "Single-Origin-Harissa mit nur einem Produkt: alte Baklouti-Chilis, 12+ Stunden über Olivenholz geräuchert, fürs Slow-Food- oder Herkunftsressort.",
      "Eine geräucherte Harissa bei 3/10, sauber im Etikett und voller Geschmack, für alle, die wässrige Supermarktpaste satthaben.",
    ],
  },
  "roots-radicals": {
    story:
      "Ein Berliner Produzent, gegründet von der peruanischen Wissenschaftlerin und Köchin Mónica Kisic Aguirre, die die unperfekten Zutaten, die Märkte wegwerfen, durch zirkuläres Kochen in kräftige fermentierte Hot Sauces verwandelt. Ihre Fermentierte Jalapeño reift sechs Wochen und wird dann mit geröstetem Knoblauch und Apfelessig verfeinert; selbst die fermentierten Stiele werden zu einem würzigen Chili-Essig.",
    angles: [
      "Eine peruanische Wissenschaftlerin und Köchin, die einen Zero-Waste-Produzenten in Berlin führt.",
      "Hot Sauce aus geretteten, aufgewerteten Zutaten: der Nachhaltigkeitswinkel fürs Wirtschafts- oder Öko-Ressort.",
      "Fermentierte Jalapeño, eine milde grüne Sauce aus sechs Wochen fermentierten Chilis, bei der nichts verschwendet wird.",
    ],
  },
  "yak-thai": {
    story:
      "Als eine thailändische Konditorin mit ihrem Mann nach Deutschland zog, fanden sie die echten thailändischen Aromen nicht, die sie vermissten, also begannen sie, im ländlichen Bayern eigene Curry- und Chilipasten zu machen, mit direkt aus Thailand importierten getrockneten Chilis. Nichts wird für den deutschen Markt abgemildert: dieselbe Fischsauce, Garnelenpaste und Austernsauce wie zu Hause. Ihre Namprik Sam Het, eine „Drei-Pilze“-Chilipaste, ist der umami-reiche Star, als Dip so gut wie als Kochbasis.",
    angles: [
      "Eine thailändische Konditorin und ihr Mann, die im ländlichen Bayern zusatzstofffreie Curry- und Chilipasten machen, nichts für Deutschland abgemildert.",
      "Namprik Sam Het, eine „Drei-Pilze“-Chilipaste, umami-reich und als Dip wie als Kochbasis gut.",
      "Eine Bandbreite von Khao-Soi-Currypaste bei 2/10 bis Namprik Sam Het bei 4–5, Chilis aus Thailand für echten Geschmack.",
    ],
  },
  "dr-john-s-hot-sauce": {
    story:
      "Albert Ortez kochte eine Mango-Habanero-Sauce als einmaliges Weihnachtsgeschenk für seinen Bruder, einen bekennenden Hot-Sauce-Süchtigen. Der Bruder flippte aus, dann wollten dessen Freunde eine Flasche, dann fragten Fremde, wo es „dieses Mango-Habanero-Zeug“ zu kaufen gibt. Aus einem Scherzgeschenk wurde Dr. John's, die Nürnberger Marke, die Albert seit 2020 führt.",
    angles: [
      "Ein Nürnberger Macher, dessen Mango-Habanero-Sauce als einmaliges Weihnachtsgeschenk für seinen Hot-Sauce-süchtigen Bruder begann und zur Marke wurde.",
      "Trippy Habanero Mango bei 7/10: fruchtige Habanero, mit reifer Mango weitergetrieben, süß und scharf mit einer Schärfe, die sich anschleicht.",
      "Eine Reihe aus drei Saucen, von einer fermentierten „Twisted“-Sriracha mit Limettenschale bis zu einer für den Grill gebauten Carolina Reaper, aus dem chili-freundlichen Franken.",
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
