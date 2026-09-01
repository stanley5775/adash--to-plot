"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Download } from "lucide-react";
import { getCurrentCustomer } from "@/services/customer.service";
import { getApplicationById } from "@/services/application.service";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ApplicationTimeline } from "@/components/dashboard/ApplicationTimeline";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { DownloadApplicationPdfButton } from "@/components/application/DownloadApplicationPdfButton";
import { applicationStatusTone, formatApplicationStatus } from "@/lib/application-status";
import { formatNaira, formatDate } from "@/lib/payment";
import type { Customer } from "@/types/customer";
import type { Application } from "@/types/application";

export default function DashboardApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [application, setApplication] = useState<Application | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    (async () => {
      const current = await getCurrentCustomer();
      const found = await getApplicationById(params.id);
      if (!active) return;
      setCustomer(current);
      setApplication(found ?? null);
    })();
    return () => {
      active = false;
    };
  }, [params.id]);

  if (application === null) notFound();
  if (!customer || application === undefined) return <LoadingState label="Loading application" />;

  const estate = estates.find((e) => e.id === application.property.estateId);
  const property = properties.find((p) => p.id === application.property.propertyId);

  return (
    <div className="space-y-8">
      <DashboardHeader
        customer={customer}
        title={application.applicationNumber ?? "Land Application"}
        subtitle={`${property?.title ?? "—"} — ${estate?.name ?? "—"}`}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-800/10 bg-white p-6">
        <div className="flex items-center gap-3">
          <Badge tone={applicationStatusTone(application.status)}>{formatApplicationStatus(application.status)}</Badge>
          <span className="text-sm text-ink-500">Started {formatDate(application.dateStarted)}</span>
        </div>
        <DownloadApplicationPdfButton application={application} estateName={estate?.name ?? "—"} propertyTitle={property?.title ?? "—"}>
          <Download className="h-4 w-4" /> Download Application PDF
        </DownloadApplicationPdfButton>
      </div>

      <ApplicationTimeline application={application} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <h3 className="text-base font-bold text-navy-950">Applicant Information</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Full name" value={`${application.applicant.surname} ${application.applicant.firstName}${application.applicant.middleName ? ` ${application.applicant.middleName}` : ""}`} />
            <Row label="Email" value={application.applicant.email} />
            <Row label="Phone" value={application.applicant.phone1} />
            <Row label="Address" value={application.applicant.residentialAddress} />
            <Row label="Occupation" value={application.applicant.occupation} />
            <Row label="Nationality" value={application.applicant.nationality} />
            <Row label="State of Origin" value={application.applicant.stateOfOrigin} />
          </dl>
        </div>

        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <h3 className="text-base font-bold text-navy-950">Property &amp; Payment Information</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Estate" value={estate?.name ?? "—"} />
            <Row label="Property" value={property?.title ?? "—"} />
            <Row label="Plot size" value={`${application.property.plotSizeSqm} sqm`} />
            <Row label="Payment option" value={application.property.paymentOption} />
            <Row label="Purpose" value={application.property.acquisitionPurpose} />
            <Row label="Land Application fee" value={formatNaira(application.applicationFee)} />
            {application.paymentReference && <Row label="Payment reference" value={application.paymentReference} />}
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-800/5 pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-navy-950">{value}</dd>
    </div>
  );
}
