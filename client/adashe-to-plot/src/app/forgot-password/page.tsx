"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { CheckCircle2, KeyRound, LoaderCircle, Mail } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { forgotPassword } from "@/services/password-reset.service";

type ForgotPasswordFormData = {
  email: string;
};

function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  async function onSubmit(data: ForgotPasswordFormData) {
    const result = await forgotPassword(data);

    if (!result.success) {
      setError("root", {
        type: "server",
        message:
          result.error ?? "Unable to process your request. Please try again.",
      });
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-status-available/10">
            <CheckCircle2 className="h-7 w-7 text-status-available" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-navy-950">
            Check your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            If an account exists with that email address, we&apos;ve sent a
            password reset link.
          </p>

          <p className="mt-3 text-xs leading-5 text-ink-400">
            Check your inbox and spam folder.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex font-semibold text-navy-800 hover:text-gold-600"
          >
            Back to Log In
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
            Account recovery
          </span>

          <h1 className="mt-4 text-2xl font-bold text-navy-950">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-ink-500">
            Enter the email address associated with your Adashè-to-Plot account
            and we&apos;ll send you a secure password reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <Input
            label="Email address"
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email", {
              required: "Email address is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />

          {errors.email && (
            <p className="text-xs text-status-sold">{errors.email.message}</p>
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
                Sending reset link…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Reset Link
              </>
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

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
