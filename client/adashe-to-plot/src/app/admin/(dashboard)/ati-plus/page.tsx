import { atiMembers } from "@/data/ati-members";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatDate, formatNaira } from "@/lib/payment";
import type { AtiMember } from "@/types/ati-member";

const columns: Column<AtiMember>[] = [
  { header: "Member", render: (m) => <span className="font-semibold text-navy-950">{m.name}</span> },
  { header: "Phone", render: (m) => m.phone },
  { header: "Email", render: (m) => m.email },
  { header: "Membership Status", render: (m) => <Badge tone={statusToTone(m.status)}>{m.status}</Badge> },
  { header: "Annual Fee", render: (m) => formatNaira(m.annualFee) },
  { header: "Subscription", render: (m) => <Badge tone={statusToTone(m.subscriptionStatus)}>{m.subscriptionStatus}</Badge> },
  { header: "Renews On", render: (m) => formatDate(m.renewalDate) },
  { header: "Join Date", render: (m) => formatDate(m.memberSince) },
  { header: "Level", render: (m) => <Badge tone="gold">{m.membershipLevel}</Badge> },
];

export default function AdminAtiPlusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">ATI Plus Members</h1>
        <p className="mt-1 text-sm text-ink-500">
          Everyone enrolled in the ATI Plus membership programme — a flat ₦15,000 annual subscription per member.
        </p>
      </div>
      <DataTable columns={columns} rows={atiMembers} />
    </div>
  );
}
