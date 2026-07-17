// Sauce catalogue for the Berlin Chili Fest press hub.
//
// This is the data source for /chilifest/catalogue. Replace the placeholder
// entries below with the real roster we are building. Rules that apply to the
// copy here (see the press craft memory):
//   - Tasting notes must be sourced or from the maker. Do NOT invent them.
//   - No maker bios asserted from a single source; keep origin to region/country.
//   - Never name a maker's family.
// Flip CATALOGUE_IS_PLACEHOLDER to false once real entries are in, which hides
// the draft banner on the page.

export interface SauceEntry {
  producer: string;
  sauce: string;
  origin: string; // region and/or country
  heat: string; // plain-language band or an SHU range, maker/label sourced
  notes: string; // sourced tasting notes only
  url?: string; // producer or product page
}

export const CATALOGUE_IS_PLACEHOLDER = true;

export const CATALOGUE: SauceEntry[] = [
  {
    producer: "Example Producer",
    sauce: "Placeholder Sauce",
    origin: "Region, Country",
    heat: "Medium",
    notes: "Replace with sourced tasting notes before launch.",
  },
  {
    producer: "Example Producer",
    sauce: "Placeholder Sauce Two",
    origin: "Region, Country",
    heat: "Hot",
    notes: "Replace with sourced tasting notes before launch.",
  },
  {
    producer: "Example Producer",
    sauce: "Placeholder Sauce Three",
    origin: "Region, Country",
    heat: "Mild",
    notes: "Replace with sourced tasting notes before launch.",
  },
];
