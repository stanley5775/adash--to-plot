import type { Estate } from "@/types/estate";
import type { PropertyStatus } from "@/types/property";

export interface PlotCell {
  code: string;
  status: PropertyStatus;
}

/**
 * Generates a deterministic, frontend-only visual grid representing plot
 * availability across an estate. This is not a real GIS map — it's a
 * proportional, evenly-spread representation built from the estate's
 * available / reserved / sold counts, capped at a display maximum so the
 * grid stays usable in the UI.
 */
export function generatePlotGrid(estate: Estate, displayCap = 60): PlotCell[] {
  const displayTotal = Math.min(estate.totalPlots, displayCap);
  const ratio = displayTotal / estate.totalPlots;

  const availableCount = Math.round(estate.availablePlots * ratio);
  const reservedCount = Math.round(estate.reservedPlots * ratio);
  const soldCount = Math.max(displayTotal - availableCount - reservedCount, 0);

  const statuses: PropertyStatus[] = [
    ...Array(soldCount).fill("Sold" as PropertyStatus),
    ...Array(reservedCount).fill("Reserved" as PropertyStatus),
    ...Array(availableCount).fill("Available" as PropertyStatus),
  ];

  // Pad or trim to exactly displayTotal in case of rounding drift.
  while (statuses.length < displayTotal) statuses.push("Available");
  statuses.length = displayTotal;

  // Deterministic interleave so statuses aren't grouped in blocks.
  const step = 7;
  const spread: PropertyStatus[] = new Array(displayTotal);
  let cursor = 0;
  for (let i = 0; i < displayTotal; i++) {
    spread[cursor] = statuses[i];
    cursor = (cursor + step) % displayTotal;
  }

  const prefix = estate.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return spread.map((status, i) => ({
    code: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    status,
  }));
}
