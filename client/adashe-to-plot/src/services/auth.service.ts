/**
 * Mock authentication service.
 *
 * ARCHITECTURE: every function here talks to `src/lib/storage.ts`, never to
 * `localStorage` directly. When a real backend exists, only the bodies of
 * these functions change — to `fetch("/api/auth/...")` calls — while every
 * page/component that imports from this file stays exactly the same.
 *
 * SECURITY NOTE: this is NOT secure authentication. Passwords are kept in
 * plain form in browser storage purely to simulate a login for this
 * prototype. A real backend must hash passwords (e.g. bcrypt/argon2), issue
 * signed session tokens (e.g. JWT/HTTP-only cookies), and never trust the
 * client to say who is logged in.
 */
import type { AuthUser, RegisterInput, LoginInput, AuthResult } from "@/types/auth";
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from "@/lib/storage";
import { isValidEmail, isPasswordValid } from "@/lib/validators";

interface StoredUser extends AuthUser {
  // NOT a real hash — placeholder only, see security note above.
  password: string;
}

function getUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(STORAGE_KEYS.users, []);
}

function saveUsers(users: StoredUser[]): void {
  writeStorage(STORAGE_KEYS.users, users);
}

function toPublicUser(user: StoredUser): AuthUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  if (!input.fullName.trim()) return { success: false, error: "Full name is required." };
  if (!isValidEmail(input.email)) return { success: false, error: "Enter a valid email address." };
  if (!input.phone.trim()) return { success: false, error: "Phone number is required." };
  if (!isPasswordValid(input.password)) {
    return { success: false, error: "Password does not meet the minimum requirements." };
  }
  if (input.password !== input.confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  writeStorage(STORAGE_KEYS.session, { userId: newUser.id });

  return { success: true, user: toPublicUser(newUser) };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === input.email.trim().toLowerCase());

  if (!user || user.password !== input.password) {
    return { success: false, error: "Invalid email or password." };
  }

  writeStorage(STORAGE_KEYS.session, { userId: user.id, rememberMe: !!input.rememberMe });
  return { success: true, user: toPublicUser(user) };
}

export function logout(): void {
  removeStorage(STORAGE_KEYS.session);
}

export function getCurrentUser(): AuthUser | null {
  const session = readStorage<{ userId?: string } | null>(STORAGE_KEYS.session, null);
  if (!session?.userId) return null;
  const user = getUsers().find((u) => u.id === session.userId);
  return user ? toPublicUser(user) : null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
