/**
 * POST /api/admin/logout
 *
 * Clears the admin session cookie. A real backend should also invalidate
 * the session/token server-side (e.g. delete the session row, blacklist the
 * JWT) rather than only clearing the client's cookie.
 */
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-session-constants";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
