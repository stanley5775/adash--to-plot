import { getCurrentCustomer } from "@/services/customer.service";
import { getSaleByCustomerId } from "@/services/sale.service";
import { getPaymentPlanForEstate } from "@/services/payment-plan.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { buildInstallmentSchedule, formatNaira, formatDate } from "@/lib/payment";
import { Wallet, BellRing } from "lucide-react";

export default async function DashboardPaymentsPage() {
  const customer = await getCurrentCustomer();
  const sale = await getSaleByCustomerId(customer.id);

  if (!sale) {
    return (
      <div className="space-y-8">
        <DashboardHeader customer={customer} title="Payments" subtitle="Your full payment history and schedule." />
        <p className="text-sm text-ink-500">No payment records yet.</p>
      </div>
    );
  }

  const plan = await getPaymentPlanForEstate(customer.estateId);
  const rate = plan?.rates.find((r) => r.duration === sale.planDuration);
  const schedule = rate
    ? buildInstallmentSchedule(sale.startDate, sale.totalPrice, rate, sale.paymentHistory.length, customer.isAtiPlusMember)
    : [];
  const nextDue = schedule.find((row) => row.status !== "Paid");

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title="Payments" subtitle="Your full payment history and upcoming schedule." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Property Price" value={formatNaira(sale.totalPayable)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Amount Paid" value={formatNaira(sale.amountPaid)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Outstanding Balance" value={formatNaira(sale.outstandingBalance)} icon={<Wallet className="h-4 w-4" />} tone="gold" />
        <StatCard label="Next Payment" value={nextDue ? formatNaira(nextDue.amount) : "—"} icon={<BellRing className="h-4 w-4" />} />
      </div>

      {nextDue?.isReminderWindow && (
        <div className="flex items-start gap-3 rounded-2xl border border-gold-400 bg-gold-50 p-5">
          <BellRing className="mt-0.5 h-5 w-5 text-gold-600" />
          <div>
            <p className="text-sm font-semibold text-navy-950">
              Payment reminder: ₦{nextDue.amount.toLocaleString("en-NG")} is due on {formatDate(nextDue.dueDate)}.
            </p>
            <p className="mt-0.5 text-xs text-ink-500">This reminder is sent automatically 5 days before every due date.</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-base font-bold text-navy-950">Payment History</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-800/10 bg-navy-50">
                  <th className="px-5 py-3 font-semibold text-ink-700">Date</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Description</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Amount</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Status</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Reference</th>
                </tr>
              </thead>
              <tbody>
                {sale.paymentHistory.map((p) => (
                  <tr key={p.id} className="border-b border-navy-800/5 last:border-0">
                    <td className="px-5 py-3.5 text-ink-700">{formatDate(p.date)}</td>
                    <td className="px-5 py-3.5 text-ink-700">{p.description}</td>
                    <td className="px-5 py-3.5 font-semibold text-navy-950">{formatNaira(p.amount)}</td>
                    <td className="px-5 py-3.5"><Badge tone={statusToTone(p.status)}>{p.status}</Badge></td>
                    <td className="px-5 py-3.5 text-ink-500">{p.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {schedule.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-navy-950">Upcoming Schedule</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy-800/10 bg-navy-50">
                    <th className="px-5 py-3 font-semibold text-ink-700">Installment</th>
                    <th className="px-5 py-3 font-semibold text-ink-700">Due Date</th>
                    <th className="px-5 py-3 font-semibold text-ink-700">Amount</th>
                    <th className="px-5 py-3 font-semibold text-ink-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.number} className="border-b border-navy-800/5 last:border-0">
                      <td className="px-5 py-3.5 text-ink-700">#{row.number}</td>
                      <td className="px-5 py-3.5 text-ink-700">{formatDate(row.dueDate)}</td>
                      <td className="px-5 py-3.5 font-semibold text-navy-950">{formatNaira(row.amount)}</td>
                      <td className="px-5 py-3.5"><Badge tone={statusToTone(row.status)}>{row.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
