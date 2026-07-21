"use server";

import { createSampleRequest } from "@/lib/sample-requests";
import { sendMail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";

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
