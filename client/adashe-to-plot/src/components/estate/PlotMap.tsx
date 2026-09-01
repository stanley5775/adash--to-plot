import type { Estate } from "@/types/estate";
import { generatePlotGrid } from "@/lib/plots";

const statusStyles: Record<string, string> = {
  Available: "bg-[#e7f5ec] text-status-available border-status-available/30",
  Reserved: "bg-[#fbf0dc] text-status-reserved border-status-reserved/30",
  Sold: "bg-[#f8e9e9] text-status-sold border-status-sold/30",
};

export function PlotMap({ estate }: { estate: Estate }) {
  const plots = generatePlotGrid(estate);
  const shown = Math.min(estate.totalPlots, 60);

  return (
    <div className="rounded-3xl border border-navy-800/10 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-navy-950">Plot Availability</h3>
          <p className="text-sm text-ink-500">
            A visual overview of plot status across {estate.name}
            {shown < estate.totalPlots ? ` — showing ${shown} of ${estate.totalPlots} plots` : ""}.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-ink-700">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-available" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-reserved" /> Reserved</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-sold" /> Sold</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-10">
        {plots.map((plot) => (
          <div
            key={plot.code}
            title={`Plot ${plot.code} — ${plot.status}`}
            className={`flex aspect-square items-center justify-center rounded-md border text-[10px] font-semibold ${statusStyles[plot.status]}`}
          >
            {plot.code.split("-")[1]}
          </div>
        ))}
      </div>
    </div>
  );
}
