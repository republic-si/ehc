/**
 * DHL label generation for EHC sample boxes.
 *
 * Ported from Republic of Heat's dhl.service.ts (DHL Parcel DE API v2, ROPC
 * auth). Bills to the EU Heat Awards DHL business account (developer-portal app
 * `eu_heat_awards`, owned via Neil/BCF) — NOT ROH's account. Stripped of all
 * ROH-DB coupling: this just mints a label and hands back the tracking number +
 * PDF URL. Persistence is the caller's job.
 *
 * NB: this app is provisioned for PRODUCTION only — DHL's sandbox returns
 * `401 no apiproduct match found` for it, so DHL_MODE=production is the only
 * working mode. Label creation does not bill; DHL charges on parcel induction.
 *
 * Sandbox vs production is selected by DHL_MODE (default: sandbox).
 */

// ==================== BOX SPEC ====================

// Sample box — same physical spec ROH ships subscription boxes at.
const SAMPLE_BOX_SPECS = {
  weight: 1.3, // kg
  length: 270, // mm
  width: 140, // mm
  height: 70, // mm
} as const;

// Shipper (return address) — the ROH warehouse (physical origin the boxes ship
// from), billed to the eu_heat_awards account. Sandbox uses DHL's canned test
// shipper instead (set below), but sandbox isn't provisioned for this app.
const SHIPPER = {
  name1: "Republic of Heat",
  addressStreet: "Südostallee 124",
  postalCode: "12487",
  city: "Berlin",
  country: "DEU",
} as const;

// ==================== TYPES ====================

export interface SampleLabelRequest {
  /** Recipient name (name1 on the label). */
  name: string;
  /** Optional second name line (company / c-o). */
  name2?: string;
  /** Full street incl. house number, e.g. "Südostallee 124". */
  street: string;
  postcode: string;
  city: string;
  /** Free-text country (name in any language) OR an ISO alpha-2/alpha-3 code. */
  country: string;
  email?: string;
  /** kg — defaults to the sample-box weight. */
  weight?: number;
  /** Printed on the label as the customer reference. */
  reference: string;
}

export interface SampleLabelResult {
  trackingNumber: string;
  /** Embedded PDF returned by DHL with includeDocs=DATA. */
  pdf: Uint8Array;
}

export class DhlAmbiguousError extends Error {
  constructor(message: string, public readonly trackingNumber?: string) {
    super(message);
    this.name = "DhlAmbiguousError";
  }
}

// ==================== COUNTRY RESOLUTION ====================

// DHL wants ISO 3166-1 alpha-3. EHC stores country as free text in mixed
// languages ("Germany", "Deutschland", "Netherlands", …), so map by name and
// by alpha-2. Covers the EU + the markets sample boxes actually go to; extend
// as new destinations appear.
const ALPHA3_BY_NAME: Record<string, string> = {
  // Germany
  germany: "DEU",
  deutschland: "DEU",
  de: "DEU",
  deu: "DEU",
  // Netherlands
  netherlands: "NLD",
  nederland: "NLD",
  niederlande: "NLD",
  nl: "NLD",
  nld: "NLD",
  // Austria
  austria: "AUT",
  österreich: "AUT",
  oesterreich: "AUT",
  at: "AUT",
  aut: "AUT",
  // United Kingdom
  "united kingdom": "GBR",
  uk: "GBR",
  "great britain": "GBR",
  england: "GBR",
  gb: "GBR",
  gbr: "GBR",
  // Sweden
  sweden: "SWE",
  sverige: "SWE",
  schweden: "SWE",
  se: "SWE",
  swe: "SWE",
  // Rest of common EU markets
  france: "FRA",
  frankreich: "FRA",
  fr: "FRA",
  fra: "FRA",
  belgium: "BEL",
  belgien: "BEL",
  belgië: "BEL",
  be: "BEL",
  bel: "BEL",
  italy: "ITA",
  italien: "ITA",
  italia: "ITA",
  it: "ITA",
  ita: "ITA",
  spain: "ESP",
  spanien: "ESP",
  españa: "ESP",
  es: "ESP",
  esp: "ESP",
  denmark: "DNK",
  dänemark: "DNK",
  danmark: "DNK",
  dk: "DNK",
  dnk: "DNK",
  poland: "POL",
  polen: "POL",
  polska: "POL",
  pl: "POL",
  pol: "POL",
  ireland: "IRL",
  irland: "IRL",
  ie: "IRL",
  irl: "IRL",
  switzerland: "CHE",
  schweiz: "CHE",
  suisse: "CHE",
  ch: "CHE",
  che: "CHE",
  "czech republic": "CZE",
  czechia: "CZE",
  tschechien: "CZE",
  cz: "CZE",
  cze: "CZE",
  finland: "FIN",
  finnland: "FIN",
  fi: "FIN",
  fin: "FIN",
  portugal: "PRT",
  pt: "PRT",
  prt: "PRT",
  norway: "NOR",
  norwegen: "NOR",
  no: "NOR",
  nor: "NOR",
};

