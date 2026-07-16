"use server";

import { signOut } from "@/auth";

/**
 * Sign out and bounce to /admin/login. Wired into forms via
 * `<form action={logoutAction}>`. Imported by app/admin/events/layout.tsx.
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
