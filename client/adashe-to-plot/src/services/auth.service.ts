import type {
  AuthResult,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "@/types/auth";

async function parseResponse(response: Response): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
}> {
  try {
    return await response.json();
  } catch {
    return {
      success: false,
      error: "Unable to process the server response.",
    };
  }
}

/**
 * Register a new customer account.
 *
 * The backend will create the user, hash the password and establish
 * the authenticated session.
 */
export async function register(input: RegisterInput): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    const result = await parseResponse(response);

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error ?? "Unable to create your account.",
      };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Registration request failed:", error);

    return {
      success: false,
      error: "Unable to connect to the server. Please try again.",
    };
  }
}

/**
 * Log in an existing customer.
 *
 * Authentication/session handling belongs to the backend.
 * No password or session data is stored in localStorage.
 */
export async function login(input: LoginInput): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    const result = await parseResponse(response);

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error ?? "Invalid email or password.",
      };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Login request failed:", error);

    return {
      success: false,
      error: "Unable to connect to the server. Please try again.",
    };
  }
}

/**
 * Log out the currently authenticated customer.
 */
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  }
}

/**
 * Get the currently authenticated customer from the backend session.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await parseResponse(response);

    return result.success && result.user ? result.user : null;
  } catch (error) {
    console.error("Get current user request failed:", error);
    return null;
  }
}

/**
 * Check whether a customer currently has a valid backend session.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