export function resolveCountryAlpha3(input: string): string | null {
  const key = input.trim().toLowerCase();
  if (!key) return null;
  return ALPHA3_BY_NAME[key] ?? null;
}

// V1 deliberately excludes customs destinations and special address products.
// Keep this explicit rather than treating every mapped country as shippable.
const SUPPORTED_EU_COUNTRIES = new Set([
  "AUT", "BEL", "CZE", "DEU", "DNK", "ESP", "FIN", "FRA", "IRL",
  "ITA", "NLD", "POL", "PRT", "SWE",
]);

export function isSupportedDhlDestination(input: string): boolean {
  const country = resolveCountryAlpha3(input);
  return country != null && SUPPORTED_EU_COUNTRIES.has(country);
}

// ==================== CONFIG + AUTH ====================

function getDhlConfig() {
  const mode = process.env.DHL_MODE || "sandbox";

  if (mode === "production") {
    return {
      mode: "production" as const,
      shippingUrl: "https://api-eu.dhl.com/parcel/de/shipping/v2",
      authUrl:
        "https://api-eu.dhl.com/parcel/de/account/auth/ropc/v1/token",
      accountNumber: process.env.DHL_ACCOUNT_NUMBER!,
      tokenUser: process.env.DHL_USERNAME!,
      tokenPass: process.env.DHL_DEVELOPER_PASSWORD!,
    };
  }

  // Sandbox — DHL's fixed test credentials/account.
  return {
    mode: "sandbox" as const,
    shippingUrl: "https://api-sandbox.dhl.com/parcel/de/shipping/v2",
    authUrl:
      "https://api-sandbox.dhl.com/parcel/de/account/auth/ropc/v1/token",
    accountNumber: "33333333330102",
    tokenUser: "user-valid",
    tokenPass: "SandboxPasswort2023!",
  };
}

const DHL_CONFIG = getDhlConfig();

function validateConfig(): void {
  if (!process.env.DHL_API_KEY || !process.env.DHL_API_SECRET) {
    throw new Error(
      "DHL_API_KEY and DHL_API_SECRET environment variables are required",
    );
  }
  if (DHL_CONFIG.mode === "production" && !DHL_CONFIG.accountNumber) {
    throw new Error("DHL_ACCOUNT_NUMBER is required in production mode");
  }
  if (DHL_CONFIG.mode === "production") {
    for (const key of [
      "DHL_ACCOUNT_KLEINPAKET",
      "DHL_ACCOUNT_WARENPOST_INT",
      "DHL_ACCOUNT_PAKET_INT",
    ] as const) {
      if (!process.env[key]) throw new Error(`${key} is required in production mode`);
    }
  }
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const params = new URLSearchParams({
    grant_type: "password",
    username: DHL_CONFIG.tokenUser,
    password: DHL_CONFIG.tokenPass,
    client_id: process.env.DHL_API_KEY!,
    client_secret: process.env.DHL_API_SECRET!,
  });

  const response = await fetch(DHL_CONFIG.authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get DHL token (${DHL_CONFIG.mode}): ${error}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in * 1000 - 60000); // 1-min buffer
  return cachedToken!;
}

// ==================== LABEL ====================

