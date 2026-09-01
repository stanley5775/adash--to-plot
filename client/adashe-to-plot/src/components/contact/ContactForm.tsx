"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
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
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-navy-800/10 bg-white p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-status-available" />
        <h4 className="text-lg font-bold text-navy-950">Message received</h4>
        <p className="max-w-sm text-sm text-ink-500">Thank you for reaching out — our team will respond within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" id="c-name" name="name" placeholder="e.g. Amaka Johnson" required />
        <Input label="Phone number" id="c-phone" name="phone" type="tel" placeholder="e.g. 0803 123 4567" required />
      </div>
      <Input label="Email address" id="c-email" name="email" type="email" placeholder="you@example.com" required />
      <div>
        <label htmlFor="c-message" className="text-sm font-medium text-ink-700">Message</label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          placeholder="Tell us what you're looking for..."
        />
      </div>
      <Button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send Message"}</Button>
    </form>
  );
}
