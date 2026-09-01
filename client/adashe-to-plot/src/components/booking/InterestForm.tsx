"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function InterestForm({ propertyTitle }: { propertyTitle?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 500);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-status-available" />
        <h4 className="text-lg font-bold text-navy-950">We've received your interest</h4>
        <p className="max-w-sm text-sm text-ink-500">
          An Adashè-to-Plot investment advisor will reach out about {propertyTitle ?? "this property"} shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Full name" id="int-name" name="name" placeholder="e.g. Amaka Johnson" required />
      <Input label="Phone number" id="int-phone" name="phone" type="tel" placeholder="e.g. 0803 123 4567" required />
      <Input label="Email address" id="int-email" name="email" type="email" placeholder="you@example.com" required />
      <Input label="Preferred payment plan" id="int-plan" name="plan" placeholder="e.g. 12 months" />
      <Button type="submit" className="mt-2 w-full" disabled={submitting}>
        {submitting ? "Submitting…" : "I'm Interested in This Property"}
      </Button>
    </form>
  );
}
