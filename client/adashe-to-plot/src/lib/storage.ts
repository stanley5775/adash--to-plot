/**
 * A single, narrow abstraction over browser storage.
 *
 * No other file in this project should call `localStorage` directly — every
 * read/write goes through here, so that when a real backend exists, this
 * file (and only this file) needs to change: reads become API/fetch calls,
 * writes become POST/PATCH requests, and callers (services/hooks) don't change.
 *
 * SECURITY NOTE: localStorage is not secure storage. It must never be treated
 * as a substitute for real, server-side authentication or payment
 * verification — see src/services/auth.service.ts and
 * src/services/payment.service.ts for the boundary this crosses later.
 */

const NAMESPACE = "adashe_to_plot";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function key(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export function readStorage<T>(name: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(name: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // Storage can fail (quota, private browsing, etc.) — fail silently in
    // this prototype rather than crash the UI. A real backend removes this
    // failure mode entirely.
  }
}

export function removeStorage(name: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key(name));
}

export const STORAGE_KEYS = {
  users: "users",
  session: "session",
  applications: "applications",
  payments: "payments",
} as const;
