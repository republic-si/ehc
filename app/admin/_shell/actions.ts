"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-helpers";
import {
  PROJECT_COOKIE,
  getUserProjects,
  scopeFromToken,
} from "@/lib/scope";

// Persist the selected project. The token is re-validated against the user's
// allowed set via scopeFromToken (out-of-scope / unknown tokens fall back to
// their default), and we store the resulting CANONICAL token — so a crafted
// cookie can never widen access. Wired into the switcher's <form action>.
export async function setProjectAction(formData: FormData): Promise<void> {
  const requested = String(formData.get("token") ?? "all");
  const { user } = await requireSession();
  const projects = await getUserProjects(user);
  const scope = scopeFromToken(requested, user, projects);

  const store = await cookies();
  store.set(PROJECT_COOKIE, scope.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  // Re-render every /admin page under the new scope.
  revalidatePath("/admin", "layout");
}
