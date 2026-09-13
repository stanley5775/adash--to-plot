"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

import { EstateGrid } from "@/components/estate/EstateGrid";
import { Select } from "@/components/ui/Select";
import { useGetPropertiesUser } from "../../../hook/estates";

const priceBands = [
  { label: "Price", value: "" },
  { label: "Under ₦2,000,000", value: "0-2000000" },
  { label: "₦2,000,000 – ₦4,000,000", value: "2000000-4000000" },
  { label: "Above ₦4,000,000", value: "4000000-999999999" },
];

function EstatesContent() {
  const searchParams = useSearchParams();

  const {
    properties = [],
    filters = {
      locations: [],
      cities: [],
      estateNames: [],
    },
    isLoading,
  } = useGetPropertiesUser();

  // Values currently selected in the form
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState(
    searchParams.get("location") ?? "",
  );
  const [priceInput, setPriceInput] = useState(searchParams.get("price") ?? "");

  // Values actually being used for filtering
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [price, setPrice] = useState(searchParams.get("price") ?? "");

  const propertyList = Array.isArray(properties) ? properties : [];

  const locationList = Array.isArray(filters?.locations)
    ? filters.locations
    : [];

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    // Nothing selected/searched = show everything
    if (!normalizedSearch && !location && !price) {
      return propertyList;
    }

    return propertyList.filter((property: any) => {
      const estateName = property?.estateName?.toLowerCase() ?? "";
      const description = property?.description?.toLowerCase() ?? "";

      const propertyLocation = property?.location?.toLowerCase() ?? "";

      const city = property?.city?.toLowerCase() ?? "";

      const state = property?.state?.toLowerCase() ?? "";

      const matchesSearch =
        !normalizedSearch ||
        estateName.includes(normalizedSearch) ||
        propertyLocation.includes(normalizedSearch) ||
        city.includes(normalizedSearch) ||
        state.includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      if (location && property?.location !== location) {
        return false;
      }

      if (price) {
        const [min, max] = price.split("-").map(Number);
        const propertyPrice = Number(property?.startingPrice ?? 0);

        if (propertyPrice < min || propertyPrice > max) {
          return false;
        }
      }

      return true;
    });
  }, [propertyList, search, location, price]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setLocation(locationInput);
    setPrice(priceInput);
  };

  const handleReset = () => {
    setSearchInput("");
    setLocationInput("");
    setPriceInput("");

    setSearch("");
    setLocation("");
    setPrice("");
  };

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="gold-rule mb-4 block" />

        <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          Explore Estates
        </h1>

        <p className="mt-3 text-ink-500">
          Browse every Adashè-to-Plot estate currently open for investment, and
          filter by location and price.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-10 rounded-2xl border border-navy-800/10 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <SlidersHorizontal className="h-4 w-4" />
          Filter estates
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search estate, city or state"
            className="rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          />

          {/* Location */}
          <Select
            id="loc-filter"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            options={[
              { label: "All locations", value: "" },
              ...locationList.map((location: string) => ({
                label: location,
                value: location,
              })),
            ]}
          />

          {/* Price */}
          <Select
            id="price-filter"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            options={priceBands}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-800">
              <Search className="h-4 w-4" />
              Search
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset filters"
              className="flex items-center justify-center rounded-xl border border-navy-800/15 px-4 py-3 text-navy-950 transition hover:bg-navy-50">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        {isLoading ? (
          <p className="text-sm text-ink-500">Loading estates...</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-500">
              {filtered.length} estate
              {filtered.length === 1 ? "" : "s"} found
            </p>

            {filtered.length > 0 ? (
              <EstateGrid estates={filtered} />
            ) : (
              <div className="rounded-2xl border border-navy-800/10 bg-white px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-navy-950">
                  No estates match your search
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  Try adjusting your filters or searching for a different
                  location.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800">
                  <RotateCcw className="h-4 w-4" />
                  Reset filters
                </button>
              </div>
            )}
          </>
        )}
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
