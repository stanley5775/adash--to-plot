"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { KeyRound, LoaderCircle, Mail } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForgotPassword } from "../../../hook/useForgotPassword";
import toast from "react-hot-toast";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  function onSubmit(formData: ForgotPasswordFormData) {
    forgotPassword(
      {
        email: formData.email,
      },
      {
        onSuccess: (data) => {
          console.log(data, "forget");
          toast.success(data.message);
          router.push(
            `/verify-otp?email=${encodeURIComponent(formData.email)}`,
          );
        },
        onError: (error) => {
          toast.error(error.message);
          setError("root", {
            type: "server",
            message: error.message || "Unable to send verification code.",
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
            Account recovery
          </span>

          <h1 className="mt-4 text-2xl font-bold text-navy-950">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-ink-500">
            Enter the email address associated with your Adashè-to-Plot account
            and we&apos;ll send you a verification code.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4">
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

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Sending code…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Verification Code
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
