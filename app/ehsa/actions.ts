"use server";

import {
  createInterest,
  asInterestRole,
  INTEREST_ROLE_LABELS,
} from "@/lib/ehsa/interest";
import { sendMail } from "@/lib/mailer";

// The register-interest form on /ehsa. One authoritative submit at the end of
// the typeform: validate, insert scoped to ehsa_2027, notify Simon. Bot traffic
// is dropped via the honeypot. Fails soft on the notify so the row still lands.

const CAMPAIGN = "ehsa_2027";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerInterest(
  formData: FormData,
): Promise<RegisterResult> {
  const trap = String(formData.get("company_website") ?? "").trim();
  if (trap) return { ok: true }; // honeypot: pretend success, store nothing

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("name");
  const email = get("email");
  const role = asInterestRole(get("role"));
  const organisation = get("organisation");
  const note = get("note");

  const missing: string[] = [];
  if (!name) missing.push("your name");
  if (!EMAIL_RE.test(email)) missing.push("a valid email");
  if (missing.length > 0) {
    return { ok: false, error: `Please add ${missing.join(", ")}.` };
  }

  let id: string;
  try {
    ({ id } = await createInterest({
      campaignSlug: CAMPAIGN,
      name,
      email,
      role,
      organisation,
      note,
    }));
  } catch (err) {
    console.error("[ehsa-interest] insert failed", err);
    return {
      ok: false,
      error: "Something went wrong saving your details. Please try again.",
    };
  }

  const roleLabel = role ? INTEREST_ROLE_LABELS[role] : "—";
  try {
    await sendMail({
      to: "simon@republicofheat.com",
      replyTo: email,
      subject: `[EHSA 2027] Interest registered (${roleLabel}) from ${name}`,
      text: [
        "New EHSA 2027 interest registration via the press hub.",
        "",
        `Role:        ${roleLabel}`,
        `Name:        ${name}`,
        `Email:       ${email}`,
        organisation ? `Outlet/org:  ${organisation}` : null,
        note ? `Note:        ${note}` : null,
        "",
        `Campaign:    ${CAMPAIGN}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[ehsa-interest] notify failed", err, "id=", id);
  }

  return { ok: true };
}
