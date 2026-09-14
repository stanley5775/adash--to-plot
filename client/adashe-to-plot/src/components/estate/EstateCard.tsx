import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Estate } from "@/types/estate";

import { formatNaira } from "@/lib/payment";

export function EstateCard({ estate }: { estate: Estate }) {
  return (
    <Link
      href={`/estates/${estate.estateId}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800/10 bg-white transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(10,25,48,0.35)]">
      <div className="relative h-56 w-full overflow-hidden">
        {estate.mainImage ? (
          <Image
            src={estate.mainImage}
            alt={estate.estateName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-50 text-sm text-ink-500">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="text-lg font-bold text-navy-950">
            {estate.estateName}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
            <MapPin className="h-3.5 w-3.5" />
            {estate.city}, {estate.state}
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-ink-500">
          {estate.description}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-navy-800/10 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">From</p>

            <p className="font-bold text-navy-950">
              {formatNaira(Number(estate.startingPrice))}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Total Plots
            </p>

            <p className="font-bold text-navy-950">{estate.totalPlots} plots</p>
          </div>
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
          View Estate
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
