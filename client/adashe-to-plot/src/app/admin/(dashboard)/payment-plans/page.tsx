import { properties } from "@/data/properties";
import { estates } from "@/data/estates";
import { estatePaymentPlans } from "@/data/payment-plans";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { computePaymentPlan, formatNaira } from "@/lib/payment";

interface PlanRow {
  id: string;
  property: string;
  estate: string;
  duration: string;
  monthly: string;
  total: string;
  atiPlusTotal: string;
  status: string;
}

const rows: PlanRow[] = properties.flatMap((p) => {
  const estate = estates.find((e) => e.id === p.estateId)!;
  const plan = estatePaymentPlans.find((pl) => pl.estateId === p.estateId)!;
  return plan.rates
    .filter((r) => p.paymentPlanMonths.includes(r.duration))
    .map((rate) => {
      const computed = computePaymentPlan(p.price, rate);
      const atiComputed = computePaymentPlan(p.price, rate, true);
      return {
        id: `${p.id}-${rate.duration}`,
        property: p.title,
        estate: estate.name,
        duration: rate.label,
        monthly: rate.duration === 0 ? "—" : formatNaira(computed.monthlyAmount),
        total: formatNaira(computed.totalPayable),
        atiPlusTotal: formatNaira(atiComputed.totalPayable),
        status: "Active",
      };
    });
});

const columns: Column<PlanRow>[] = [
  { header: "Property", render: (r) => <span className="font-semibold text-navy-950">{r.property}</span> },
  { header: "Estate", render: (r) => r.estate },
  { header: "Plan Duration", render: (r) => r.duration },
  { header: "Monthly Amount", render: (r) => r.monthly },
  { header: "Total (Standard)", render: (r) => r.total },
  { header: "Total (ATI Plus, -5%)", render: (r) => <span className="font-semibold text-gold-600">{r.atiPlusTotal}</span> },
  { header: "Status", render: (r) => <Badge tone="success">{r.status}</Badge> },
];

export default function AdminPaymentPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Payment Plans</h1>
        <p className="mt-1 text-sm text-ink-500">
          Every plan currently attached to a property, calculated live. The ₦15,000 Land Application fee is billed
          separately — see Applications — and is never part of these totals.
        </p>
      </div>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
