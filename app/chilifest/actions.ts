"use server";

import {
  createSampleRequest,
  startSampleRequest,
  patchSampleRequest,
  completeSampleRequest,
  asRequestRole,
  REQUEST_ROLE_LABELS,
  type RequestPatch,
} from "@/lib/sample-requests";
import { sendMail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";
import { makerContactEmail, PRESS_CC } from "@/lib/chilifest/maker-contacts";

export type SampleRequestResult = { ok: true } | { ok: false; error: string };
export type StartResult =
  | { ok: true; id: string; editToken: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Progressive-save public request flow -----------------------------------
// The Chili Fest form saves as the visitor advances. startRequest captures the
// lead the moment we have a name + email (no admin email yet); updateRequest
// applies each later step gated on the edit_token; completeRequest stamps the
// row done and notifies Simon. All bot traffic is dropped via the honeypot.

// Step 1: name + email -> partial row. Returns the id + edit_token the browser
// must present on every later patch.
export async function startRequest(formData: FormData): Promise<StartResult> {
  const trap = String(formData.get("company_website") ?? "").trim();
  if (trap) return { ok: true, id: "0", editToken: "" };

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("name");
  const email = get("email");
  const maker = get("maker");

  const missing: string[] = [];
  if (!name) missing.push("your name");
  if (!EMAIL_RE.test(email)) missing.push("a valid email");
  if (missing.length > 0) {
    return { ok: false, error: `Please add ${missing.join(", ")}.` };
  }

  try {
    const { id, editToken } = await startSampleRequest({ name, email, maker });
    return { ok: true, id, editToken };
  } catch (err) {
    console.error("[chilifest-request] start failed", err);
    return {
      ok: false,
      error: "Something went wrong saving your details. Please try again.",
    };
  }
}

// Any later step: patch whichever whitelisted fields are present, gated on the
// (id, edit_token) pair. Wrong/absent token -> 0 rows -> rejected.
export async function updateRequest(
  formData: FormData,
): Promise<SampleRequestResult> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const has = (k: string) => formData.get(k) !== null;
  const on = (k: string) => {
    const v = String(formData.get(k) ?? "").toLowerCase();
    return v === "on" || v === "true" || v === "1";
  };
  const id = get("id");
  const editToken = get("edit_token");
  if (!id || !editToken) return { ok: false, error: "Session expired." };

  const patch: RequestPatch = {};
  if (has("role")) patch.role = asRequestRole(get("role"));
  if (has("wants_samples")) patch.wantsSamples = on("wants_samples");
  if (has("wants_press_evening")) patch.wantsPressEvening = on("wants_press_evening");
  if (has("addr_street")) patch.addrStreet = get("addr_street");
  if (has("addr_postcode")) patch.addrPostcode = get("addr_postcode");
  if (has("addr_city")) patch.addrCity = get("addr_city");
  if (has("addr_country")) patch.addrCountry = get("addr_country");
  if (has("extra_emails")) {
    // JSON array of strings from the client; keep only valid, unique, max 5.
    let list: string[] = [];
    try {
      const raw = JSON.parse(get("extra_emails"));
      if (Array.isArray(raw)) list = raw.map((s) => String(s).trim());
    } catch {
      list = [];
    }
    patch.extraEmails = [...new Set(list.filter((e) => EMAIL_RE.test(e)))].slice(0, 5);
  }

  try {
    const n = await patchSampleRequest(id, editToken, patch);
    if (n === 0) return { ok: false, error: "Session expired." };
    return { ok: true };
  } catch (err) {
    console.error("[chilifest-request] update failed", err, "id=", id);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

// Final step: mark complete + notify. Idempotent on completed_at.
export async function completeRequest(
  formData: FormData,
): Promise<SampleRequestResult> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const id = get("id");
  const editToken = get("edit_token");
  if (!id || !editToken) return { ok: false, error: "Session expired." };

  let request;
  try {
    request = await completeSampleRequest(id, editToken);
  } catch (err) {
    console.error("[chilifest-request] complete failed", err, "id=", id);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  if (!request) return { ok: false, error: "Session expired." };

  const roleLabel = request.role ? REQUEST_ROLE_LABELS[request.role] : "—";
  const wants =
    [
      request.wantsPressEvening ? "industry pass" : null,
      request.wantsSamples ? "samples" : null,
    ]
      .filter(Boolean)
      .join(" + ") || "pass";

  try {
    await sendMail({
      to: "simon@republicofheat.com",
      replyTo: request.email,
      subject: `[Chili Fest] ${roleLabel} request (${wants}) from ${request.name}`,
      text: [
        "New request via the Chili Fest press hub.",
        "",
        `Role:          ${roleLabel}`,
        `Wants:         ${wants}`,
        `Name:          ${request.name}`,
        `Email:         ${request.email}`,
        request.wantsSamples
          ? `Ship to:       ${request.addrStreet}, ${request.addrPostcode} ${request.addrCity}, ${request.addrCountry}`
          : null,
        request.extraEmails.length
          ? `Guest emails:  ${request.extraEmails.join(", ")}`
          : null,
        "",
        `Review: ${SITE_URL}/admin/sample-requests`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[chilifest-request] notify failed", err, "id=", request.id);
  }

  return { ok: true };
}

// Direct journalist -> producer contact. Emails the maker's own inbox (looked
// up server-side; never exposed to the browser), CCs Simon + Neil, sets
// reply-to to the journalist, and logs the message in /admin/sample-requests
// under the 'producer-contact' source so nothing is lost if a maker misses it.
export async function contactProducer(
  formData: FormData,
): Promise<SampleRequestResult> {
  const trap = String(formData.get("company_website") ?? "").trim();
  if (trap) return { ok: true };

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const makerId = get("maker_id");
  const makerName = get("maker_name") || makerId;
  const name = get("name");
  const email = get("email");
  const organisation = get("organisation");
  const webOrInstagram = get("web_or_instagram");
  const message = get("message");
  const role = asRequestRole(get("role"));
  const roleLabel = role ? REQUEST_ROLE_LABELS[role] : "—";

  const producerEmail = makerContactEmail(makerId);
  if (!producerEmail) {
    return {
      ok: false,
      error: "We can't reach this producer directly right now. Please try the general press form.",
    };
  }

  const missing: string[] = [];
  if (!name) missing.push("your name");
  if (!EMAIL_RE.test(email)) missing.push("a valid email");
  if (!organisation) missing.push("your organisation or outlet");
  if (!message) missing.push("a short message");
  if (missing.length > 0) {
    return { ok: false, error: `Please add ${missing.join(", ")}.` };
  }

  // Log first so the request survives even if SMTP is down.
  let request;
  try {
    request = await createSampleRequest({
      name,
      email,
      organisation,
      webOrInstagram,
      addrStreet: "",
      addrPostcode: "",
      addrCity: "",
      addrCountry: "",
      note: message,
      source: "producer-contact",
      maker: makerName,
      role,
    });
  } catch (err) {
    console.error("[producer-contact] insert failed", err);
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }

  try {
    await sendMail({
      to: producerEmail,
      cc: PRESS_CC,
      replyTo: email,
      subject: `URGENT PRESS CONTACT: ${organisation} (${roleLabel}) re ${makerName} — Berlin Chili Fest`,
      text: [
        `A ${roleLabel.toLowerCase()} contact has reached you directly via your Berlin Chili Fest producer profile.`,
        `Reply straight to this email to reach them. Simon (Republic of Heat) and Neil (Berlin Chili Fest) are copied.`,
        "",
        `Role:          ${roleLabel}`,
        `Name:          ${name}`,
        `Email:         ${email}`,
        `Organisation:  ${organisation}`,
        webOrInstagram ? `Web/Instagram: ${webOrInstagram}` : null,
        "",
        "Message:",
        message,
        "",
        `— Logged at ${SITE_URL}/admin/sample-requests`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[producer-contact] send failed", err, "id=", request.id);
  }

  return { ok: true };
}
