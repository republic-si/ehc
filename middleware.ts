import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/2026-ehsa-press/:path*", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // /admin/*: cookie-gated by ADMIN_PASS env var. Unauthed traffic
  // gets bounced to /admin/login (which is itself exempt).
  if (path.startsWith("/admin")) {
    if (path === "/admin/login") {
      return NextResponse.next();
    }
    const expected = process.env.ADMIN_PASS;
    if (!expected) {
      return new NextResponse("Auth not configured", { status: 503 });
    }
    const cookie = req.cookies.get("admin_auth")?.value;
    if (cookie !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", path + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // /2026-ehsa-press/*: HTTP Basic via DASH_USER / DASH_PASS (unchanged).
  const auth = req.headers.get("authorization");
  const user = process.env.DASH_USER;
  const pass = process.env.DASH_PASS;
  if (!user || !pass) {
    return new NextResponse("Auth not configured", { status: 503 });
  }
  const expected = "Basic " + btoa(`${user}:${pass}`);
  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="EHSA Press 2026"' },
    });
  }
  return NextResponse.next();
}
