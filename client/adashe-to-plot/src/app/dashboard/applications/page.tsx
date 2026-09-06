"use client";

import { Eye } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardApplicationsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Application"
        subtitle="View your land application and payment history."
      />

      {/* View Application */}
      <div>
        <h3 className="text-base font-bold text-navy-950">View Application</h3>

        <div className="mt-4 rounded-2xl border border-navy-800/10 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                APP-001234
              </p>

              <h4 className="mt-1 text-lg font-bold text-navy-950">
                Premium Residential Plot
              </h4>

              <p className="mt-1 text-sm text-ink-500">
                Adashè Estate — Plot 24
              </p>

              <p className="mt-1 text-sm text-ink-500">
                Application Date: September 01, 2026
              </p>
            </div>

            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-xl border border-navy-800/10 px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50">
              <Eye className="h-4 w-4" />
              View Application
            </button>
          </div>
        </div>
      </div>

      {/* Application Payment History */}
      <div>
        <h3 className="text-base font-bold text-navy-950">
          Application Payment History
        </h3>

        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-800/10 bg-navy-50">
                  <th className="px-5 py-3 font-semibold text-ink-700">Date</th>
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
                <tr className="border-b border-navy-800/5">
                  <td className="px-5 py-3.5 text-ink-700">Sep 01, 2026</td>
                  <td className="px-5 py-3.5 text-ink-700">Initial Payment</td>
                  <td className="px-5 py-3.5 font-semibold text-navy-950">
                    ₦2,000,000
                  </td>
                  <td className="px-5 py-3.5 text-green-600">Paid</td>
                  <td className="px-5 py-3.5 text-ink-500">PAY-001234</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
