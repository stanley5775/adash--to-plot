import Link from "next/link";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { estates } from "@/data/estates";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/payment";
import type { Estate } from "@/types/estate";

const columns: Column<Estate>[] = [
  { header: "Estate", render: (e) => <span className="font-semibold text-navy-950">{e.name}</span> },
  { header: "Location", render: (e) => e.location },
  { header: "Total Plots", render: (e) => e.totalPlots },
  { header: "Available", render: (e) => e.availablePlots },
  { header: "Sold", render: (e) => e.soldPlots },
  { header: "Starting Price", render: (e) => formatNaira(e.startingPrice) },
  { header: "Status", render: (e) => <Badge tone={e.developmentStatus === "Selling Fast" ? "gold" : "info"}>{e.developmentStatus}</Badge> },
];

export default function AdminEstatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Estates</h1>
          <p className="mt-1 text-sm text-ink-500">Manage every estate on the platform.</p>
        </div>
        <Button href="/admin/estates/new"><Plus className="h-4 w-4" /> Add Estate</Button>
      </div>

      <DataTable
        columns={columns}
        rows={estates}
        actions={(e) => (
          <div className="flex items-center gap-2">
            <Link href={`/estates/${e.slug}`} className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-navy-900" aria-label="View">
              <Eye className="h-4 w-4" />
            </Link>
            <button className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-navy-900" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-status-sold" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
}
