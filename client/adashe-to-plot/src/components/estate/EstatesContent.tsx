"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

import { EstateGrid } from "@/components/estate/EstateGrid";
import { useGetAllEstates } from "../../../hook/estates";
import { EstateSkeleton } from "../../../helper/EstateSkeleton";

export function EstatesContent() {
  const { data, isLoading } = useGetAllEstates();

  const estates = Array.isArray(data?.data) ? data.data : [];

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) {
      return estates;
    }

    return estates.filter((estate: any) => {
      const estateName = estate?.estateName?.toLowerCase() ?? "";
      const description = estate?.description?.toLowerCase() ?? "";
      const city = estate?.city?.toLowerCase() ?? "";
      const state = estate?.state?.toLowerCase() ?? "";

      return (
        estateName.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        city.includes(normalizedSearch) ||
        state.includes(normalizedSearch)
      );
    });
  }, [estates, search]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
  };

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="gold-rule mb-4 block" />

        <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          Explore Estates
        </h1>

        <p className="mt-3 text-ink-500">
          Browse every Adashè-to-Plot estate currently open for investment.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-10 rounded-2xl border border-navy-800/10 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <SlidersHorizontal className="h-4 w-4" />
          Search estates
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
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

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800">
              <Search className="h-4 w-4" />
              Search
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset search"
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
                  Try searching for a different estate, city, or state.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800">
                  <RotateCcw className="h-4 w-4" />
                  Reset search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
