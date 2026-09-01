/**
 * POST /api/admin/login
 *
 * Backend-ready admin authentication route. Currently checks credentials
 * against a temporary mock admin store (see src/lib/server/admin-mock-db.ts)
 * and issues a mock session cookie. Replace the body of this handler with a
 * real database lookup + password hash comparison when the backend exists —
 * the request/response contract (and therefore the frontend) does not need
 * to change.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_ADMINS } from "@/lib/server/admin-mock-db";
import { createSessionToken } from "@/lib/server/admin-session";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-session-constants";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
  }

  // TODO(backend): replace with a real database lookup + hashed password check.
  const record = MOCK_ADMINS.find((a) => a.email.toLowerCase() === email.toLowerCase());

  if (!record || record.password !== password) {
    return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
  }

  const admin = { id: record.id, fullName: record.fullName, email: record.email, role: record.role };
  const token = createSessionToken(admin);

  const response = NextResponse.json({ success: true, admin });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}
