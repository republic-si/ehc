// Media + config for the Berlin ChiliFest press hub.
// Photos: Berlin Chili Fest, free for editorial use when credited.

export const PHOTO_CREDIT = "Berlin Chili Fest";
export const PHOTO_USAGE = "Free for editorial use with credit to Berlin Chili Fest.";

// Public "Download all images" link. Google Drive folder, shared as
// "Anyone with the link -> Viewer" so journalists can download it as a ZIP.
// TODO(simon): paste the Drive folder share link here to activate the button.
export const PRESS_KIT_URL = "";

export interface FestImage {
  src: string;
  alt: string;
}

export const IMAGES: Record<string, FestImage> = {
  hero: {
    src: "/chilifest/hero.jpg",
    alt: "Tasters working down a long bench at Berlin ChiliFest, sampling hot sauces at Berliner Berg Brauerei.",
  },
  sauces: {
    src: "/chilifest/sauces.jpg",
    alt: "A line-up of hot sauce bottles with handwritten chalkboard tasting notes at Berlin ChiliFest.",
  },
  makers: {
    src: "/chilifest/makers.jpg",
    alt: "A hot sauce maker at their stall at Berlin ChiliFest.",
  },
  evening: {
    src: "/chilifest/evening.jpg",
    alt: "Live music at Berlin ChiliFest as the evening sets in.",
  },
  character: {
    src: "/chilifest/character.jpg",
    alt: "A festival-goer in front of the Berliner Berg Brauerei banner at Berlin ChiliFest.",
  },
  crowd: {
    src: "/chilifest/crowd.jpg",
    alt: "Crowds sampling sauces among the stalls at Berlin ChiliFest.",
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

// Press evening (accreditation-gated). Fill these in and set confirmed = true
// to replace the "to be confirmed" copy on the page.
export const PRESS_EVENING = {
  confirmed: false,
  dateDisplay: "Date to be confirmed",
  time: "",
  location: "Berliner Berg Brauerei, Berlin",
  blurb:
    "A dedicated preview for accredited press: taste the competition line-up, meet the makers, and speak to the judges before the public days.",
  capacityNote: "Places are limited and allocated on review.",
};
