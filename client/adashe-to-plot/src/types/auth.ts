/**
 * Auth types for the frontend-only prototype.
 *
 * IMPORTANT: This is NOT a secure authentication system. Passwords are stored
 * in browser localStorage purely to simulate a signed-in state for the demo.
 * See src/services/auth.service.ts for the architectural boundary that will
 * later be replaced by a real backend authentication API.
 */
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface PasswordCheck {
  label: string;
  passed: boolean;
}
