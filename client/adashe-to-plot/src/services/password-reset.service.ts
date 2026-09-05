import type {
  ForgotPasswordInput,
  ForgotPasswordResult,
  ResetPasswordInput,
  ResetPasswordResult,
} from "@/types/password-reset";

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResult> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error:
          result.error ?? "Unable to process your request. Please try again.",
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Forgot password request failed:", error);

    return {
      success: false,
      error: "Unable to connect to the server. Please try again.",
    };
  }
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<ResetPasswordResult> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error:
          result.error ?? "Unable to reset your password. Please try again.",
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Reset password request failed:", error);

    return {
      success: false,
      error: "Unable to connect to the server. Please try again.",
    };
  }
}
