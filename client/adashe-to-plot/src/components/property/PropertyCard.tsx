import Image from "next/image";
import Link from "next/link";
import { Ruler, MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import { formatNaira } from "@/lib/payment";
import { PropertyStatus } from "./PropertyStatus";

export function PropertyCard({ property, estateName }: { property: Property; estateName?: string }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800/10 bg-white transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(10,25,48,0.35)]"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, 100vw"
        />
        <div className="absolute left-3 top-3">
          <PropertyStatus status={property.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
          Plot {property.plotNumber} · {estateName ?? property.location}
        </p>
        <h3 className="text-base font-bold leading-snug text-navy-950">{property.title}</h3>
        <p className="flex items-center gap-1.5 text-xs text-ink-500">
          <MapPin className="h-3.5 w-3.5" /> {property.location}
        </p>
        <div className="mt-1 flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> {property.sizeSqm}sqm</span>
        </div>
        <div className="mt-3 border-t border-navy-800/10 pt-3">
          <p className="text-xs uppercase tracking-wide text-ink-300">Price</p>
          <p className="text-lg font-bold text-navy-950">{formatNaira(property.price)}</p>
        </div>
      </div>
    </Link>
  );
}
