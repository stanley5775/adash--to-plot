"use client";

import { useState, Suspense } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, LoaderCircle } from "lucide-react";
import { adminLogin } from "@/services/admin-auth.service";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your admin email and password.");
      return;
    }

    setSubmitting(true);
    const result = await adminLogin({ email: email.trim(), password });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Invalid email or password.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-navy-900 p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/logo.png" alt="Adashè-to-Plot" width={168} height={44} className="h-10 w-auto brightness-0 invert" />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Staff Admin
          </span>
          <h1 className="mt-4 text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1.5 text-sm text-navy-100/60">Sign in to manage estates, properties and customers.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-sm font-medium text-navy-100/80">Admin email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@adashetoplot.com"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-navy-100/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-sm font-medium text-navy-100/80">Password</label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder:text-navy-100/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-100/50 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-status-sold/30 bg-status-sold/10 px-3 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-navy-100/40">
          This admin area is private and separate from the public Adashè-to-Plot website.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
