"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-helpers";
import {
  createSampleRequest,
  setSampleRequestStatus,
  setSampleRequestAttended,
  asRequestRole,
  asAudience,
  SAMPLE_REQUEST_STATUSES,
  type SampleRequestStatus,
} from "@/lib/sample-requests";

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
