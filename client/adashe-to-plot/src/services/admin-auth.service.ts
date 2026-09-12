/**
 * Admin authentication service — the ONLY thing the admin login UI talks to.
 *
 *   Admin Login (UI)
 *     -> adminLogin() / getCurrentAdmin() / adminLogout()   (this file)
 *     -> POST /api/admin/login, GET /api/admin/me, POST /api/admin/logout
 *     -> Backend authentication (currently a mock store, see
 *        src/lib/server/admin-mock-db.ts)
 *     -> Authenticated Admin
 *     -> Existing Admin Dashboard
 *
 * When a real backend/database is connected, only the Route Handlers under
 * src/app/api/admin/ change — this service and every component that calls
 * it stay exactly the same.
 */
import type { AdminLoginInput, AdminAuthResult, AdminUser } from "@/types/admin-auth";

export async function adminLogin(input: AdminLoginInput): Promise<AdminAuthResult> {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error ?? "Invalid email or password." };
    }
    return { success: true, admin: data.admin as AdminUser };
  } catch {
    return { success: false, error: "Something went wrong. Please check your connection and try again." };
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const response = await fetch("/api/admin/me", { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return (data.admin as AdminUser) ?? null;
  } catch {
    return null;
  }
}
