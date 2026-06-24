"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  updateEvent,
  getEvent,
  TARGET_TIERS,
  STATUS_VALUES,
  type TargetTier,
  type EventStatus,
} from "@/lib/events";
import { translateNoteToEnglish } from "@/lib/translate";

async function assertAuth(): Promise<void> {
  const user = process.env.DASH_USER;
  const pass = process.env.DASH_PASS;
  if (!user || !pass) throw new Error("Auth not configured");
  const h = await headers();
  const got = h.get("authorization");
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  if (got !== expected) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  if (v == null) return undefined;
  return String(v);
}

function dateOrNull(v: string | undefined): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === "") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v.trim())) return v.trim();
  return null;
}

function numberOrNull(v: string | undefined): number | null | undefined {
  if (v === undefined) return undefined;
  const t = v.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export async function updateEventAction(formData: FormData): Promise<void> {
  await assertAuth();
  const id = str(formData, "id");
  if (!id) throw new Error("Missing id");

  const tier = str(formData, "target_tier");
  const status = str(formData, "status");
  if (tier !== undefined && !TARGET_TIERS.includes(tier as TargetTier)) {
    throw new Error(`Invalid target_tier: ${tier}`);
  }
  if (status !== undefined && !STATUS_VALUES.includes(status as EventStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const newNotes = str(formData, "notes");
  let notesEn: string | undefined;
  if (newNotes !== undefined && newNotes !== "") {
    const current = await getEvent(id);
    if (current && current.notes !== newNotes) {
      try {
        notesEn = await translateNoteToEnglish(newNotes);
      } catch (err) {
        console.error("Note translation failed, falling back:", err);
        notesEn = newNotes;
      }
    }
  } else if (newNotes === "") {
    notesEn = "";
  }

  await updateEvent(id, {
    notes: newNotes,
    notesEn,
    stallCost: str(formData, "stall_cost"),
    crowdSize: str(formData, "crowd_size"),
    targetTier: tier as TargetTier | undefined,
    status,
    email: str(formData, "email"),
    organiserWebsite: str(formData, "organiser_website"),
    lastContact: dateOrNull(str(formData, "last_contact")),
    deadline: dateOrNull(str(formData, "deadline")),
    booked: formData.get("booked") === "on",
    standCost: numberOrNull(str(formData, "stand_cost")),
    hotelCost: numberOrNull(str(formData, "hotel_cost")),
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin/events/weekend");
  redirect(`/admin/events/${id}?saved=1`);
}

export async function markNotInterestedAction(eventId: string): Promise<void> {
  await assertAuth();
  if (!eventId) throw new Error("Missing eventId");
  await updateEvent(eventId, { targetTier: "not_interested" });
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}
