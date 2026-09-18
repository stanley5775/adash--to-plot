import Image from "next/image";
import Link from "next/link";
import { MapPin, Ruler } from "lucide-react";

import type { Property } from "@/types/property";

import { PropertyStatus } from "./PropertyStatus";
import { formatNaira } from "@/lib/payment";

export function PropertyCard({
  property,
  estateName,
}: {
  property: Property;
  estateName?: string;
}) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800/10 bg-white transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(10,25,48,0.35)]">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.mainImage || "/placeholder.jpg"}
          alt={`${property.city}, ${property.state}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />

        <div className="absolute left-3 top-3">
          <PropertyStatus status={property.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="mt-1 text-xs font-bold text-navy-950">
            {estateName || "Property"}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Ruler className="h-4 w-4" />

          <span>{property.totalPlots || "sqm"}sqm</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {property.city}, {property.state}
          </span>
        </div>

        <div className="mt-auto border-t border-navy-800/10 pt-4">
          <p className="text-xs uppercase tracking-wide text-ink-300">Price</p>

          <p className="text-lg font-bold text-navy-950">
            {formatNaira(Number(property.startingPrice))}
          </p>
        </div>
      </div>
    </Link>
  );
}
