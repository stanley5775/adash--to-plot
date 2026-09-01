"use client";

import { useState, Suspense } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { register } from "@/services/auth.service";
import { isValidEmail, isPasswordValid } from "@/lib/validators";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/application";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    setError(null);

    if (!fullName.trim()) return setError("Full name is required.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (!phone.trim()) return setError("Phone number is required.");
    if (!isPasswordValid(password)) return setError("Your password doesn't meet the requirements below.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setSubmitting(true);
    const result = await register({ fullName, email, phone, password, confirmPassword });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(redirectTo);
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-navy-800/10 bg-white p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            <UserPlus className="h-3.5 w-3.5" /> Create your account
          </span>
          <h1 className="mt-4 text-2xl font-bold text-navy-950">Register</h1>
          <p className="mt-1.5 text-sm text-ink-500">Create an account to start your Land Application.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input label="Full name" id="r-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Amaka Johnson" required />
          <Input label="Email address" id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Phone number" id="r-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0803 123 4567" required />
          <Input
            label="Password"
            id="r-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="e.g. Stanley@123"
            required
          />
          {(touched || password) && <PasswordChecklist password={password} />}
          <Input
            label="Confirm password"
            id="r-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />

          {error && (
            <p className="rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-3 py-2.5 text-sm text-status-sold">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" /> Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-navy-800 hover:text-gold-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
