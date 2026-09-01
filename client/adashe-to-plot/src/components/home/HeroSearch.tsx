"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";

const priceBands = [
  { label: "Any price", value: "" },
  { label: "Under ₦2,000,000", value: "0-2000000" },
  { label: "₦2,000,000 – ₦4,000,000", value: "2000000-4000000" },
  { label: "Above ₦4,000,000", value: "4000000-999999999" },
];

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [estateId, setEstateId] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const locations = Array.from(new Set(estates.map((e) => e.location)));
  const types = Array.from(new Set(properties.map((p) => p.propertyType)));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (estateId) params.set("estate", estateId);
    if (type) params.set("type", type);
    if (price) params.set("price", price);
    router.push(`/estates?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-3xl border border-white/10 bg-white/95 p-4 shadow-2xl backdrop-blur sm:grid-cols-2 lg:grid-cols-5 lg:p-3"
    >
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3 text-sm text-ink-700 focus:outline-none"
      >
        <option value="">Any location</option>
        {locations.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
      <select
        value={estateId}
        onChange={(e) => setEstateId(e.target.value)}
        className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3 text-sm text-ink-700 focus:outline-none"
      >
        <option value="">Any estate</option>
        {estates.map((e) => (
          <option key={e.id} value={e.id}>{e.name}</option>
        ))}
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3 text-sm text-ink-700 focus:outline-none"
      >
        <option value="">Any property type</option>
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3 text-sm text-ink-700 focus:outline-none"
      >
        {priceBands.map((band) => (
          <option key={band.value} value={band.value}>{band.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-2xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
      >
        <Search className="h-4 w-4" /> Search
      </button>
    </form>
  );
}
