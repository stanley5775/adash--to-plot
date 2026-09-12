"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { useGetAllUsers, useToggleUserStatus } from "../../../../../hook/admin";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateJoined: string;
  status: "Active" | "Deactivated";
}

const columns: Column<CustomerRow>[] = [
  {
    header: "Name",
    render: (customer) => (
      <span className="font-semibold text-navy-950">{customer.name}</span>
    ),
  },
  {
    header: "Phone",
    render: (customer) => customer.phone || "—",
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
  const { data: users = [], isLoading, isError, error } = useGetAllUsers();

  const toggleUserStatusMutation = useToggleUserStatus();

  const rows: CustomerRow[] = users.map((user: any) => ({
    id: user.id,
    name: user.fullName,
    phone: user.phoneNumber,
    email: user.email,
    dateJoined: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: user.isActive ? "Active" : "Deactivated",
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink-500">Loading customers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load customers"}
        </p>
      </div>
    );
  }

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
            disabled={toggleUserStatusMutation.isPending}
            onClick={() => toggleUserStatusMutation.mutate(customer.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              customer.status === "Active"
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-green-200 text-green-600 hover:bg-green-50"
            } disabled:cursor-not-allowed disabled:opacity-50`}>
            {customer.status === "Active" ? "Deactivate" : "Activate"}
          </button>
        )}
      />
    </div>
  );
}
