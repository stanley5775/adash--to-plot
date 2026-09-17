"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetMyPaymentHistory } from "../../../../hook/users";

export default function DashboardPaymentsPage() {
  const { data, isLoading, isError } = useGetMyPaymentHistory();

  const payments = data?.data?.payments ?? [];

  return (
    <div className="space-y-8">
      <DashboardHeader title="Payments" />

      {/* Payment History */}
      <div>
        <h3 className="text-base font-bold text-navy-950">Payment History</h3>

        {isLoading ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
            <div className="space-y-4 p-6">
              <div className="h-10 animate-pulse rounded bg-navy-50" />
              <div className="h-10 animate-pulse rounded bg-navy-50" />
              <div className="h-10 animate-pulse rounded bg-navy-50" />
            </div>
          </div>
        ) : isError ? (
          <div className="mt-4">
            <EmptyState
              title="Unable to load payments"
              description="Something went wrong while loading your payment history."
            />
          </div>
        ) : payments.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No payment history"
              description="You have not made any payments yet."
            />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy-800/10 bg-navy-50">
                    <th className="px-5 py-3 font-semibold text-ink-700">
                      Date
                    </th>

                    <th className="px-5 py-3 font-semibold text-ink-700">
                      Description
                    </th>

                    <th className="px-5 py-3 font-semibold text-ink-700">
                      Amount
                    </th>

                    <th className="px-5 py-3 font-semibold text-ink-700">
                      Status
                    </th>

                    <th className="px-5 py-3 font-semibold text-ink-700">
                      Reference
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment: any) => (
                    <tr
                      key={payment.id}
                      className="border-b border-navy-800/5 last:border-0">
                      <td className="px-5 py-3.5 text-ink-700">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-5 py-3.5 text-ink-700">
                        {payment.description ??
                          payment.type ??
                          "Property Payment"}
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-navy-950">
                        <td className="px-5 py-3.5 font-semibold text-navy-950">
                          {formatNaira(Number(payment.amount ?? 0) / 100)}
                        </td>
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge
                          tone={statusToTone(
                            formatPaymentStatus(payment.status),
                          )}>
                          {formatPaymentStatus(payment.status)}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-ink-500">
                        {payment.reference ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPaymentStatus(status: string | null | undefined) {
  if (!status) return "Pending";

  switch (status.toUpperCase()) {
    case "SUCCESS":
    case "PAID":
    case "APPROVED":
      return "Paid";

    case "PENDING":
      return "Pending";

    case "FAILED":
    case "REJECTED":
      return "Failed";

    default:
      return status;
  }
}
