"use client";

import { useState, Suspense } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/services/auth.service";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/application";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotNote, setShowForgotNote] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    const result = await login({ email, password, rememberMe });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Invalid email or password.");
      return;
    }

    router.push(redirectTo);
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            <LogIn className="h-3.5 w-3.5" /> Welcome back
          </span>
          <h1 className="mt-4 text-2xl font-bold text-navy-950">Log In</h1>
          <p className="mt-1.5 text-sm text-ink-500">Log in to continue your Land Application or view your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input label="Email address" id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Password" id="l-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

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
            <button
              type="button"
              onClick={() => setShowForgotNote((s) => !s)}
              className="font-semibold text-navy-700 hover:text-gold-600"
            >
              Forgot password?
            </button>
          </div>

          {showForgotNote && (
            <p className="-mt-2 rounded-lg bg-navy-50 px-3 py-2.5 text-xs text-ink-500">
              Password reset isn&apos;t available in this prototype yet — it will be added once real backend
              authentication is connected.
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-3 py-2.5 text-sm text-status-sold">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" /> Logging in…
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-navy-800 hover:text-gold-600">
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
