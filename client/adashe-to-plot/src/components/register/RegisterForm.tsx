"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { useRegister } from "../../../hook/useRegister";
import toast from "react-hot-toast";

export function RegisterForm() {
  type RegisterFormData = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const router = useRouter();

  const { mutate: registerUser, isPending } = useRegister();

  function onSubmit(data: RegisterFormData) {
    registerUser(
      {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Regitration is sucessful");
          reset();
          router.push("/login");
        },
        onError: (error) => {
          toast.error(error.message);
          setError("root", {
            type: "server",
            message: error.message || "Something went wrong. Please try again.",
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
            <UserPlus className="h-3.5 w-3.5" /> Create your account
          </span>
          <h1 className="mt-4 text-2xl font-bold text-navy-950">Register</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Create an account to start your Land Application.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4">
          <Input
            label="Full name"
            id="r-name"
            placeholder="e.g. Amaka Johnson"
            autoComplete="name"
            {...register("fullName", {
              required: "Full name is required.",
              minLength: {
                value: 2,
                message: "Enter your full name.",
              },
            })}
          />

          {errors.fullName && (
            <p className="text-xs text-status-sold">
              {errors.fullName.message}
            </p>
          )}

          <Input
            label="Email address"
            id="r-email"
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

          <Input
            label="Phone number"
            id="r-phone"
            type="tel"
            placeholder="e.g. 0803 123 4567"
            autoComplete="tel"
            {...register("phone", {
              required: "Phone number is required.",
            })}
          />

          {errors.phone && (
            <p className="text-xs text-status-sold">{errors.phone.message}</p>
          )}

          <Input
            label="Password"
            id="r-password"
            type="password"
            placeholder="e.g. Stanley@123"
            autoComplete="new-password"
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

          <PasswordChecklist password={password} />

          {errors.password && (
            <p className="text-xs text-status-sold">
              {errors.password.message}
            </p>
          )}

          <Input
            label="Confirm password"
            id="r-confirm"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === password || "Passwords do not match.",
            })}
          />

          {errors.confirmPassword && (
            <p className="text-xs text-status-sold">
              {errors.confirmPassword.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 disabled:cursor-not-allowed disabled:opacity-50">
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-navy-800 hover:text-gold-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
