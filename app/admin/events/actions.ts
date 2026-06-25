"use server";

import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  updateEvent,
  getEvent,
  EVENTS_CACHE_TAG,
  TARGET_TIERS,
  STATUS_VALUES,
  type TargetTier,
  type EventStatus,
} from "@/lib/events";
import { translateNoteToEnglish } from "@/lib/translate";

// Bust both the shared events tag AND the current event-admin paths so the
// user sees their own write on the next render (read-your-own-writes).
function bustEventsCache(eventId?: string): void {
  revalidateTag(EVENTS_CACHE_TAG, "max");
  revalidatePath("/admin/events");
  revalidatePath("/admin/events/table");
  revalidatePath("/admin/events/deadlines");
  if (eventId) revalidatePath(`/admin/events/${eventId}`);
}

async function assertAuth(): Promise<void> {
  const expected = process.env.ADMIN_PASS;
  if (!expected) throw new Error("Auth not configured");
  const jar = await cookies();
  if (jar.get("admin_auth")?.value !== expected) {
    throw new Error("Unauthorized");
  }
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
  const newUpdates = str(formData, "updates");
  const current =
    newNotes !== undefined || newUpdates !== undefined
      ? await getEvent(id)
      : null;

  async function ensureTranslated(
    field: "notes" | "updates",
    newValue: string | undefined,
  ): Promise<string | undefined> {
    if (newValue === undefined) return undefined;
    if (newValue === "") return "";
    if (!current) return undefined;
    const enField = field === "notes" ? "notesEn" : "updatesEn";
    const changed = current[field] !== newValue;
    const stillEmpty = current[enField] === "";
    if (!changed && !stillEmpty) return undefined;
    try {
      return await translateNoteToEnglish(newValue);
    } catch (err) {
      console.error(`${field} translation failed, leaving empty:`, err);
      return "";
    }
  }

  const notesEn = await ensureTranslated("notes", newNotes);
  const updatesEn = await ensureTranslated("updates", newUpdates);

  await updateEvent(id, {
    notes: newNotes,
    notesEn,
    updates: newUpdates,
    updatesEn,
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

  bustEventsCache(id);
  redirect(`/admin/events/${id}?saved=1`);
}

async function setTierAction(
  eventId: string,
  tier: TargetTier,
): Promise<void> {
  await assertAuth();
  if (!eventId) throw new Error("Missing eventId");
  await updateEvent(eventId, { targetTier: tier });
  bustEventsCache(eventId);
}

export async function markInterestedAction(eventId: string): Promise<void> {
  return setTierAction(eventId, "we_want_to_go");
}

export async function markPriorityAction(eventId: string): Promise<void> {
  return setTierAction(eventId, "priority_for_us");
}

export async function markPotentialAction(eventId: string): Promise<void> {
  return setTierAction(eventId, "potential");
}

export async function markNotInterestedAction(eventId: string): Promise<void> {
  return setTierAction(eventId, "not_interested");
}

export async function refreshEventsAction(): Promise<void> {
  await assertAuth();
  bustEventsCache();
}
