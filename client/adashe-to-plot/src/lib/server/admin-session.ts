/**
 * Mock admin session token encode/decode.
 *
 * This is NOT a real signed session (no HMAC/JWT signature) — it is a
 * stand-in so the login flow behaves like a real cookie-based session while
 * everything runs inside this frontend prototype. A real backend should
 * replace this with signed JWTs or an opaque token backed by a session
 * store, and should rotate/verify signatures server-side.
 *
 * Server-only: used by Route Handlers (Node runtime), never by client code
 * or by src/middleware.ts (which only checks for the cookie's presence).
 */
import type { AdminUser } from "@/types/admin-auth";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface SessionPayload extends AdminUser {
  expiresAt: number;
}

export function createSessionToken(admin: AdminUser): string {
  const payload: SessionPayload = { ...admin, expiresAt: Date.now() + SESSION_TTL_MS };
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64");
}

export function parseSessionToken(token: string): AdminUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8")) as SessionPayload;
    if (!payload.expiresAt || payload.expiresAt < Date.now()) return null;
    return { id: payload.id, fullName: payload.fullName, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}
