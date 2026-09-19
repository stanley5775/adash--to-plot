"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

import { EstateGrid } from "@/components/estate/EstateGrid";
import { Select } from "@/components/ui/Select";
import { useGetAllEstates } from "../../../hook/estates";
import { EstateSkeleton } from "../../../helper/EstateSkeleton";

const priceBands = [
  { label: "Price", value: "" },
  { label: "Under ₦2,000,000", value: "0-2000000" },
  { label: "₦2,000,000 – ₦4,000,000", value: "2000000-4000000" },
  { label: "Above ₦4,000,000", value: "4000000-999999999" },
];

export function EstatesContent() {
  // Values currently selected in the form
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [priceInput, setPriceInput] = useState("");

  // Values actually sent to backend
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [price, setPrice] = useState("");

  const { data, isLoading } = useGetAllEstates({
    search,
    state,
    price,
  });
  console.log("all estate", data);
  const estates = Array.isArray(data?.data) ? data.data : [];

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setState(stateInput);
    setPrice(priceInput);
  };

  const handleReset = () => {
    setSearchInput("");
    setStateInput("");
    setPriceInput("");

    setSearch("");
    setState("");
    setPrice("");
  };
  const states = Array.isArray(data?.filters?.states)
    ? data.filters.states
    : [];
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="gold-rule mb-4 block" />

        <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          Explore Estates
        </h1>

        <p className="mt-3 text-ink-500">
          Browse every Adashè-to-Plot estate currently open for investment, and
          filter by location, property type, price and availability.
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

          {/* State */}
          <Select
            id="state-filter"
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            options={[
              { label: "All states", value: "" },
              ...states.map((state: string) => ({
                label: state,
                value: state,
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EstateSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-500">
              {estates.length} estate
              {estates.length === 1 ? "" : "s"} found
            </p>

            {estates.length > 0 ? (
              <EstateGrid estates={estates} />
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
