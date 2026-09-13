"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import {
  applicationStatusTone,
  formatApplicationStatus,
} from "@/lib/application-status";
import { formatNaira, formatDate } from "@/lib/payment";
import { useGetAllApplicants } from "../../../../../hook/admin";

const columns: Column<any>[] = [
  {
    header: "Applicant",
    render: (a) => (
      <span className="font-semibold text-navy-950">
        {a.surname} {a.firstName} {a.middleName ?? ""}
      </span>
    ),
  },

  {
    header: "Email",
    render: (a) => a.email,
  },

  {
    header: "Phone",
    render: (a) => a.phone1,
  },

  {
    header: "Estate",
    render: (a) => a.estate ?? "—",
  },

  {
    header: "Plot Size",
    render: (a) => a.plotSize ?? "—",
  },

  {
    header: "Payment Option",
    render: (a) => a.paymentOption ?? "—",
  },

  {
    header: "Fee",
    render: () => formatNaira(20000),
  },

  {
    header: "Status",
    render: (a) => (
      <Badge tone={applicationStatusTone(a.status)}>
        {formatApplicationStatus(a.status)}
      </Badge>
    ),
  },

  {
    header: "Date",
    render: (a) => formatDate(a.createdAt),
  },

  {
    header: "Action",
    render: (a) => (
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-navy-950 hover:bg-gray-50">
          See More
        </summary>

        <div className="absolute right-0 z-20 mt-2 w-96 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-navy-950">
                Applicant Details
              </h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ink-500">Surname</p>
                  <p className="font-medium">{a.surname || "—"}</p>
                </div>

                <div>
                  <p className="text-ink-500">First Name</p>
                  <p className="font-medium">{a.firstName || "—"}</p>
                </div>

                <div>
                  <p className="text-ink-500">Middle Name</p>
                  <p className="font-medium">{a.middleName || "—"}</p>
                </div>

                <div>
                  <p className="text-ink-500">Sex</p>
                  <p className="font-medium">{a.sex || "—"}</p>
                </div>

                <div>
                  <p className="text-ink-500">Date of Birth</p>
                  <p className="font-medium">
                    {a.dateOfBirth ? formatDate(a.dateOfBirth) : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-ink-500">Nationality</p>
                  <p className="font-medium">{a.nationality || "—"}</p>
                </div>

                <div>
                  <p className="text-ink-500">State of Origin</p>
                  <p className="font-medium">{a.stateOfOrigin || "—"}</p>
                </div>

                <div>
                  <p className="text-ink-500">Phone</p>
                  <p className="font-medium">{a.phone1 || "—"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-navy-950">Address</h3>

              <p className="text-sm">{a.residentialAddress || "—"}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-navy-950">Employment</h3>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-ink-500">Occupation:</span>{" "}
                  {a.occupation || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Office Address:</span>{" "}
                  {a.officeAddress || "—"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-navy-950">Next of Kin</h3>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-ink-500">Name:</span>{" "}
                  {a.nextOfKinName || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Relationship:</span>{" "}
                  {a.nextOfKinRelationship || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Phone:</span>{" "}
                  {a.nextOfKinPhone || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Address:</span>{" "}
                  {a.nextOfKinAddress || "—"}
                </p>
              </div>
            </div>

            {a.isCorporate && (
              <div>
                <h3 className="mb-2 font-semibold text-navy-950">
                  Corporate Information
                </h3>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-ink-500">Business:</span>{" "}
                    {a.businessName || "—"}
                  </p>

                  <p>
                    <span className="text-ink-500">RC Number:</span>{" "}
                    {a.rcNumber || "—"}
                  </p>

                  <p>
                    <span className="text-ink-500">Nature:</span>{" "}
                    {a.natureOfBusiness || "—"}
                  </p>

                  <p>
                    <span className="text-ink-500">Company Phone:</span>{" "}
                    {a.companyPhone || "—"}
                  </p>

                  <p>
                    <span className="text-ink-500">Company Email:</span>{" "}
                    {a.companyEmail || "—"}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-navy-950">Application</h3>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-ink-500">Estate:</span>{" "}
                  {a.estate || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Plot Size:</span>{" "}
                  {a.plotSize || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Payment Option:</span>{" "}
                  {a.paymentOption || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Purpose:</span>{" "}
                  {a.acquisitionPurpose || "—"}
                </p>

                <p>
                  <span className="text-ink-500">Referral:</span>{" "}
                  {a.referralSource || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </details>
    ),
  },
];

export default function AdminApplicationsPage() {
  const {
    data: applicants = [],
    isLoading,
    isError,
    error,
  } = useGetAllApplicants();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Applications</h1>

          <p className="mt-1 text-sm text-ink-500">
            Land applications submitted by users.
          </p>
        </div>

        <p className="text-sm text-ink-500">Loading applications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-navy-950">Applications</h1>

        <p className="text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load applications."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Applications</h1>

        <p className="mt-1 text-sm text-ink-500">
          Land applications submitted by users.
        </p>
      </div>

      <DataTable columns={columns} rows={applicants} />
    </div>
  );
}
