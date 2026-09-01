import type { Estate } from "@/types/estate";
import { formatNaira } from "@/lib/payment";

export function EstateStats({ estate }: { estate: Estate }) {
  const stats = [
    { label: "Starting Price", value: formatNaira(estate.startingPrice) },
    { label: "Total Plots", value: estate.totalPlots },
    { label: "Available", value: estate.availablePlots },
    { label: "Sold", value: estate.soldPlots },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-navy-800/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink-300">{s.label}</p>
          <p className="mt-1 text-xl font-bold text-navy-950">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
