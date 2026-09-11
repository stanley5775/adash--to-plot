"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { KeyRound, LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useVerifyOtp } from "../../../hook/useVerifyOtp";
import toast from "react-hot-toast";

type VerifyOtpFormData = {
  otp: string;
};

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const { mutate: verifyOtp, isPending } = useVerifyOtp();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyOtpFormData>();

  function onSubmit(data: VerifyOtpFormData) {
    if (!email) {
      toast.error("Email is missing. Please start again.");

      setError("root", {
        type: "email",
        message: "Email is missing. Please start again.",
      });
      return;
    }

    verifyOtp(
      {
        email,
        otp: data.otp,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push(
            `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(data.otp)}`,
          );
        },

        onError: (error) => {
          toast.error(error.message);
          setError("root", {
            type: "server",
            message: error.message || "Invalid or expired OTP.",
          });
        },
      },
    );
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            <KeyRound className="h-3.5 w-3.5" />
            Verification
          </span>

          <h1 className="mt-4 text-2xl font-bold text-navy-950">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-ink-500">
            Enter the 6-digit verification code sent to
          </p>

          <p className="mt-1 text-sm font-semibold text-navy-800">{email}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4">
          <Input
            label="Verification code"
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            autoComplete="one-time-code"
            {...register("otp", {
              required: "OTP is required.",
              pattern: {
                value: /^\d{6}$/,
                message: "OTP must be exactly 6 digits.",
              },
            })}
          />

          {errors.otp && (
            <p className="text-xs text-status-sold">{errors.otp.message}</p>
          )}

          {errors.root && (
            <p className="rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-3 py-2.5 text-sm text-status-sold">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
