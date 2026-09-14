import Image from "next/image";
import { MapPin, Building2, Wallet } from "lucide-react";

import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNaira } from "@/lib/payment";
import { PropertyGridSkeleton } from "../../../helper/PropertyGridSkeleton";

type Estate = {
  id: string;
  estateName: string;
  description: string | null;
  city: string | null;
  state: string | null;
  startingPrice: string | number | null;
  mainImage: string | null;
};

export function PropertyGrid({
  properties,
  estate,
  isLoading = false,
}: {
  properties: Property[];
  estate?: Estate;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <PropertyGridSkeleton />;
  }
  return (
    <section>
      {estate && (
        <div className="mb-12 overflow-hidden rounded-3xl  border border-navy-800/10 bg-white">
          {/* Estate Image */}
          {estate.mainImage && (
            <div className="relative h-64 w-full overflow-hidden sm:h-80">
              <Image
                src={estate.mainImage}
                alt={estate.estateName}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 1200px, 100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                  <MapPin className="h-4 w-4" />
                  {estate.city}, {estate.state}
                </p>

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {estate.estateName}
                </h1>
              </div>
            </div>
          )}

          {/* Estate Info */}
          <div className="p-6 sm:p-8">
            {!estate.mainImage && (
              <>
                <h1 className="text-3xl font-bold text-navy-950">
                  {estate.estateName}
                </h1>

                <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
                  <MapPin className="h-4 w-4" />
                  {estate.city}, {estate.state}
                </p>
              </>
            )}

            {/* Description */}
            {estate.description && (
              <p className="  text-sm leading-7 text-ink-500">
                {estate.description}
              </p>
            )}

            {/* Estate Stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              {(estate.city || estate.state) && (
                <div className="inline-flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-3">
                  <MapPin className="h-4 w-4 text-navy-700" />

                  <div>
                    <p className="text-xs text-ink-400">Location</p>
                    <p className="text-sm font-semibold text-navy-950">
                      {estate.city}, {estate.state}
                    </p>
                  </div>
                </div>
              )}

              {estate.startingPrice && (
                <div className="inline-flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-3">
                  <Wallet className="h-4 w-4 text-navy-700" />

                  <div>
                    <p className="text-xs text-ink-400">Starting from</p>
                    <p className="text-sm font-semibold text-navy-950">
                      {formatNaira(Number(estate.startingPrice))}
                    </p>
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-3">
                <Building2 className="h-4 w-4 text-navy-700" />

                <div>
                  <p className="text-xs text-ink-400">Properties</p>
                  <p className="text-sm font-semibold text-navy-950">
                    {properties.length} available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties */}
      <div className="mx-4 l">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-950">
            Available Properties
          </h2>

          <p className="mt-1 text-sm text-ink-500">
            Explore the available properties in{" "}
            {estate?.estateName ?? "this estate"}.
          </p>
        </div>

        {properties.length === 0 ? (
          <EmptyState
            title="No properties available right now"
            description="Check back soon, or contact our team about upcoming availability."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                estateName={estate?.estateName}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
