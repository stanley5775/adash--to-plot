import { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

import {
  registerUser,
  loginUser,
  createPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "../services/user.service";
import { generateTokens } from "../utils/jwt";
import { sessions } from "../db/schema";
import { db } from "../db/db";
import { setAuthCookies } from "../utils/cookies";

// REGISTER
export const register = async (c: Context) => {
  try {
    const body = await c.req.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        422,
      );
    }

    const user = await registerUser(result.data);

    return c.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          user,
        },
      },
      201,
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return c.json(
        {
          success: false,
          message: "Email address already exists",
          error: "EMAIL_ALREADY_EXISTS",
        },
        409,
      );
    }

    return c.json(
      {
        success: false,
        message: "Something went wrong",
        error: "INTERNAL_SERVER_ERROR",
      },
      500,
    );
  }
};

// LOGIN
export const login = async (c: Context) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        422,
      );
    }

    // Authenticate user
    const user = await loginUser(result.data);

    // Generate access + refresh tokens
    const { accessToken, refreshToken, refreshExpDate } = await generateTokens(
      user.id,
      user.email,
      user.full_name,
      user.role,
    );

    // Store refresh session
    await db.insert(sessions).values({
      userId: user.id,
      refreshToken,
      expiresAt: refreshExpDate,
    });

    // Store tokens in HTTP-only cookies
    setAuthCookies(c, accessToken, refreshToken);

    return c.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role,
            isActive: user.isActive,
          },
        },
      },
      200,
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return c.json(
        {
          success: false,
          message: "Invalid email or password",
          error: "INVALID_CREDENTIALS",
        },
        401,
      );
    }

    if (error instanceof Error && error.message === "ACCOUNT_DISABLED") {
      return c.json(
        {
          success: false,
          message: "Your account has been disabled",
          error: "ACCOUNT_DISABLED",
        },
        403,
      );
    }

    return c.json(
      {
        success: false,
        message: "Something went wrong",
        error: "INTERNAL_SERVER_ERROR",
      },
      500,
    );
  }
};

// LOGOUT
export const logout = async (c: Context) => {
  deleteCookie(c, "accessToken", {
    path: "/",
  });

  return c.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};

// FORGOT PASSWORD
export const forgotPassword = async (c: Context) => {
  try {
    const body = await c.req.json();

    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        422,
      );
    }

    await createPasswordResetOtp(result.data.email);

    return c.json({
      success: true,
      message: "If an account exists with this email, an OTP has been sent.",
      data: null,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return c.json(
        {
          success: false,
          message: "User not found",
          error: "USER_NOT_FOUND",
        },
        404,
      );
    }

    return c.json(
      {
        success: false,
        message: "Unable to process password reset",
        error: "FORGOT_PASSWORD_FAILED",
      },
      500,
    );
  }
};

// VERIFY OTP
export const verifyOtp = async (c: Context) => {
  try {
    const body = await c.req.json();

    const result = verifyOtpSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        422,
      );
    }

    const verification = await verifyPasswordResetOtp(result.data);

    return c.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        userId: verification.userId,
        otpId: verification.otpId,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "INVALID_OTP") {
      return c.json(
        {
          success: false,
          message: "Invalid OTP",
          error: "INVALID_OTP",
        },
        400,
      );
    }

    if (error instanceof Error && error.message === "OTP_EXPIRED") {
      return c.json(
        {
          success: false,
          message: "OTP has expired",
          error: "OTP_EXPIRED",
        },
        400,
      );
    }

    if (error instanceof Error && error.message === "OTP_ATTEMPTS_EXCEEDED") {
      return c.json(
        {
          success: false,
          message: "Too many OTP attempts",
          error: "OTP_ATTEMPTS_EXCEEDED",
        },
        429,
      );
    }

    return c.json(
      {
        success: false,
        message: "Unable to verify OTP",
        error: "OTP_VERIFICATION_FAILED",
      },
      500,
    );
  }
};

// RESET PASSWORD
export const resetPasswordController = async (c: Context) => {
  try {
    const body = await c.req.json();

    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        422,
      );
    }

    const verification = await verifyPasswordResetOtp({
      email: result.data.email,
      otp: result.data.otp,
    });

    await resetPassword({
      userId: verification.userId,
      otpId: verification.otpId,
      newPassword: result.data.newPassword,
      confirmPassword: result.data.confirmPassword,
    });

    return c.json({
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "PASSWORDS_DO_NOT_MATCH") {
      return c.json(
        {
          success: false,
          message: "Passwords do not match",
          error: "PASSWORDS_DO_NOT_MATCH",
        },
        400,
      );
    }
    if (error instanceof Error && error.message === "INVALID_OTP") {
      return c.json(
        {
          success: false,
          message: "Invalid OTP",
          error: "INVALID_OTP",
        },
        400,
      );
    }

    if (error instanceof Error && error.message === "OTP_EXPIRED") {
      return c.json(
        {
          success: false,
          message: "OTP has expired",
          error: "OTP_EXPIRED",
        },
        400,
      );
    }

    if (error instanceof Error && error.message === "OTP_ATTEMPTS_EXCEEDED") {
      return c.json(
        {
          success: false,
          message: "Too many OTP attempts",
          error: "OTP_ATTEMPTS_EXCEEDED",
        },
        429,
      );
    }

    return c.json(
      {
        success: false,
        message: "Unable to reset password",
        error: "PASSWORD_RESET_FAILED",
      },
      500,
    );
  }
};
