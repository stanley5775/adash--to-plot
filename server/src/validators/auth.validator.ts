import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),

  email: z.string().trim().email("Invalid email address"),

  phoneNumber: z.string().trim().min(10, "Invalid phone number"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),

  newPassword: z.string().min(8, "Password must be at least 8 characters"),

  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});
