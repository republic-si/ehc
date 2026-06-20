"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_auth";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function loginAction(formData: FormData): Promise<void> {
  const expected = process.env.ADMIN_PASS;
  if (!expected) {
    redirect("/admin/login?err=config");
  }
  const supplied = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/admin/events");
  const next = nextRaw.startsWith("/admin") ? nextRaw : "/admin/events";

  if (supplied !== expected) {
    redirect(`/admin/login?err=wrong&next=${encodeURIComponent(next)}`);
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/admin/login");
}
