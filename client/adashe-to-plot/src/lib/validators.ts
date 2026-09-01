import type { PasswordCheck } from "@/types/auth";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export function checkPassword(password: string): PasswordCheck[] {
  return [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "At least 1 uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "At least 1 number", passed: /[0-9]/.test(password) },
    { label: "At least 1 special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function isPasswordValid(password: string): boolean {
  return checkPassword(password).every((c) => c.passed);
}
