"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Wallet } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/payment";

const ANNUAL_FEE = 15000;

export function JoinAtiPlusForm() {
  const [step, setStep] = useState<"details" | "pay" | "done">("details");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");

  function handleDetailsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep("pay");
  }

  function handlePay() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("done");
    }, 600);
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold-500" />
        <h4 className="text-lg font-bold text-navy-950">Welcome to ATI Plus{name ? `, ${name.split(" ")[0]}` : ""}</h4>
        <p className="max-w-sm text-sm text-ink-500">
          Your {formatNaira(ANNUAL_FEE)} annual subscription has been received and your ATI Plus membership is now
          active. A member of our team will confirm your benefits shortly.
        </p>
      </div>
    );
  }

  if (step === "pay") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-gold-400 bg-gold-50 p-5">
          <div className="flex items-center gap-2 text-gold-700">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wide">Annual Subscription Required</span>
          </div>
          <p className="mt-2 text-sm text-ink-700">
            ATI Plus membership requires a flat <strong>{formatNaira(ANNUAL_FEE)}</strong> annual subscription,
            renewed every 12 months, before you can access member benefits.
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-gold-400/40 pt-4 text-sm">
            <span className="text-ink-500">Amount due today</span>
            <span className="text-lg font-bold text-navy-950">{formatNaira(ANNUAL_FEE)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("details")}>Back</Button>
          <Button className="flex-1" onClick={handlePay} disabled={submitting}>
            {submitting ? "Processing…" : `Pay ${formatNaira(ANNUAL_FEE)} & Join`}
          </Button>
        </div>
        <p className="text-center text-xs text-ink-400">This is a frontend-only prototype — no live payment is processed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
      <p className="rounded-xl bg-navy-50 px-4 py-3 text-xs text-ink-500">
        ATI Plus requires a {formatNaira(ANNUAL_FEE)} annual subscription. You&apos;ll confirm payment on the next
        step before your membership becomes active.
      </p>
      <Input label="Full name" id="ati-name" name="name" placeholder="e.g. Amaka Johnson" required value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email address" id="ati-email" name="email" type="email" placeholder="you@example.com" required />
      <Input label="Phone number" id="ati-phone" name="phone" type="tel" placeholder="e.g. 0803 123 4567" required />
      <Input label="Preferred location" id="ati-location" name="location" placeholder="e.g. Kuje, Abuja" required />
      <Button type="submit" className="mt-2 w-full">Continue to Payment</Button>
    </form>
  );
}
