"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveScope, campaignToReportKey } from "@/lib/scope";
import { fetchAuthority } from "@/lib/authority";
import {
  upsertPickup,
  updatePickup,
  deletePickup,
  setPickupFp,
  type PickupInput,
} from "@/lib/coverage";

function str(fd: FormData, k: string): string {
  const v = fd.get(k);
  return v == null ? "" : String(v).trim();
}
function numOrNull(fd: FormData, k: string): number | null {
  const t = str(fd, k).replace(/[, ]/g, "");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
function dateOrNull(fd: FormData, k: string): string | null {
  const t = str(fd, k);
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
}

// Gate: only a superadmin or a member of the campaign's org may write. Returns
// the campaign slug once authorised, else throws.
async function gate(fd: FormData): Promise<string> {
  const campaignSlug = str(fd, "campaign_slug");
  const { projects, user } = await resolveScope();
  const allowed =
    user.role === "superadmin" ||
    projects.some((p) => p.campaignSlug === campaignSlug);
  if (!campaignSlug || !allowed) throw new Error("forbidden");
  return campaignSlug;
}

function bounce(campaignSlug: string): never {
  const key = campaignToReportKey(campaignSlug);
  revalidatePath(`/admin/coverage/${key}`);
  revalidatePath("/admin/coverage");
  redirect(`/admin/coverage/${key}`);
}

export async function savePickupAction(fd: FormData): Promise<void> {
  const campaignSlug = await gate(fd);

  const articleUrl = str(fd, "article_url");
  const makerSlug = str(fd, "maker_slug");
  if (!articleUrl || !makerSlug) bounce(campaignSlug); // required identity

  // Refresh domain authority from OpenPageRank; keep the prior value on failure.
  const outletUrl = str(fd, "outlet_url");
  const auth = outletUrl ? await fetchAuthority(outletUrl) : null;
  const domainAuthority = auth ? auth.domainAuthority : str(fd, "domain_authority");

  const input: PickupInput = {
    articleUrl,
    makerSlug,
    outletName: str(fd, "outlet_name"),
    outletUrl,
    dateSpotted: dateOrNull(fd, "date_spotted"),
    language: str(fd, "language"),
    country: str(fd, "country"),
    medium: str(fd, "medium") || "web",
    scope: str(fd, "scope"),
    position: str(fd, "position_of_mention"),
    monthlyVisits: numOrNull(fd, "monthly_visits_est"),
    mentionsEhsa: str(fd, "mentions_ehsa"),
    mentionsRoh: str(fd, "mentions_roh"),
    linkEhsaSite: str(fd, "link_ehsa_site"),
    followLinkRoh: str(fd, "follow_link_to_roh"),
    domainAuthority,
    notes: str(fd, "notes"),
    isFalsePositive: fd.get("is_false_positive") != null,
    campaignSlug,
  };

  const oldUrl = str(fd, "old_article_url");
  const oldMaker = str(fd, "old_maker_slug");
  if (oldUrl && oldMaker) {
    await updatePickup(oldUrl, oldMaker, input);
  } else {
    await upsertPickup(input);
  }
  bounce(campaignSlug);
}

export async function deletePickupAction(fd: FormData): Promise<void> {
  const campaignSlug = await gate(fd);
  const url = str(fd, "article_url");
  const maker = str(fd, "maker_slug");
  if (url && maker) await deletePickup(url, maker);
  bounce(campaignSlug);
}

export async function toggleFpAction(fd: FormData): Promise<void> {
  const campaignSlug = await gate(fd);
  const url = str(fd, "article_url");
  const maker = str(fd, "maker_slug");
  const isFp = str(fd, "is_false_positive") === "true";
  if (url && maker) await setPickupFp(url, maker, isFp);
  bounce(campaignSlug);
}
