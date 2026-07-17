"use server";

import { createSampleRequest } from "@/lib/sample-requests";
import { sendMail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";

export type SampleRequestResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public server action: no session required. Persists the request, then emails
// the Council. The gate is manual review in /admin/sample-requests, not this
// endpoint. Bots are dropped via a honeypot field.
export async function submitSampleRequest(
  formData: FormData,
): Promise<SampleRequestResult> {
  // Honeypot: a hidden field real users never fill. If present, pretend success.
  const trap = String(formData.get("company_website") ?? "").trim();
  if (trap) return { ok: true };

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("name");
  const email = get("email");
  const organisation = get("organisation");
  const webOrInstagram = get("web_or_instagram");
  const addrStreet = get("addr_street");
  const addrPostcode = get("addr_postcode");
  const addrCity = get("addr_city");
  const addrCountry = get("addr_country");
  const note = get("note");

  const missing: string[] = [];
  if (!name) missing.push("your name");
  if (!EMAIL_RE.test(email)) missing.push("a valid email");
  if (!organisation) missing.push("your organisation or outlet");
  if (!webOrInstagram) missing.push("a website or Instagram handle");
  if (!addrStreet) missing.push("a street address");
  if (!addrPostcode) missing.push("a postcode");
  if (!addrCity) missing.push("a city");
  if (!addrCountry) missing.push("a country");
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
      addrStreet,
      addrPostcode,
      addrCity,
      addrCountry,
      note,
    });
  } catch (err) {
    console.error("[sample-request] insert failed", err);
    return {
      ok: false,
      error: "Something went wrong saving your request. Please try again.",
    };
  }

  // Notify the Council. Non-blocking for the user: a failed send must not undo
  // the saved row, so we swallow errors here (the row is still in the queue).
  try {
    await sendMail({
      to: "simon@republicofheat.com",
      replyTo: email,
      subject: `[ChiliFest] Sample request from ${name} (${organisation})`,
      text: [
        "New journalist sample request via the ChiliFest press hub.",
        "",
        `Name:         ${name}`,
        `Email:        ${email}`,
        `Organisation: ${organisation}`,
        `Web/Instagram:${" "}${webOrInstagram}`,
        `Address:      ${addrStreet}, ${addrPostcode} ${addrCity}, ${addrCountry}`,
        note ? `Note:         ${note}` : "",
        "",
        `Review: ${SITE_URL}/admin/sample-requests`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[sample-request] notify failed", err, "id=", request.id);
  }

  return { ok: true };
}
