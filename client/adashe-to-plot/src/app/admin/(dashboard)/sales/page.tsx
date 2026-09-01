import { sales } from "@/data/sales";
import { properties } from "@/data/properties";
import { estates } from "@/data/estates";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatNaira, formatDate } from "@/lib/payment";
import { CircleDollarSign, CheckCircle2, Clock3, Wallet } from "lucide-react";
import type { Sale } from "@/types/sale";

const columns: Column<Sale>[] = [
  { header: "Customer", render: (s) => <span className="font-semibold text-navy-950">{s.customerName}</span> },
  { header: "Property", render: (s) => properties.find((p) => p.id === s.propertyId)?.title ?? "—" },
  { header: "Estate", render: (s) => estates.find((e) => e.id === s.estateId)?.name ?? "—" },
  { header: "Amount Paid", render: (s) => formatNaira(s.amountPaid) },
  { header: "Payment Status", render: (s) => <Badge tone={statusToTone(s.salesStatus)}>{s.salesStatus}</Badge> },
  { header: "Date", render: (s) => formatDate(s.startDate) },
  { header: "Sales Status", render: (s) => <Badge tone={statusToTone(s.salesStatus)}>{s.salesStatus}</Badge> },
];

export default function AdminSalesPage() {
  const revenue = sales.reduce((sum, s) => sum + s.amountPaid, 0);
  const completed = sales.filter((s) => s.salesStatus === "Completed").length;
  const pending = sales.filter((s) => s.salesStatus !== "Completed").length;
  const outstanding = sales.reduce((sum, s) => sum + s.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Sales</h1>
        <p className="mt-1 text-sm text-ink-500">Revenue and sales status across every customer.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Revenue" value={formatNaira(revenue)} icon={<CircleDollarSign className="h-4 w-4" />} tone="gold" />
        <StatCard label="Completed Sales" value={String(completed)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Pending Sales" value={String(pending)} icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Outstanding Payments" value={formatNaira(outstanding)} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <DataTable columns={columns} rows={sales} />
    </div>
  );
}
