import Link from "next/link";
import { Plus, Eye, Pencil, Trash2, LockKeyhole, CheckCircle2 } from "lucide-react";
import { properties } from "@/data/properties";
import { estates } from "@/data/estates";
import { customers } from "@/data/customers";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PropertyStatus } from "@/components/property/PropertyStatus";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/payment";
import type { Property } from "@/types/property";

const columns: Column<Property>[] = [
  { header: "Plot Number", render: (p) => <span className="font-semibold text-navy-950">{p.plotNumber}</span> },
  { header: "Property", render: (p) => p.title },
  { header: "Estate", render: (p) => estates.find((e) => e.id === p.estateId)?.name ?? "—" },
  { header: "Size", render: (p) => `${p.sizeSqm}sqm` },
  { header: "Price", render: (p) => formatNaira(p.price) },
  { header: "Status", render: (p) => <PropertyStatus status={p.status} /> },
  { header: "Buyer", render: (p) => customers.find((c) => c.propertyId === p.id)?.name ?? "—" },
];

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Properties</h1>
          <p className="mt-1 text-sm text-ink-500">Manage every property listed across all estates.</p>
        </div>
        <Button href="/admin/properties/new"><Plus className="h-4 w-4" /> Add Property</Button>
      </div>

      <DataTable
        columns={columns}
        rows={properties}
        actions={(p) => (
          <div className="flex items-center gap-2">
            <Link href={`/properties/${p.slug}`} className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-navy-900" aria-label="View">
              <Eye className="h-4 w-4" />
            </Link>
            <button className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-navy-900" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
            <button className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-status-reserved" aria-label="Reserve"><LockKeyhole className="h-4 w-4" /></button>
            <button className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-status-available" aria-label="Mark as sold"><CheckCircle2 className="h-4 w-4" /></button>
            <button className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-status-sold" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      />
    </div>
  );
}
