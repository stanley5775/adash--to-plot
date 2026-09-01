"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";
import { EstateGrid } from "@/components/estate/EstateGrid";
import { Select } from "@/components/ui/Select";

const priceBands = [
  { label: "Any price", value: "" },
  { label: "Under ₦2,000,000", value: "0-2000000" },
  { label: "₦2,000,000 – ₦4,000,000", value: "2000000-4000000" },
  { label: "Above ₦4,000,000", value: "4000000-999999999" },
];

function EstatesContent() {
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [price, setPrice] = useState(searchParams.get("price") ?? "");
  const [availability, setAvailability] = useState("");
  const [query, setQuery] = useState("");

  const locations = Array.from(new Set(estates.map((e) => e.location)));
  const types = Array.from(new Set(properties.map((p) => p.propertyType)));

  const filtered = useMemo(() => {
    return estates.filter((estate) => {
      if (location && estate.location !== location) return false;
      if (query && !estate.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (availability === "available" && estate.availablePlots === 0) return false;
      if (type) {
        const hasType = properties.some((p) => p.estateId === estate.id && p.propertyType === type);
        if (!hasType) return false;
      }
      if (price) {
        const [min, max] = price.split("-").map(Number);
        if (estate.startingPrice < min || estate.startingPrice > max) return false;
      }
      return true;
    });
  }, [location, type, price, availability, query]);

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="gold-rule mb-4 block" />
        <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">Explore Estates</h1>
        <p className="mt-3 text-ink-500">
          Browse every Adashè-to-Plot estate currently open for investment, and filter by location, property type,
          price and availability.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-navy-800/10 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <SlidersHorizontal className="h-4 w-4" /> Filter estates
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by estate name"
            className="rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          />
          <Select
            id="loc-filter"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={[{ label: "Any location", value: "" }, ...locations.map((l) => ({ label: l, value: l }))]}
          />
          <Select
            id="type-filter"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[{ label: "Any property type", value: "" }, ...types.map((t) => ({ label: t, value: t }))]}
          />
          <Select
            id="price-filter"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            options={priceBands}
          />
          <Select
            id="availability-filter"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            options={[
              { label: "Any availability", value: "" },
              { label: "Has available plots", value: "available" },
            ]}
          />
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-4 text-sm text-ink-500">{filtered.length} estate{filtered.length === 1 ? "" : "s"} found</p>
        <EstateGrid estates={filtered} />
      </div>
    </div>
  );
}

export default function EstatesPage() {
  return (
    <Suspense>
      <EstatesContent />
    </Suspense>
  );
}
