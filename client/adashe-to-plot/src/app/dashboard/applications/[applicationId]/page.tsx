"use client";

import Link from "next/link";
import { use } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  User,
  Users,
  Building2,
  MapPin,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetMyApplicationById } from "../../../../../hook/users";

type PageProps = {
  params: Promise<{
    applicationId: string;
  }>;
};

export default function ApplicationDetailsPage({ params }: PageProps) {
  const { applicationId } = use(params);

  const { data, isLoading, isError } = useGetMyApplicationById(applicationId);

  const application = data?.data?.application;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <DashboardHeader title="Application Details" />

        <div className="space-y-5">
          <div className="h-32 animate-pulse rounded-2xl bg-navy-50" />
          <div className="h-64 animate-pulse rounded-2xl bg-navy-50" />
          <div className="h-64 animate-pulse rounded-2xl bg-navy-50" />
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="space-y-8">
        <DashboardHeader title="Application Details" />

        <EmptyState
          title="Application not found"
          description="We could not find this application or you do not have access to it."
        />

        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader title="Application Details" />
      </div>

      {/* Application Header */}
      <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-50">
              <FileText className="h-6 w-6 text-navy-900" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-950">
                {application.estate}
              </h2>

              <p className="mt-1 text-sm text-ink-500">
                Application ID: {application.id}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(application.createdAt)}
                </span>

                <Badge
                  tone={statusToTone(
                    formatApplicationStatus(application.status),
                  )}>
                  {formatApplicationStatus(application.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <Section icon={<User className="h-5 w-5" />} title="Personal Information">
        <Info label="Surname" value={application.surname} />

        <Info label="First Name" value={application.firstName} />

        <Info label="Middle Name" value={application.middleName} />

        <Info label="Sex" value={application.sex} />

        <Info label="Date of Birth" value={application.dateOfBirth} />

        <Info label="Nationality" value={application.nationality} />

        <Info label="State of Origin" value={application.stateOfOrigin} />

        <Info label="Occupation" value={application.occupation} />

        <Info
          label="Residential Address"
          value={application.residentialAddress}
          full
        />

        <Info label="Office Address" value={application.officeAddress} full />
      </Section>

      {/* Contact Information */}
      <Section icon={<Phone className="h-5 w-5" />} title="Contact Information">
        <Info label="Primary Phone" value={application.phone1} />

        <Info label="Secondary Phone" value={application.phone2} />

        <Info
          label="Email"
          value={application.email}
          icon={<Mail className="h-4 w-4" />}
        />
      </Section>

      {/* Next of Kin */}
      <Section icon={<Users className="h-5 w-5" />} title="Next of Kin">
        <Info label="Full Name" value={application.nextOfKinName} />

        <Info label="Relationship" value={application.nextOfKinRelationship} />

        <Info label="Phone" value={application.nextOfKinPhone} />

        <Info label="Address" value={application.nextOfKinAddress} full />
      </Section>

      {/* Corporate Information */}
      {application.isCorporate && (
        <Section
          icon={<Building2 className="h-5 w-5" />}
          title="Corporate Information">
          <Info label="Business Name" value={application.businessName} />

          <Info label="RC Number" value={application.rcNumber} />

          <Info
            label="Nature of Business"
            value={application.natureOfBusiness}
          />

          <Info label="Company Phone" value={application.companyPhone} />

          <Info label="Company Email" value={application.companyEmail} />

          <Info
            label="Company Address"
            value={application.companyAddress}
            full
          />
        </Section>
      )}

      {/* Property Information */}
      <Section
        icon={<MapPin className="h-5 w-5" />}
        title="Property Information">
        <Info label="Estate" value={application.estate} />

        <Info label="Plot Size" value={application.plotSize} />

        <Info
          label="Payment Option"
          value={application.paymentOption}
          icon={<CreditCard className="h-4 w-4" />}
        />

        <Info
          label="Acquisition Purpose"
          value={application.acquisitionPurpose}
        />
      </Section>

      {/* Referral */}
      <Section
        icon={<Users className="h-5 w-5" />}
        title="Referral Information">
        <Info label="Referral Source" value={application.referralSource} />

        <Info label="Other" value={application.referralOther} />
      </Section>

      {/* Footer */}
      <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-navy-950">Application submitted</p>

            <p className="mt-1 text-sm text-ink-500">
              {formatDate(application.createdAt)}
            </p>
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/applications/${application.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            <Download className="h-4 w-4" />
            Export Application PDF
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
      <div className="flex items-center gap-3 border-b border-navy-800/10 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-900">
          {icon}
        </div>

        <h3 className="font-bold text-navy-950">{title}</h3>
      </div>

      <div className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Info({
  label,
  value,
  full = false,
  icon,
}: {
  label: string;
  value?: string | null;
  full?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
        {label}
      </p>

      <div className="mt-1 flex items-start gap-2">
        {icon && <span className="mt-0.5 text-ink-500">{icon}</span>}

        <p className="text-sm font-semibold text-navy-950">{value || "—"}</p>
      </div>
    </div>
  );
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatApplicationStatus(status: string | null | undefined) {
  if (!status) return "Pending";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
