"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function InspectionForm({ propertyTitle, onSuccess }: { propertyTitle?: string; onSuccess?: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      onSuccess?.();
    }, 500);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-status-available" />
        <h4 className="text-lg font-bold text-navy-950">Inspection request received</h4>
        <p className="max-w-sm text-sm text-ink-500">
          Our team will contact you shortly to confirm your visit{propertyTitle ? ` to ${propertyTitle}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Full name" id="insp-name" name="name" placeholder="e.g. Amaka Johnson" required />
      <Input label="Phone number" id="insp-phone" name="phone" type="tel" placeholder="e.g. 0803 123 4567" required />
      <Input label="Email address" id="insp-email" name="email" type="email" placeholder="you@example.com" required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Preferred date" id="insp-date" name="date" type="date" required />
        <Input label="Preferred time" id="insp-time" name="time" type="time" required />
      </div>
      <Button type="submit" className="mt-2 w-full" disabled={submitting}>
        {submitting ? "Sending request…" : "Request Inspection"}
      </Button>
    </form>
  );
}
