import type {
  ForgotPasswordInput,
  ForgotPasswordResult,
  VerifyResetOtpInput,
  VerifyResetOtpResult,
  ResetPasswordInput,
  ResetPasswordResult,
} from "@/types/password-reset";

async function parseResponse(
  response: Response,
): Promise<Record<string, unknown>> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResult> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    const result = await parseResponse(response);

    if (!response.ok || result.success !== true) {
      return {
        success: false,
        error:
          typeof result.error === "string"
            ? result.error
            : "Unable to send OTP. Please try again.",
      };
    }

    return {
      success: true,
      message: typeof result.message === "string" ? result.message : undefined,
    };
  } catch (error) {
    console.error("Forgot password request failed:", error);

    return {
      success: false,
      error: "Unable to connect to the server. Please try again.",
    };
  }
}

export async function verifyResetOtp(
  input: VerifyResetOtpInput,
): Promise<VerifyResetOtpResult> {
  try {
    const response = await fetch("/api/auth/verify-reset-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    const result = await parseResponse(response);

    if (!response.ok || result.success !== true) {
      return {
        success: false,
        error:
          typeof result.error === "string"
            ? result.error
            : "Invalid or expired OTP.",
      };
    }

    return {
      success: true,
      message: typeof result.message === "string" ? result.message : undefined,
      resetToken:
        typeof result.resetToken === "string" ? result.resetToken : undefined,
    };
  } catch (error) {
    console.error("Verify reset OTP request failed:", error);

    return {
      success: false,
      error: "Unable to verify the OTP. Please try again.",
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
      credentials: "include",
      body: JSON.stringify(input),
    });

    const result = await parseResponse(response);

    if (!response.ok || result.success !== true) {
      return {
        success: false,
        error:
          typeof result.error === "string"
            ? result.error
            : "Unable to reset your password. Please try again.",
      };
    }

    return {
      success: true,
      message: typeof result.message === "string" ? result.message : undefined,
    };
  } catch (error) {
    console.error("Reset password request failed:", error);

    return {
      success: false,
      error: "Unable to connect to the server. Please try again.",
    };
  }
}
