"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable, type Column } from "@/components/admin/DataTable";

export type Estate = {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  createdAt: string;
};

const columns: Column<Estate>[] = [
  {
    header: "Estate",
    render: (estate) => (
      <span className="font-semibold text-navy-950">{estate.name}</span>
    ),
  },
  {
    header: "Account Name",
    render: (estate) => estate.accountName,
  },
  {
    header: "Account Number",
    render: (estate) => estate.accountNumber,
  },
  {
    header: "Bank",
    render: (estate) => estate.bankName,
  },
];

type EstateTableProps = {
  estates: Estate[];
  onEdit: (estate: Estate) => void;
  onDelete: (estate: Estate) => void;
};

export function EstateTable({ estates, onEdit, onDelete }: EstateTableProps) {
  return (
    <DataTable
      columns={columns}
      rows={estates}
      actions={(estate) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/properties/new?estateId=${estate.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-100 hover:text-navy-950">
            <Plus className="h-4 w-4" />
            Add Property
          </Link>

          <button
            type="button"
            onClick={() => onEdit(estate)}
            className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-900"
            aria-label={`Edit ${estate.name}`}>
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(estate)}
            className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-status-sold"
            aria-label={`Delete ${estate.name}`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    />
  );
}
