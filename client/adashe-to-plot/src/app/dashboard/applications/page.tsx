"use client";

import Link from "next/link";
import { Eye, FileText, CalendarDays, ArrowRight } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetMyApplicationHistory } from "../../../../hook/users";
import { Button } from "@/components/ui/Button";

export default function ApplicationHistoryPage() {
  const { data, isLoading, isError } = useGetMyApplicationHistory();

  console.log("application check", data);

  const applications = data?.data?.applications ?? [];
  const isApplication = data?.data?.isApplication;

  return (
    <div className="space-y-8">
      <DashboardHeader title="Application History" />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-navy-50"
            />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Unable to load applications"
          description="Something went wrong while loading your application history."
        />
      ) : isApplication === false ? (
        <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50">
            <FileText className="h-6 w-6 text-navy-900" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-navy-950">
            No application found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500">
            You have not submitted a land application yet. Complete your
            application to continue with your property purchase.
          </p>
          <Button className="mt-4">
            <Link href="/application" className="mt- inline-flex items-center">
              Go to Application
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="You have not submitted any land applications yet."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application: any) => (
            <div
              key={application.id}
              className="rounded-2xl border border-navy-800/10 bg-white p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <FileText className="h-5 w-5 text-navy-900" />
                  </div>

                  <div>
                    <h3 className="font-bold text-navy-950">
                      {application.estate}
                    </h3>

                    <p className="mt-1 text-sm text-ink-500">
                      {application.surname} {application.firstName}
                      {application.middleName
                        ? ` ${application.middleName}`
                        : ""}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(application.createdAt)}
                      </span>

                      <span>•</span>

                      <span>{application.plotSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    tone={statusToTone(
                      formatApplicationStatus(application.status),
                    )}>
                    {formatApplicationStatus(application.status)}
                  </Badge>

                  <Link
                    href={`/dashboard/applications/${application.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
