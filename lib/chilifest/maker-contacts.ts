// SERVER-ONLY. Producer inboxes for the direct journalist-contact form.
// Never import this into a client component: these addresses must never reach
// the browser. The contact form posts to a server action that looks the inbox
// up here, emails the producer, and CCs Simon + Neil.
//
// Sourced from ~/BCF-press/media-list/producers.md, with the corrected inboxes
// from the campaign STATUS (ChilliPeterson, Dr John's). Keys match the maker
// ids in makers.ts / the MAKER_TEMPLATES profile pages.
//
// Import this ONLY from a "use server" module (actions.ts). It is never
// referenced from a client component, so it is never sent to the browser.

export const MAKER_CONTACT_EMAILS: Record<string, string> = {
  "harissa-co": "harissandco@gmail.com",
  "instant-taste": "martina.wastl@gmail.com",
  "luchadoras-del-sabor": "info@la-tiendita.de",
  "neck-dart": "rob@neck-dart.com",
  chillipeterson: "info@chillipeterson.cz",
  "marie-sharp-s": "jr@marie-sharp.de",
  "ti-dodo-epice": "vaanee.telfair@gmail.com",
  "momo-haus": "Kontakt@momo-haus.de",
  "teig-fullung": "teigundfuellung@gmail.com",
  "yak-thai": "alexander.schopf@yak-thai.de",
  "dr-john-s-hot-sauce": "dr.johns.hot@gmail.com",
  "julies-chili": "julieschili@protonmail.com",
  "qudo-tjes": "gertjan@qudotjes.com",
  "don-cabron": "salsasdoncabron@gmail.com",
  "roots-radicals": "cayetana@rootsradicals.berlin",
  chiliwerk: "info@chiliwerk.de",
  "salsa-boy": "sascha.mayer.design@gmail.com",
  "not-that-spicy": "justin@notthatspicy.com",
  moja: "hello@mojaberlin.com",
};

// Council inbox CC'd on every direct-contact email (Simon + Neil).
export const PRESS_CC = ["simon@republicofheat.com", "info@chilifest.eu"];

export function makerContactEmail(id: string): string | undefined {
  return MAKER_CONTACT_EMAILS[id];
}

export function makerHasContact(id: string): boolean {
  return id in MAKER_CONTACT_EMAILS;
}
