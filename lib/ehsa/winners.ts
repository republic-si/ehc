// A curated sample of EHSA 2026 medallists for the /ehsa press hub.
// Every entry here is a GOLD medal (award by score). `bestInCategory` marks the
// rank-1 category winner; the others are Golds that did not top their category
// (e.g. Ornitodrinko). Facts are from the awards data (Neon awards + producers);
// no invented bios. Photos are the winner product shots from the press kit.

export interface Winner {
  slug: string;
  brand: string;
  town: string;
  country: string;
  category: string;
  sauce: string;
  bestInCategory: boolean;
  photo: string;
}

export const WINNERS: Winner[] = [
  { slug: "pandemonic", brand: "Pandemonic", town: "Berlin", country: "Germany", category: "Hot Chili Sauce", sauce: "Chocoberrie", bestInCategory: true, photo: "/ehsa/winners/pandemonic.webp" },
  { slug: "munnvold", brand: "MUNNVOLD", town: "Oslo", country: "Norway", category: "Medium Chili Sauce", sauce: "Munnvold Yuzu", bestInCategory: true, photo: "/ehsa/winners/munnvold.webp" },
  { slug: "pohorc", brand: "Pohorc Bio Chili", town: "Slovenj Gradec", country: "Slovenia", category: "Chili Honey", sauce: "Hot Honey", bestInCategory: true, photo: "/ehsa/winners/pohorc.webp" },
  { slug: "gaston", brand: "Gaston Chilli", town: "Ostrava", country: "Czech Republic", category: "Freestyle", sauce: "Dead Moruga", bestInCategory: true, photo: "/ehsa/winners/gaston.webp" },
  { slug: "spicepunk", brand: "Spicepunk", town: "Sursee", country: "Switzerland", category: "Mild Chili Sauce", sauce: "Peach Riot", bestInCategory: true, photo: "/ehsa/winners/spicepunk.webp" },
  { slug: "hotzeg", brand: "HotZeg", town: "Uccle", country: "Belgium", category: "Asian Style Chili Sauce", sauce: "Chee-ly", bestInCategory: true, photo: "/ehsa/winners/hotzeg.webp" },
  { slug: "filfla", brand: "Filfla Chilli Co.", town: "H'Attard", country: "Malta", category: "Chili Paste", sauce: "Buwġi", bestInCategory: true, photo: "/ehsa/winners/filfla.webp" },
  { slug: "svilis", brand: "Svilis Pepper Farm", town: "Augšlīgatne", country: "Latvia", category: "Garlic Chili Sauce", sauce: "Garlic Chilli", bestInCategory: true, photo: "/ehsa/winners/svilis.webp" },
  { slug: "de-vergulde-tong", brand: "De Vergulde Tong", town: "Volendam", country: "Netherlands", category: "Sambal, Chutney & Pickles", sauce: "Milde Sambal", bestInCategory: true, photo: "/ehsa/winners/de-vergulde-tong.webp" },
  { slug: "ornitodrinko", brand: "Ornitodrinko", town: "Brembate", country: "Italy", category: "BBQ Chili Sauce", sauce: "Smoked Ananas BBQ", bestInCategory: false, photo: "/ehsa/winners/ornitodrinko.webp" },
];