export async function generateSampleLabel(
  req: SampleLabelRequest,
): Promise<SampleLabelResult> {
  validateConfig();

  const country = resolveCountryAlpha3(req.country);
  if (!country) {
    throw new Error(
      `Unrecognised country "${req.country}" — cannot map to an ISO code. Fix the address or extend the country map in lib/dhl.ts.`,
    );
  }
  if (!SUPPORTED_EU_COUNTRIES.has(country)) {
    throw new Error(
      `Destination "${req.country}" is outside the supported EU label lanes.`,
    );
  }
  if (!req.street.trim() || !req.postcode.trim() || !req.city.trim()) {
    throw new Error("Incomplete address — street, postcode and city are all required.");
  }

  // Split street into name + house number. German format first ("Musterstr. 12"),
  // then English/Irish ("12 High Street"), else the whole string with no number.
  const germanFormat = req.street.match(/^(\D+?)\s+(\d+[-a-zA-Z\d]*)(?:[\s.,].*)?$/);
  const englishFormat = req.street.match(/^(\d+[-a-zA-Z\d]*)\s+(.+)$/);
  let streetName: string;
  let houseNumber: string | undefined;
  if (germanFormat) {
    streetName = germanFormat[1].trim();
    houseNumber = germanFormat[2].trim();
  } else if (englishFormat) {
    houseNumber = englishFormat[1].trim();
    streetName = englishFormat[2].trim();
  } else {
    streetName = req.street.trim();
    houseNumber = undefined;
  }

  const { mode, accountNumber } = DHL_CONFIG;
  const isGermany = country === "DEU";
  const weight = req.weight ?? SAMPLE_BOX_SPECS.weight;
  const isLightweight = weight < 1;

  let product: string;
  let billingNumber: string;
  if (mode === "sandbox") {
    const ekp = accountNumber.substring(0, 10);
    const participation = accountNumber.substring(12, 14);
    product = isGermany ? "V01PAK" : "V53WPAK";
    billingNumber = isGermany ? accountNumber : `${ekp}53${participation}`;
  } else if (isGermany) {
    product = isLightweight ? "V62KP" : "V01PAK";
    billingNumber = isLightweight
      ? process.env.DHL_ACCOUNT_KLEINPAKET!
      : accountNumber;
  } else {
    product = isLightweight ? "V66WPI" : "V53WPAK";
    billingNumber = isLightweight
      ? process.env.DHL_ACCOUNT_WARENPOST_INT!
      : process.env.DHL_ACCOUNT_PAKET_INT!;
  }

  const shipper =
    mode === "sandbox"
      ? {
          name1: "DHL Sandbox Shipper",
          addressStreet: "Charles-de-Gaulle-Strasse",
          addressHouse: "20",
          postalCode: "53113",
          city: "Bonn",
          country: "DEU",
          email: "user-valid@dhl.de",
        }
      : { ...SHIPPER };

  const payload = {
    profile: "STANDARD_GRUPPENPROFIL",
    shipments: [
      {
        product,
        billingNumber,
        refNo: req.reference,
        shipDate: new Date().toISOString().split("T")[0],
        shipper,
        consignee: {
          name1: req.name,
          name2: req.name2,
          addressStreet: streetName,
          addressHouse: houseNumber,
          postalCode: req.postcode,
          city: req.city,
          country,
          email: req.email,
        },
        details: {
          weight: { uom: "kg", value: weight },
          dim: {
            uom: "mm",
            height: SAMPLE_BOX_SPECS.height,
            length: SAMPLE_BOX_SPECS.length,
            width: SAMPLE_BOX_SPECS.width,
          },
        },
      },
    ],
  };

  const token = await getAccessToken();
  let response: Response;
  try {
    response = await fetch(
      `${DHL_CONFIG.shippingUrl}/orders?includeDocs=DATA`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "de-DE",
        },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    throw new DhlAmbiguousError(
      `DHL order request lost its response: ${error instanceof Error ? error.message : "network error"}`,
    );
  }

  const text = await response.text();
  if (!response.ok) {
    let msg = `DHL API error: ${response.status} ${response.statusText}`;
    try {
      const j = JSON.parse(text);
      if (j.detail) msg += ` - ${j.detail}`;
      if (j.title) msg += ` (${j.title})`;
    } catch {
      msg += ` - ${text}`;
    }
    throw new Error(msg);
  }

  let data: {
    items: Array<{
      shipmentNo: string;
      label?: { b64?: string; url?: string };
      sstatus?: { title: string; status: number };
    }>;
  };
  try {
    data = JSON.parse(text);
  } catch {
    throw new DhlAmbiguousError("DHL returned an unreadable order response");
  }
  const item = data.items?.[0];
  if (!item || !item.shipmentNo) {
    if (item?.sstatus && item.sstatus.status > 200) {
      throw new Error(`DHL validation error: ${item.sstatus.title}`);
    }
    throw new Error("No shipment number returned by DHL");
  }

  const encoded = item.label?.b64;
  if (!encoded) {
    throw new DhlAmbiguousError(
      `DHL created shipment ${item.shipmentNo} but returned no embedded label PDF`,
      item.shipmentNo,
    );
  }
  const pdf = Uint8Array.from(Buffer.from(encoded, "base64"));
  if (pdf.byteLength < 5 || Buffer.from(pdf.subarray(0, 5)).toString("ascii") !== "%PDF-") {
    throw new DhlAmbiguousError(
      `DHL created shipment ${item.shipmentNo} but returned an invalid label PDF`,
      item.shipmentNo,
    );
  }
  const maxBytes = Number(process.env.DHL_LABEL_MAX_BYTES ?? 2_000_000);
  if (pdf.byteLength > maxBytes) {
    throw new DhlAmbiguousError(
      `DHL label PDF is too large (${pdf.byteLength} bytes; limit ${maxBytes})`,
      item.shipmentNo,
    );
  }

  return {
    trackingNumber: item.shipmentNo,
    pdf,
  };
}
