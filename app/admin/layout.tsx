import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveScope } from "@/lib/scope";
import { AdminShell } from "./_shell/AdminShell";

export const metadata: Metadata = {
  title: "Admin — EHC",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts forwards the request path as x-pathname on every /admin/* request.
  const pathname = (await headers()).get("x-pathname") ?? "";

  // Login pages live under /admin/* but must render without the session gate or
  // the shell, mirroring the proxy.ts allow-list, to avoid a redirect loop.
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  // resolveScope() enforces requireSession() and returns the gated scope.
  const { scope, projects } = await resolveScope();

  return (
    <AdminShell scope={scope} projects={projects}>
      {children}
    </AdminShell>
  );
}
