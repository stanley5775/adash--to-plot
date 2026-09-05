"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { resetPassword } from "@/services/password-reset.service";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  const password = watch("password", "");

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) {
      setError("root", {
        type: "token",
        message: "This password reset link is invalid or incomplete.",
      });
      return;
    }

    const result = await resetPassword({
      token,
      password: data.password,
    });

    if (!result.success) {
      setError("root", {
        type: "server",
        message:
          result.error ?? "Unable to reset your password. Please try again.",
      });
      return;
    }

    setSuccess(true);
  }

  if (!token) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 text-center sm:p-10">
          <KeyRound className="mx-auto h-10 w-10 text-status-sold" />

          <h1 className="mt-5 text-2xl font-bold text-navy-950">
            Invalid reset link
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            This password reset link is missing a valid reset token.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-flex font-semibold text-navy-800 hover:text-gold-600"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-status-available/10">
            <CheckCircle2 className="h-7 w-7 text-status-available" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-navy-950">
            Password reset successful
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            Your password has been updated successfully. You can now log in
            using your new password.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex font-semibold text-navy-800 hover:text-gold-600"
          >
            Continue to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            <KeyRound className="h-3.5 w-3.5" />
            New password
          </span>

          <h1 className="mt-4 text-2xl font-bold text-navy-950">
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-ink-500">
            Create a new password for your Adashè-to-Plot account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <div className="relative">
            <Input
              label="New password"
              id="reset-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              autoComplete="new-password"
              className="pr-12"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                  message:
                    "Password must contain an uppercase letter, number and special character.",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-[34px] rounded-lg p-2 text-ink-400 hover:text-navy-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-status-sold">
              {errors.password.message}
            </p>
          )}

          <PasswordChecklist password={password} />

          <div className="relative">
            <Input
              label="Confirm new password"
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              className="pr-12"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute right-3 top-[34px] rounded-lg p-2 text-ink-400 hover:text-navy-800"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs text-status-sold">
              {errors.confirmPassword.message}
            </p>
          )}

          {errors.root && (
            <p className="rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-3 py-2.5 text-sm text-status-sold">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Resetting password…
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-navy-800 hover:text-gold-600"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}