"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Eye } from "lucide-react";
import { getCurrentCustomer } from "@/services/customer.service";
import { getUserApplications } from "@/services/application.service";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { applicationStatusTone, formatApplicationStatus } from "@/lib/application-status";
import { formatDate } from "@/lib/payment";
import type { Customer } from "@/types/customer";
import type { Application } from "@/types/application";

export default function DashboardApplicationsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [applications, setApplications] = useState<Application[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const current = await getCurrentCustomer();
      const mine = await getUserApplications(current.email);
      if (!active) return;
      setCustomer(current);
      // Newly created applications (from the live /application flow) are
      // stored client-side (see src/lib/storage.ts), so this page must run
      // on the client to see them alongside the seeded demo applications.
      setApplications(mine);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!customer || !applications) return <LoadingState label="Loading your applications" />;

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title="Applications" subtitle="Every Land Application you've submitted, from payment to allocation." />

      <Button href="/application"><Plus className="h-4 w-4" /> Start a New Land Application</Button>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Once you start a Land Application, its progress will appear here."
          icon={<FileText className="h-8 w-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((application) => {
            const estate = estates.find((e) => e.id === application.property.estateId);
            const property = properties.find((p) => p.id === application.property.propertyId);
            return (
              <Link
                key={application.id}
                href={`/dashboard/applications/${application.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-navy-800/10 bg-white p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                    {application.applicationNumber ?? "Reference pending"}
                  </p>
                  <p className="mt-1 text-lg font-bold text-navy-950">{property?.title ?? "—"}</p>
                  <p className="mt-0.5 text-sm text-ink-500">{estate?.name} — {formatDate(application.dateStarted)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={applicationStatusTone(application.status)}>{formatApplicationStatus(application.status)}</Badge>
                  <span className="flex items-center gap-1 text-xs font-semibold text-navy-700">
                    <Eye className="h-3.5 w-3.5" /> View
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
