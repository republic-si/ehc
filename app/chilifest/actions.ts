"use server";

import { createSampleRequest } from "@/lib/sample-requests";
import { sendMail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";
import { makerContactEmail, PRESS_CC } from "@/lib/chilifest/maker-contacts";

export type SampleRequestResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Unified public request: one submission can want samples and/or the press
// evening. No session required; the gate is manual review in
// /admin/sample-requests. Bots are dropped via a honeypot field.
export async function submitPressRequest(
  formData: FormData,
): Promise<SampleRequestResult> {
  const trap = String(formData.get("company_website") ?? "").trim();
  if (trap) return { ok: true };

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const on = (k: string) => {
    const v = String(formData.get(k) ?? "").toLowerCase();
    return v === "on" || v === "true" || v === "1";
  };

  const name = get("name");
  const email = get("email");
  const organisation = get("organisation");
  const webOrInstagram = get("web_or_instagram");
  const note = get("note");
  const wantsSamples = on("wants_samples");
  const wantsPressEvening = on("wants_press_evening");

  const addrStreet = get("addr_street");
  const addrPostcode = get("addr_postcode");
  const addrCity = get("addr_city");
  const addrCountry = get("addr_country");

  if (!wantsSamples && !wantsPressEvening && !note) {
    return {
      ok: false,
      error:
        "Tick samples or the press preview, or tell us what you'd like in the note.",
    };
  }

  const missing: string[] = [];
  if (!name) missing.push("your name");
  if (!EMAIL_RE.test(email)) missing.push("a valid email");
  if (!organisation) missing.push("your organisation or outlet");
  // Address is only required when samples are requested.
  if (wantsSamples) {
    if (!addrStreet) missing.push("a street address");
    if (!addrPostcode) missing.push("a postcode");
    if (!addrCity) missing.push("a city");
    if (!addrCountry) missing.push("a country");
  }
  if (missing.length > 0) {
    return { ok: false, error: `Please add ${missing.join(", ")}.` };
  }

  let request;
  try {
    request = await createSampleRequest({
      name,
      email,
      organisation,
      webOrInstagram,
      addrStreet: wantsSamples ? addrStreet : "",
      addrPostcode: wantsSamples ? addrPostcode : "",
      addrCity: wantsSamples ? addrCity : "",
      addrCountry: wantsSamples ? addrCountry : "",
      note,
      wantsSamples,
      wantsPressEvening,
    });
  } catch (err) {
    console.error("[press-request] insert failed", err);
    return {
      ok: false,
      error: "Something went wrong saving your request. Please try again.",
    };
  }

  const wants =
    [wantsSamples ? "samples" : null, wantsPressEvening ? "press evening" : null]
      .filter(Boolean)
      .join(" + ") || "enquiry";

  try {
    await sendMail({
      to: "simon@republicofheat.com",
      replyTo: email,
      subject: `[Chili Fest] Press request (${wants}) from ${name} (${organisation})`,
      text: [
        "New journalist request via the Chili Fest press hub.",
        "",
        `Wants:        ${wants}`,
        `Name:         ${name}`,
        `Email:        ${email}`,
        `Organisation: ${organisation}`,
        `Web/Instagram: ${webOrInstagram}`,
        wantsSamples
          ? `Ship to:      ${addrStreet}, ${addrPostcode} ${addrCity}, ${addrCountry}`
          : null,
        note ? `Note:         ${note}` : null,
        "",
        `Review: ${SITE_URL}/admin/sample-requests`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[press-request] notify failed", err, "id=", request.id);
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
      subject: `URGENT PRESS CONTACT: ${organisation} re ${makerName} — Berlin Chili Fest`,
      text: [
        `A journalist has contacted you directly via your Berlin Chili Fest producer profile.`,
        `Reply straight to this email to reach them. Simon (Republic of Heat) and Neil (Berlin Chili Fest) are copied.`,
        "",
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
