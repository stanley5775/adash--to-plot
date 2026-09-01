import type { ApplicationStatus } from "@/types/application";
import type { BadgeTone } from "@/components/ui/Badge";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  payment_pending: "Payment Pending",
  paid: "Paid",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

export function formatApplicationStatus(status: ApplicationStatus): string {
  return APPLICATION_STATUS_LABELS[status] ?? status;
}

export function applicationStatusTone(status: ApplicationStatus): BadgeTone {
  const map: Record<ApplicationStatus, BadgeTone> = {
    draft: "neutral",
    payment_pending: "warning",
    paid: "success",
    submitted: "info",
    under_review: "warning",
    approved: "success",
    rejected: "danger",
  };
  return map[status] ?? "neutral";
}
