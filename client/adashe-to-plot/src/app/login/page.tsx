"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { LogIn, LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/services/auth.service";
import { adminLogin } from "@/services/admin-auth.service";

type LoginFormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/application";

  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);

    // Try admin login first
    const adminResult = await adminLogin({
      email: data.email,
      password: data.password,
    });

    if (adminResult.success) {
      const adminRedirect = redirectTo.startsWith("/admin")
        ? redirectTo
        : "/admin";

      router.push(adminRedirect);
      router.refresh();
      return;
    }

    // If not admin, try normal user login
    const result = await login({
      email: data.email,
      password: data.password,
      rememberMe,
    });

    if (!result.success) {
      setFormError("root", {
        type: "server",
        message: "Invalid email or password.",
      });
      return;
    }

    router.push(redirectTo);
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            <LogIn className="h-3.5 w-3.5" />
            Welcome back
          </span>

          <h1 className="mt-4 text-2xl font-bold text-navy-950">Log In</h1>

          <p className="mt-1.5 text-sm text-ink-500">
            Log in to continue your Land Application or view your dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <div>
            <Input
              label="Email address"
              id="l-email"
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
              <p className="mt-1 text-xs text-status-sold">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              id="l-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required.",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-xs text-status-sold">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-navy-800/20 text-navy-800 focus:ring-navy-600"
              />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="font-semibold text-navy-700 hover:text-gold-600"
            >
              Forgot password?
            </Link>
          </div>

          {errors.root && (
            <p className="rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-3 py-2.5 text-sm text-status-sold">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Logging in…
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-navy-800 hover:text-gold-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
