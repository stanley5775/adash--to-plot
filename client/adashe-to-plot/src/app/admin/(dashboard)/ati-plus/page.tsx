"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatDate } from "@/lib/payment";
import { useATIMembers } from "../../../../../hook/admin";

const columns: Column<any>[] = [
  {
    header: "Member",
    render: (m) => (
      <span className="font-semibold text-navy-950">{m.fullName}</span>
    ),
  },

  {
    header: "Phone",
    render: (m) => m.phoneNumber,
  },

  {
    header: "Email",
    render: (m) => m.email,
  },

  {
    header: "Membership Status",
    render: (m) => <Badge tone={statusToTone(m.status)}>{m.status}</Badge>,
  },

  {
    header: "Start Date",
    render: (m) => formatDate(m.startDate),
  },

  {
    header: "Expiry Date",
    render: (m) => formatDate(m.expiryDate),
  },
];

export default function AdminAtiPlusPage() {
  const { data: members = [], isLoading, isError, error } = useATIMembers();

  console.log("ATI MEMBERS:", members);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">ATI Plus Members</h1>

          <p className="mt-1 text-sm text-ink-500">
            Everyone currently enrolled in the ATI Plus membership programme.
          </p>
        </div>

        <p className="text-sm text-ink-500">Loading ATI members...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-navy-950">ATI Plus Members</h1>

        <p className="text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load ATI members."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">ATI Plus Members</h1>

        <p className="mt-1 text-sm text-ink-500">
          Everyone currently enrolled in the ATI Plus membership programme.
        </p>
      </div>

      <DataTable columns={columns} rows={members} />
    </div>
  );
}
