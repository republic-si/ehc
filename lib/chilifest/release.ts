// Flagship Berlin Chili Fest press release (makers-led), EN + DE.
// Source: ~/BCF-press/releases/2026-07-17-bcf-harvest-2026-makers-{en,de}.md
// A quote paragraph is one that opens with a quote mark; rendered as a pull-quote.

export interface Release {
  headline: string;
  subhead: string;
  dateline: string;
  body: string[];
}

export const RELEASE: Record<"en" | "de", Release> = {
  en: {
    headline: "Meet the makers: Berlin Chili Fest returns for Harvest 2026 with 50+ European hot sauce producers",
    subhead: "From barely-there heat to dangerously hot, three days of independent chilli craft at the Berliner Berg Brauerei, 4 to 6 September.",
    dateline: "Berlin, 17 July 2026",
    body: [
      "Judging a hot sauce purely by its heat is like judging a wine purely by its alcohol, or a coffee purely by its caffeine. Berlin Chili Fest is built on everything that number leaves out.",
      "The festival returns to the Berliner Berg Brauerei in Neukölln from 4 to 6 September 2026 for its Harvest edition. More than 50 artisan hot sauce producers from across Europe will bring hundreds of sauces to taste and to buy, and over 13,000 visitors are expected across the weekend.",
      "The makers are the heart of it: independent producers who bottle for flavour first. The range runs from almost no heat to dangerously hot, and most of these sauces are built to lift food, not to hurt you.",
      "Martina Wastl of Instant Taste is an Austrian who settled in Berlin. She reworked Argentina's chimichurri into a crunchy oil you spoon rather than pour. Her Chimichurri Crisp is rated just 1 to 2 out of 10.",
      "Max Weiss makes three Mexican salsas by hand and sells them from his own Kreuzberg grocery, La Tiendita, under the name Luchadoras del Sabor. Each one is named after a lucha libre wrestling move. They run from the mild La Quebradora, a salsa verde at 1 to 3, up to the mango and habanero La Tirabuzón at 8 to 9.",
      "At the hotter end, flavour still leads. Biplav Dahal of Momo Haus in Berlin bottled the wild Himalayan Timur pepper that makes his restaurant's momos taste of home. His Snakebite Chilli Oil is a 7 out of 10, carried as much by citrus lift as by burn. More of this year's line-up, from fruit-led Madeira guava sauces to award-winning fermented habaneros, is profiled in the festival's \"Makers of the Harvest\" catalogue.",
      "The difference shows up on the label. A supermarket sweet-chilli sauce can be more than half sugar, around 53 grams per 100 grams. A jar of Hela curry ketchup holds about 30. Luchadoras' mild La Quebradora has just 5.6. The sweetness here comes from ripe fruit, roasted peppers and fermentation, so far less sugar goes in.",
      "\"These are people who make hot sauce because they cannot help it, and every bottle has a story before it has a burn,\" said Neil Numb, Founder and Organizer of Berlin Chili Festival. \"The weekend is built so anyone can walk in, taste their way from mild to wild, and meet the maker behind the jar.\"",
      "The festival's headline event is Berlin's Best Homemade Hot Sauce Competition. It is amateur and open to anyone: bring a homemade sauce and enter in person before 2pm on Sunday. Winners are announced that evening, and every entrant gets a certificate. The Berlin Amateur Chili Eating Competition returns for a second year, hosted by Pandemonic Chili Sauces and sponsored by Westland Peppers, with paramedics on hand. There is also a Spicy Cabaret Show, live music all weekend, and a kids' area for families.",
      "Beyond the sauces, there are street-food stalls and a beer garden pouring Berliner Berg beers and cocktails, with fresh chillies on sale throughout. Day tickets are €7 and a weekend pass is €12, from chilifest.eu. The festival runs Friday from 6 to 10pm, and Saturday and Sunday from noon to 10pm.",
    ],
  },
  de: {
    headline: "Die Macher im Mittelpunkt: Berlin Chili Fest kehrt zur Harvest 2026 mit über 50 europäischen Hot-Sauce-Produzenten zurück",
    subhead: "Von kaum spürbarer Schärfe bis gefährlich scharf: drei Tage unabhängiges Chili-Handwerk in der Berliner Berg Brauerei, vom 4. bis 6. September.",
    dateline: "Berlin, 17. Juli 2026",
    body: [
      "Eine Hot Sauce nur nach ihrer Schärfe zu beurteilen, ist wie einen Wein nur nach seinem Alkohol zu beurteilen oder einen Kaffee nur nach seinem Koffein. Das Berlin Chili Fest lebt von allem, was diese eine Zahl weglässt.",
      "Das Festival kehrt vom 4. bis 6. September 2026 zu seiner Harvest-Ausgabe in die Berliner Berg Brauerei nach Neukölln zurück. Mehr als 50 handwerkliche Hot-Sauce-Produzenten aus ganz Europa bringen Hunderte Saucen zum Probieren und Kaufen mit, und über das Wochenende werden mehr als 13.000 Besucherinnen und Besucher erwartet.",
      "Das Herzstück sind die Macherinnen und Macher: unabhängige Produzenten, für die der Geschmack an erster Stelle steht. Die Bandbreite reicht von nahezu keiner Schärfe bis gefährlich scharf, und die meisten dieser Saucen sind darauf angelegt, ein Gericht zu heben, nicht zu quälen.",
      "Martina Wastl von Instant Taste ist eine Österreicherin, die in Berlin heimisch geworden ist. Sie hat Argentiniens Chimichurri in ein knuspriges Öl verwandelt, das man löffelt statt gießt. Ihr Chimichurri Crisp liegt bei gerade einmal 1 bis 2 von 10.",
      "Max Weiss macht drei mexikanische Salsas von Hand und verkauft sie unter dem Namen Luchadoras del Sabor in seinem eigenen Kreuzberger Laden La Tiendita. Jede ist nach einem Wurfgriff des Lucha Libre benannt. Sie reichen von der milden La Quebradora, einer Salsa verde bei 1 bis 3, bis zur Mango-Habanero La Tirabuzón bei 8 bis 9.",
      "Am oberen Ende der Skala führt der Geschmack weiter. Biplav Dahal vom Momo Haus in Berlin hat den wilden Himalaya-Timur-Pfeffer abgefüllt, der die Momos seines Restaurants nach Heimat schmecken lässt. Sein Snakebite Chilli Oil steht bei 7 von 10, getragen ebenso von zitrischer Frische wie von der Schärfe. Mehr vom diesjährigen Aufgebot, von fruchtbetonten Guaven-Saucen aus Madeira bis zu preisgekrönten fermentierten Habaneros, stellt der Festival-Katalog \"Makers of the Harvest\" vor.",
      "Der Unterschied zeigt sich auf dem Etikett. Eine Sweet-Chili-Sauce aus dem Supermarkt kann zu mehr als der Hälfte aus Zucker bestehen, rund 53 Gramm pro 100 Gramm. Ein Glas Hela Curry Gewürz Ketchup enthält etwa 30. Die milde La Quebradora von Luchadoras kommt auf gerade einmal 5,6. Die Süße stammt hier aus reifer Frucht, gerösteten Paprika und Fermentation, sodass deutlich weniger Zucker nötig ist.",
      "\"Das sind Menschen, die Hot Sauce machen, weil sie nicht anders können, und jede Flasche hat eine Geschichte, bevor sie eine Schärfe hat\", sagt Neil Numb, Gründer und Organisator des Berlin Chili Festivals. \"Das Wochenende ist so angelegt, dass jeder hereinspazieren, sich von mild bis wild durchprobieren und die Macher hinter dem Glas treffen kann.\"",
      "Der wichtigste Wettbewerb des Festivals ist die Berlin's Best Homemade Hot Sauce Competition. Sie steht Amateuren offen und ist für alle da: die eigene, selbstgemachte Sauce mitbringen und bis Sonntag 14 Uhr persönlich vor Ort anmelden. Die Gewinner werden am selben Abend bekannt gegeben, und jede Teilnehmerin und jeder Teilnehmer erhält eine Urkunde. Die Berlin Amateur Chili Eating Competition kehrt im zweiten Jahr zurück, ausgerichtet von Pandemonic Chili Sauces und gesponsert von Westland Peppers, mit Sanitätern vor Ort. Dazu kommen eine Spicy Cabaret Show, Live-Musik das ganze Wochenende und ein Kinderbereich für Familien.",
      "Über die Saucen hinaus gibt es Streetfood-Stände und einen Biergarten mit Bieren der Berliner Berg Brauerei und Cocktails, dazu durchgehend frische Chilis im Verkauf. Die Tageskarte kostet 7 Euro, der Wochenendpass 12 Euro, erhältlich über chilifest.eu. Das Festival läuft freitags von 18 bis 22 Uhr sowie samstags und sonntags von 12 bis 22 Uhr.",
    ],
  },
};
