"use client";

import { Pencil, Trash2, CreditCard } from "lucide-react";

import { DataTable, type Column } from "@/components/admin/DataTable";

const columns: Column<any>[] = [
  {
    header: "Estate",
    render: (property) => (
      <span className="font-semibold text-navy-950">{property.estateName}</span>
    ),
  },
  {
    header: "Location",
    render: (property) => property.location,
  },
  {
    header: "State",
    render: (property) => property.state,
  },
  {
    header: "Starting Price",
    render: (property) => `₦${Number(property.startingPrice).toLocaleString()}`,
  },
  {
    header: "Total Plots",
    render: (property) => property.totalPlots,
  },
  {
    header: "Description",
    render: (property) => property.description || "—",
  },
  {
    header: "Features",
    render: (property) =>
      property.features?.length ? property.features.join(", ") : "—",
  },
  {
    header: "Nearby Landmarks",
    render: (property) =>
      property.nearbyLandmarks?.length
        ? property.nearbyLandmarks.join(", ")
        : "—",
  },
  {
    header: "Status",
    render: (property) => property.status,
  },
];

type PropertyTableProps = {
  properties: any[];
  onEdit: (property: any) => void;
  onDelete: (property: any) => void;
  onAddPaymentPlan: (property: any) => void;
};

export function PropertyTable({
  properties,
  onEdit,
  onDelete,
  onAddPaymentPlan,
}: PropertyTableProps) {
  return (
    <DataTable<any>
      columns={columns}
      rows={properties}
      actions={(property) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-900"
            aria-label="Edit property"
            onClick={() => onEdit(property)}>
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-status-sold"
            aria-label={`Delete ${property.estateName}`}
            onClick={() => onDelete(property)}>
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onAddPaymentPlan(property)}
            className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-900"
            aria-label="Add payment plan">
            <CreditCard className="h-4 w-4" />
          </button>
        </div>
      )}
    />
  );
}
