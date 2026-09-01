import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-session-constants";

/**
 * Protects every /admin route except /admin/login. This only checks for the
 * presence of the session cookie (fast, Edge-safe) — full validation of the
 * session (expiry, admin lookup) happens in the Route Handlers under
 * src/app/api/admin/. A missing or already-expired cookie both result in a
 * redirect to /admin/login; an expired-but-present cookie is caught the
 * moment the dashboard calls GET /api/admin/me.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(ADMIN_SESSION_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
