import { inspections } from "@/data/inspections";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatDate } from "@/lib/payment";
import type { Inspection } from "@/types/inspection";

const columns: Column<Inspection>[] = [
  { header: "Customer", render: (i) => <span className="font-semibold text-navy-950">{i.customerName}</span> },
  { header: "Estate", render: (i) => estates.find((e) => e.id === i.estateId)?.name ?? "—" },
  { header: "Property", render: (i) => (i.propertyId ? properties.find((p) => p.id === i.propertyId)?.title ?? "—" : "—") },
  { header: "Date", render: (i) => formatDate(i.date) },
  { header: "Time", render: (i) => i.time },
  { header: "Status", render: (i) => <Badge tone={statusToTone(i.status)}>{i.status}</Badge> },
];

export default function AdminInspectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Inspections</h1>
        <p className="mt-1 text-sm text-ink-500">Every inspection request across all estates.</p>
      </div>
      <DataTable columns={columns} rows={inspections} />
    </div>
  );
}
