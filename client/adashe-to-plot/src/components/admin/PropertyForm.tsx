"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { estates } from "@/data/estates";

export function PropertyForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-navy-800/10 bg-white py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-status-available" />
        <h3 className="text-lg font-bold text-navy-950">Property saved</h3>
        <p className="max-w-sm text-sm text-ink-500">
          This is a frontend-only prototype — once connected to the backend API, this form will create a live
          property record.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 sm:grid-cols-2 sm:p-8">
      <Select
        label="Estate"
        id="p-estate"
        options={estates.map((e) => ({ label: e.name, value: e.id }))}
      />
      <Input label="Plot number" id="p-plot" placeholder="e.g. TE-A05" required />
      <Input label="Property title" id="p-title" placeholder="e.g. 3 Bedroom Terrace" required />
      <Input label="Plot size (sqm)" id="p-size" type="number" placeholder="200" required />
      <Input label="Price (₦)" id="p-price" type="number" placeholder="2000000" required />
      <Select
        label="Status"
        id="p-status"
        options={[
          { label: "Available", value: "Available" },
          { label: "Reserved", value: "Reserved" },
          { label: "Sold", value: "Sold" },
        ]}
      />
      <div className="sm:col-span-2">
        <label htmlFor="p-desc" className="text-sm font-medium text-ink-700">Description</label>
        <textarea
          id="p-desc"
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          placeholder="Describe the property..."
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="p-images" className="text-sm font-medium text-ink-700">Property images</label>
        <input id="p-images" type="file" accept="image/*" multiple className="mt-1.5 w-full text-sm text-ink-500" />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit">Save Property</Button>
        <Button type="button" variant="outline">Cancel</Button>
      </div>
    </form>
  );
}
