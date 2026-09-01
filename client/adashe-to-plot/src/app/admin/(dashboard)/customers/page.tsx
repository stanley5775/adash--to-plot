import { customers } from "@/data/customers";
import { properties } from "@/data/properties";
import { estates } from "@/data/estates";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatDate } from "@/lib/payment";
import type { Customer } from "@/types/customer";

const columns: Column<Customer>[] = [
  { header: "Customer", render: (c) => <span className="font-semibold text-navy-950">{c.name}</span> },
  { header: "Phone", render: (c) => c.phone },
  { header: "Email", render: (c) => c.email },
  { header: "Property", render: (c) => properties.find((p) => p.id === c.propertyId)?.title ?? "—" },
  { header: "Estate", render: (c) => estates.find((e) => e.id === c.estateId)?.name ?? "—" },
  { header: "Status", render: (c) => <Badge tone={statusToTone(c.status)}>{c.status}</Badge> },
  { header: "Date Joined", render: (c) => formatDate(c.dateJoined) },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Customers</h1>
        <p className="mt-1 text-sm text-ink-500">Everyone who has purchased or reserved a property.</p>
      </div>
      <DataTable columns={columns} rows={customers} />
    </div>
  );
}
