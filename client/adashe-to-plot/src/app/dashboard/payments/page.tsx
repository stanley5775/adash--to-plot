import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";

export default function DashboardPaymentsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Payments" />
      {/* Payment History */}
      <div>
        <h3 className="text-base font-bold text-navy-950">Payment History</h3>

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

                  <td className="px-5 py-3.5 text-ink-700">
                    Property Installment
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-navy-950">
                    ₦250,000
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge tone={statusToTone("Paid")}>Paid</Badge>
                  </td>

                  <td className="px-5 py-3.5 text-ink-500">PAY-001234</td>
                </tr>

                <tr className="border-b border-navy-800/5">
                  <td className="px-5 py-3.5 text-ink-700">Aug 01, 2026</td>

                  <td className="px-5 py-3.5 text-ink-700">
                    Property Installment
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-navy-950">
                    ₦250,000
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge tone={statusToTone("Paid")}>Paid</Badge>
                  </td>

                  <td className="px-5 py-3.5 text-ink-500">PAY-001233</td>
                </tr>

                <tr>
                  <td className="px-5 py-3.5 text-ink-700">Jul 01, 2026</td>

                  <td className="px-5 py-3.5 text-ink-700">Initial Payment</td>

                  <td className="px-5 py-3.5 font-semibold text-navy-950">
                    ₦2,000,000
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge tone={statusToTone("Paid")}>Paid</Badge>
                  </td>

                  <td className="px-5 py-3.5 text-ink-500">PAY-001232</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Payment */}
      <div>
        <h3 className="text-base font-bold text-navy-950">Upcoming Payment</h3>

        <div className="mt-4 rounded-2xl border border-navy-800/10 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Next Payment
              </p>

              <p className="mt-1 text-lg font-bold text-navy-950">₦250,000</p>

              <p className="mt-1 text-sm text-ink-500">
                Due September 15, 2026
              </p>
            </div>

            <Badge tone={statusToTone("Pending")}>Pending</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
