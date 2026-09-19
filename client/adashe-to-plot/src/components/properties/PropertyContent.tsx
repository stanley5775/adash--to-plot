"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { Select } from "@/components/ui/Select";
import { useGetActivePropertiesUser } from "../../../hook/estates";
import { EstateSkeleton } from "../../../helper/EstateSkeleton";
import { Button } from "../ui/Button";

const priceBands = [
  { label: "Price", value: "" },
  { label: "Under ₦2,000,000", value: "0-2000000" },
  {
    label: "₦2,000,000 – ₦4,000,000",
    value: "2000000-4000000",
  },
  {
    label: "Above ₦4,000,000",
    value: "4000000-999999999",
  },
];

export function PropertyContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const [state, setState] = useState(searchParams.get("state") ?? "");

  const [price, setPrice] = useState(searchParams.get("price") ?? "");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const [stateInput, setStateInput] = useState(searchParams.get("state") ?? "");

  const [priceInput, setPriceInput] = useState(searchParams.get("price") ?? "");

  const {
    properties = [],
    filters = {
      states: [],
    },
    isLoading,
  } = useGetActivePropertiesUser(search, state, price);

  const propertyList = Array.isArray(properties) ? properties : [];

  const stateList = Array.isArray(filters?.states) ? filters.states : [];

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

  return (
    <div className="">
      {/* Header */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src="/images/thrive-fully-detached.jpg"
            alt="A premium Adashè-to-Plot residence"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/85 to-navy-950/40" />
        </div>
        <div className="container-page relative flex flex-col gap-10 py-24 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <span className="gold-rule mb-6 block" />
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Own Your Plot.
              <br />
              Build Your Future.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100/80">
              Adashè-to-Plot helps you discover and invest in verified
              residential plots and premium homes across Abuja — with flexible
              payment plans and documentation you can trust, every step of the
              way.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/estates" size="lg">
                Explore Estates
              </Button>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-navy-800/10 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
              <SlidersHorizontal className="h-4 w-4" />
              Filter properties
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
                placeholder="Search estate or property name"
                className="rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
              />

              {/* State */}
              <Select
                id="state-filter"
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                options={[
                  {
                    label: "All states",
                    value: "",
                  },
                  ...stateList.map((state: string) => ({
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
        </div>
      </section>

      {/* Filters end*/}

      {/* Results */}
      <div className="mt-2 container-page py-16 sm:py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EstateSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="gold-rule mb-4 block" />
                <h2 className="text-3xl font-bold tracking-tight text-navy-950">
                  Featured Estates
                </h2>
                <p className="mt-2 max-w-lg text-ink-500">
                  Two distinct communities in Kuje, Abuja — each built for a
                  different kind of investor.
                </p>
              </div>
              <Link
                href="/estates"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600">
                View all estates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {propertyList.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {propertyList.map((property: any) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="group overflow-hidden rounded-2xl border border-navy-800/10 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy-50">
                      {property.mainImage ? (
                        <Image
                          src={property.mainImage}
                          alt={property.estateName ?? "Property"}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-ink-400">
                          No image available
                        </div>
                      )}

                      {/* Status */}
                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-950 shadow-sm">
                        Available
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2 className="mt-2 text-lg font-bold text-navy-950">
                        {property.estateName}
                      </h2>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
                        <MapPin className="h-4 w-4 shrink-0" />

                        <span>
                          {property.city}, {property.state}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-navy-800/10 pt-4">
                        <div>
                          <p className="text-xs text-ink-400">Starting from</p>

                          <p className="mt-1 text-lg font-bold text-navy-950">
                            ₦
                            {Number(
                              property.startingPrice ?? 0,
                            ).toLocaleString()}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-navy-950 transition group-hover:translate-x-1">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-navy-800/10 bg-white px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-navy-950">
                  No properties found
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  Try another property name, state, or price range.
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
