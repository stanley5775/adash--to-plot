"use client";

import { Suspense, useRef, useState } from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { CheckCircle2, KeyRound, LoaderCircle, Mail } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  forgotPassword,
  verifyResetOtp,
} from "@/services/password-reset.service";

type ForgotPasswordFormData = {
  email: string;
};

const OTP_LENGTH = 6;

function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

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

    setEmail(data.email);
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setStep("otp");

    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setOtpError("");

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (updatedOtp.every((item) => item !== "")) {
      void verifyOtp(updatedOtp.join(""));
    }
  }

  function handleOtpKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function verifyOtp(code: string) {
    if (isVerifying) return;

    setIsVerifying(true);
    setOtpError("");

    const result = await verifyResetOtp({
      email,
      otp: code,
    });

    setIsVerifying(false);

    if (!result.success) {
      setOtpError(result.error ?? "Invalid or expired OTP.");

      setOtp(Array(OTP_LENGTH).fill(""));

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);

      return;
    }

    if (!result.resetToken) {
      setOtpError("OTP verified, but the reset session could not be created.");
      return;
    }

    sessionStorage.setItem("adashe_reset_token", result.resetToken);

    sessionStorage.setItem("adashe_reset_email", email);

    window.location.href = "/reset-password";
  }

  if (step === "success") {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-status-available/10">
            <CheckCircle2 className="h-7 w-7 text-status-available" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-navy-950">
            OTP verified
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            Your OTP has been verified successfully.
          </p>

          <Link
            href="/reset-password"
            className="mt-6 inline-flex font-semibold text-navy-800 hover:text-gold-600"
          >
            Continue to Reset Password
          </Link>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
              <KeyRound className="h-3.5 w-3.5" />
              Account recovery
            </span>

            <h1 className="mt-4 text-2xl font-bold text-navy-950">
              Enter verification code
            </h1>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="font-semibold text-navy-800">{email}</span>.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  disabled={isVerifying}
                  aria-label={`OTP digit ${index + 1}`}
                  className="h-12 w-10 rounded-xl border border-navy-800/15 bg-white text-center text-lg font-bold text-navy-950 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 sm:h-14 sm:w-12"
                />
              ))}
            </div>

            {isVerifying && (
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Verifying OTP…
              </div>
            )}

            {otpError && (
              <p className="mt-4 rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-3 py-2.5 text-center text-sm text-status-sold">
                {otpError}
              </p>
            )}

            <p className="mt-6 text-center text-xs leading-5 text-ink-400">
              Enter all 6 digits. Verification will happen automatically.
            </p>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp(Array(OTP_LENGTH).fill(""));
                setOtpError("");
              }}
              className="mt-6 block w-full text-center text-sm font-semibold text-navy-800 hover:text-gold-600"
            >
              Use a different email
            </button>
          </div>
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
            and we&apos;ll send you a verification code.
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
                Sending OTP…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send OTP
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
