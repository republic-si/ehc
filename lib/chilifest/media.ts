// Media + config for the Berlin Chili Fest press hub.
// Photos: Berlin Chili Fest, free for editorial use when credited.

export const PHOTO_CREDIT = "Berlin Chili Fest";
export const PHOTO_USAGE = "Free for editorial use with credit to Berlin Chili Fest.";

// Public "Download all images" link. Google Drive folder, shared as
// "Anyone with the link -> Viewer" so journalists can download it as a ZIP.
// Last year's Berlin Chili Fest image pack (Neil's official images).
export const PRESS_KIT_URL =
  "https://drive.google.com/drive/folders/1V3RV8FA2I6Db_BznHbFGeNy7NqFDfbZ2";

// Maker + festival logos, shared Google Drive folder ("anyone with the link").
export const LOGOS_URL =
  "https://drive.google.com/drive/folders/1JEwCQ9x4iSZKxQC7MsF1pp3Zbn8hkFJz";

export interface FestImage {
  src: string;
  alt: string;
}

export const IMAGES: Record<string, FestImage> = {
  hero: {
    src: "/chilifest/hero.jpg",
    alt: "Tasters working down a long bench at Berlin Chili Fest, sampling hot sauces at Berliner Berg Brauerei.",
  },
  sauces: {
    src: "/chilifest/sauces.jpg",
    alt: "A line-up of hot sauce bottles with handwritten chalkboard tasting notes at Berlin Chili Fest.",
  },
  makers: {
    src: "/chilifest/makers.jpg",
    alt: "A hot sauce maker at their stall at Berlin Chili Fest.",
  },
  evening: {
    src: "/chilifest/evening.jpg",
    alt: "Live music at Berlin Chili Fest as the evening sets in.",
  },
  character: {
    src: "/chilifest/character.jpg",
    alt: "A festival-goer in front of the Berliner Berg Brauerei banner at Berlin Chili Fest.",
  },
  crowd: {
    src: "/chilifest/crowd.jpg",
    alt: "Crowds sampling sauces among the stalls at Berlin Chili Fest.",
  },
  rohBox: {
    src: "/chilifest/roh-box.jpg",
    alt: "Republic of Heat sample boxes and a tasting board of sauces at a Berlin Chili Fest stall.",
  },
  neil: {
    src: "/chilifest/neil.jpg",
    alt: "Neil Numb, founder and organiser of Berlin Chili Fest, singing into a microphone on stage.",
  },
};

// Order for the downloadable media-kit preview grid.
export const GALLERY: FestImage[] = [
  IMAGES.hero,
  IMAGES.sauces,
  IMAGES.makers,
  IMAGES.character,
  IMAGES.evening,
  IMAGES.crowd,
];

// Press preview (accreditation-gated), EN/DE. Confirmed: Fri 4 Sept, 16:30,
// before the public doors (public opens Fri 6pm).
export const PRESS_EVENING = {
  confirmed: true,
  dateDisplay: {
    en: "Friday 4 September 2026",
    de: "Freitag, 4. September 2026",
  },
  time: {
    en: "16:30, before the public doors",
    de: "16:30 Uhr, vor dem Publikumseinlass",
  },
  location: {
    en: "Berliner Berg Brauerei, Berlin",
    de: "Berliner Berg Brauerei, Berlin",
  },
  blurb: {
    en: "A dedicated preview for accredited press: taste the sauces and meet the makers before the public doors open.",
    de: "Ein exklusiver Vorabend für akkreditierte Presse: die Saucen verkosten und die Macher treffen, bevor die Publikumstage beginnen.",
  },
  capacityNote: {
    en: "Places are limited and allocated on review.",
    de: "Plätze sind begrenzt und werden nach Prüfung vergeben.",
  },
};
