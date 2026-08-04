/**
 * DHL label generation for EHC sample boxes.
 *
 * Ported from Republic of Heat's dhl.service.ts (DHL Parcel DE API v2, ROPC
 * auth). Uses the SAME DHL business account / tokens as ROH — labels bill to
 * the shared account. Stripped of all ROH-DB coupling: this just mints a label
 * and hands back the tracking number + PDF URL. Persistence is the caller's job.
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

// Shipper (return address) — identical to ROH's warehouse. Same account, same
// origin. Sandbox uses DHL's canned test shipper instead (set below).
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
  labelUrl: string;
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
      ? (process.env.DHL_ACCOUNT_KLEINPAKET ?? "63906239186201")
      : accountNumber;
  } else {
    product = isLightweight ? "V66WPI" : "V53WPAK";
    billingNumber = isLightweight
      ? (process.env.DHL_ACCOUNT_WARENPOST_INT ?? "63906239186601")
      : (process.env.DHL_ACCOUNT_PAKET_INT ?? "63906239185301");
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
  const response = await fetch(
    `${DHL_CONFIG.shippingUrl}/orders?includeDocs=URL`,
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

  const data = JSON.parse(text) as {
    items: Array<{
      shipmentNo: string;
      label?: { url: string };
      sstatus?: { title: string; status: number };
    }>;
  };
  const item = data.items?.[0];
  if (!item || !item.shipmentNo) {
    if (item?.sstatus && item.sstatus.status > 200) {
      throw new Error(`DHL validation error: ${item.sstatus.title}`);
    }
    throw new Error("No shipment number returned by DHL");
  }

  return {
    trackingNumber: item.shipmentNo,
    labelUrl: item.label?.url ?? "",
  };
}
