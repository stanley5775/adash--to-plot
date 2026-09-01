import { applications } from "@/data/applications";
import { properties } from "@/data/properties";
import { estates } from "@/data/estates";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { applicationStatusTone, formatApplicationStatus } from "@/lib/application-status";
import { formatNaira, formatDate } from "@/lib/payment";
import type { Application } from "@/types/application";

const columns: Column<Application>[] = [
  { header: "Application #", render: (a) => <span className="font-semibold text-navy-950">{a.applicationNumber ?? "Pending"}</span> },
  { header: "Applicant", render: (a) => `${a.applicant.surname} ${a.applicant.firstName}` },
  { header: "Property", render: (a) => properties.find((p) => p.id === a.property.propertyId)?.title ?? "—" },
  { header: "Estate", render: (a) => estates.find((e) => e.id === a.property.estateId)?.name ?? "—" },
  { header: "Current Stage", render: (a) => a.currentStage },
  { header: "Fee", render: (a) => formatNaira(a.applicationFee) },
  { header: "Status", render: (a) => <Badge tone={applicationStatusTone(a.status)}>{formatApplicationStatus(a.status)}</Badge> },
  { header: "Date", render: (a) => formatDate(a.dateStarted) },
];

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Applications</h1>
        <p className="mt-1 text-sm text-ink-500">
          Land Applications moving through each stage. The ₦15,000 fee shown here is billed separately from any
          property payment plan.
        </p>
      </div>
      <DataTable columns={columns} rows={applications} />
    </div>
  );
}
