"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  updateEvent,
  TARGET_TIERS,
  STATUS_VALUES,
  type TargetTier,
  type EventStatus,
} from "@/lib/events";

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

  await updateEvent(id, {
    notes: str(formData, "notes"),
    stallCost: str(formData, "stall_cost"),
    crowdSize: str(formData, "crowd_size"),
    targetTier: tier as TargetTier | undefined,
    status,
    email: str(formData, "email"),
    organiserWebsite: str(formData, "organiser_website"),
    lastContact: dateOrNull(str(formData, "last_contact")),
    deadline: dateOrNull(str(formData, "deadline")),
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin/events/weekend");
  redirect(`/admin/events/${id}?saved=1`);
}
