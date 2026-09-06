"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";

interface PlanRow {
  id: string;
  property: string;
  estate: string;
  duration: string;
  monthly: string;
  total: string;
}

const rows: PlanRow[] = [
  {
    id: "plan-1",
    property: "Premium Residential Plot",
    estate: "Adashè Estate",
    duration: "Full Payment",
    monthly: "—",
    total: "₦1,500,000",
  },
  {
    id: "plan-2",
    property: "Premium Residential Plot",
    estate: "Adashè Estate",
    duration: "6 Months",
    monthly: "₦250,000",
    total: "₦1,500,000",
  },
  {
    id: "plan-3",
    property: "Premium Residential Plot",
    estate: "Adashè Estate",
    duration: "12 Months",
    monthly: "₦136,250",
    total: "₦1,635,000",
  },
  {
    id: "plan-4",
    property: "Premium Residential Plot",
    estate: "Adashè Estate",
    duration: "18 Months",
    monthly: "₦90,833",
    total: "₦1,635,000",
  },
  {
    id: "plan-5",
    property: "Premium Residential Plot",
    estate: "Adashè Estate",
    duration: "24 Months",
    monthly: "₦69,375",
    total: "₦1,665,000",
  },
];

const columns: Column<PlanRow>[] = [
  {
    header: "Property",
    render: (row) => (
      <span className="font-semibold text-navy-950">{row.property}</span>
    ),
  },
  {
    header: "Estate",
    render: (row) => row.estate,
  },
  {
    header: "Plan Duration",
    render: (row) => row.duration,
  },
  {
    header: "Monthly Payment",
    render: (row) => row.monthly,
  },
  {
    header: "Total Payable",
    render: (row) => (
      <span className="font-semibold text-navy-950">{row.total}</span>
    ),
  },
];

export default function AdminPaymentPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Payment Plans</h1>

        <p className="mt-1 text-sm text-ink-500">
          Manage payment options available for properties.
        </p>
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
