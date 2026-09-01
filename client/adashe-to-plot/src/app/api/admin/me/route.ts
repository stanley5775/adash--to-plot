/**
 * GET /api/admin/me
 *
 * Returns the currently authenticated admin based on the session cookie, or
 * a 401 if there isn't one / it has expired. Used by the frontend to
 * display the logged-in admin's name and to confirm the session is still
 * valid before rendering protected admin UI.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSessionToken } from "@/lib/server/admin-session";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-session-constants";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const admin = token ? parseSessionToken(token) : null;

  if (!admin) {
    return NextResponse.json({ success: false, admin: null }, { status: 401 });
  }

  return NextResponse.json({ success: true, admin });
}
