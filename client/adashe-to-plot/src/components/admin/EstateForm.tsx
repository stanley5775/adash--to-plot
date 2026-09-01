"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function EstateForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-navy-800/10 bg-white py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-status-available" />
        <h3 className="text-lg font-bold text-navy-950">Estate saved</h3>
        <p className="max-w-sm text-sm text-ink-500">
          This is a frontend-only prototype, so the estate isn&apos;t persisted yet — once connected to the backend
          API, this form will create a live estate record.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 sm:grid-cols-2 sm:p-8">
      <Input label="Estate name" id="e-name" placeholder="e.g. The Thrive Estate" required />
      <Input label="Location" id="e-location" placeholder="e.g. Kuje, Abuja" required />
      <div className="sm:col-span-2">
        <label htmlFor="e-desc" className="text-sm font-medium text-ink-700">Description</label>
        <textarea
          id="e-desc"
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          placeholder="Describe the estate..."
        />
      </div>
      <Input label="Starting price (₦)" id="e-price" type="number" placeholder="1500000" required />
      <Input label="Total plots" id="e-total" type="number" placeholder="120" required />
      <Input label="Features (comma separated)" id="e-features" placeholder="Good road network, Electricity, Water" />
      <Input label="Nearby landmarks (comma separated)" id="e-landmarks" placeholder="Kuje Market, General Hospital" />
      <Select
        label="Development status"
        id="e-status"
        options={[
          { label: "Ongoing", value: "Ongoing" },
          { label: "Selling Fast", value: "Selling Fast" },
          { label: "Completed", value: "Completed" },
        ]}
      />
      <div>
        <label htmlFor="e-main-image" className="text-sm font-medium text-ink-700">Main image</label>
        <input id="e-main-image" type="file" accept="image/*" className="mt-1.5 w-full text-sm text-ink-500" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="e-gallery" className="text-sm font-medium text-ink-700">Gallery images</label>
        <input id="e-gallery" type="file" accept="image/*" multiple className="mt-1.5 w-full text-sm text-ink-500" />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit">Save Estate</Button>
        <Button type="button" variant="outline">Cancel</Button>
      </div>
    </form>
  );
}
