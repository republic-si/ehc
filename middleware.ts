import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/2026-ehsa-press/:path*", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
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
