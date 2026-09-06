"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import type { Customer } from "@/types/customer";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string;

  dateJoined: string;
  status: "Active" | "Deactivated";
}

const rows: CustomerRow[] = [
  {
    id: "customer-1",
    name: "John Doe",
    phone: "+234 801 234 5678",
    email: "john@example.com",

    dateJoined: "Sep 1, 2026",
    status: "Active",
  },
  {
    id: "customer-2",
    name: "Jane Smith",
    phone: "+234 802 345 6789",
    email: "jane@example.com",

    dateJoined: "Aug 28, 2026",
    status: "Active",
  },
  {
    id: "customer-3",
    name: "Michael Okafor",
    phone: "+234 803 456 7890",
    email: "michael@example.com",

    dateJoined: "Aug 25, 2026",
    status: "Active",
  },
  {
    id: "customer-4",
    name: "Sarah Williams",
    phone: "+234 804 567 8901",
    email: "sarah@example.com",

    dateJoined: "Aug 20, 2026",
    status: "Deactivated",
  },
];

const columns: Column<CustomerRow>[] = [
  {
    header: "Name",
    render: (customer) => (
      <span className="font-semibold text-navy-950">{customer.name}</span>
    ),
  },
  {
    header: "Phone",
    render: (customer) => customer.phone,
  },
  {
    header: "Email",
    render: (customer) => customer.email,
  },

  {
    header: "Status",
    render: (customer) => (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          customer.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
        {customer.status}
      </span>
    ),
  },
  {
    header: "Date Joined",
    render: (customer) => customer.dateJoined,
  },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Customers</h1>

        <p className="mt-1 text-sm text-ink-500">
          Everyone who has purchased or reserved a property.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={(customer) => (
          <button
            type="button"
            disabled={customer.status === "Deactivated"}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
            Deactivate
          </button>
        )}
      />
    </div>
  );
}
