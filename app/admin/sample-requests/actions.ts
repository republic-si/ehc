"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-helpers";
import {
  createSampleRequest,
  setSampleRequestStatus,
  setSampleRequestAttended,
  setSampleRequestLabel,
  getSampleRequestById,
  asRequestRole,
  asAudience,
  SAMPLE_REQUEST_STATUSES,
  type SampleRequestStatus,
} from "@/lib/sample-requests";
import { generateSampleLabel } from "@/lib/dhl";

export async function updateSampleRequestStatus(
  formData: FormData,
): Promise<void> {
  await requireSession();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!id) return;
  if (!(SAMPLE_REQUEST_STATUSES as readonly string[]).includes(status)) return;

  await setSampleRequestStatus(id, status as SampleRequestStatus);
  revalidatePath("/admin/sample-requests");
}

// Mint a DHL shipping label for a sample box and mark the row shipped. Uses the
// shared ROH DHL account (see lib/dhl.ts). Idempotent + cost-safe: if a label
// already exists we never re-mint (which would re-bill) — the admin reprints the
// stored PDF instead. Errors (bad country, incomplete address, DHL rejection)
// bounce back to the list with the message in ?labelError so the admin sees why.
export async function printSampleLabel(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("id") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "status=approved");
  if (!id) return;

  const base = `/admin/sample-requests?${returnTo}`;

  const row = await getSampleRequestById(id);
  if (!row) {
    redirect(`${base}&labelError=${encodeURIComponent("Request not found")}&labelFor=${id}`);
  }
  // Already labelled — do not re-mint (would re-charge). Just refresh.
  if (row.dhlLabelUrl) {
    redirect(base);
  }

  let errorMsg: string | null = null;
  try {
    const label = await generateSampleLabel({
      name: row.name,
      name2: row.organisation || undefined,
      street: row.addrStreet,
      postcode: row.addrPostcode,
      city: row.addrCity,
      country: row.addrCountry,
      email: row.email || undefined,
      reference: `EHC-SAMPLE-${id}`,
    });
    await setSampleRequestLabel(id, label.trackingNumber, label.labelUrl);
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Label generation failed";
  }

  revalidatePath("/admin/sample-requests");
  if (errorMsg) {
    redirect(`${base}&labelError=${encodeURIComponent(errorMsg)}&labelFor=${id}`);
  }
  // The row just flipped to 'shipped', so it's gone from the Approved view.
  // Land on the Shipped view (keeping source/audience) where its new
  // "Print label" button now lives, instead of an empty-looking Approved list.
  const success = new URLSearchParams(returnTo);
  success.set("status", "shipped");
  success.set("labelFor", id);
  redirect(`/admin/sample-requests?${success.toString()}`);
}

export async function toggleAttended(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("id") ?? "").trim();
  const attended = String(formData.get("attended") ?? "") === "true";
  if (!id) return;

  await setSampleRequestAttended(id, attended);
  revalidatePath("/admin/sample-requests");
}

// Hand-enter a lead that arrived by email reply (not the public form). Lands
// approved by default since they've usually already said yes. Bare-minimum
// validation — admins know what they're keying.
export async function createManualRequest(formData: FormData): Promise<void> {
  await requireSession();

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const on = (k: string) => formData.get(k) != null;

  const name = get("name");
  const email = get("email");
  if (!name || !email) return;

  // Trade buyers are a distinct outbound channel (confirmed invites, box on the
  // door). Tag their source so they read apart from press email-reply leads.
  const audience = asAudience(get("audience"));
  const source = audience === "trade" ? "trade" : "email-reply";

  await createSampleRequest({
    name,
    email,
    organisation: get("organisation"),
    webOrInstagram: get("web_or_instagram"),
    addrStreet: get("addr_street"),
    addrPostcode: get("addr_postcode"),
    addrCity: get("addr_city"),
    addrCountry: get("addr_country"),
    note: get("note"),
    source,
    role: asRequestRole(get("role")),
    audience,
    wantsSamples: on("wants_samples"),
    wantsPressEvening: on("wants_press_evening"),
    status: "approved",
  });
  revalidatePath("/admin/sample-requests");
}
