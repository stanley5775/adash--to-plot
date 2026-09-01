import { BellRing } from "lucide-react";
import type { Sale } from "@/types/sale";
import type { PlanRate } from "@/types/payment-plan";
import { buildInstallmentSchedule, formatNaira, formatDate } from "@/lib/payment";

export function PaymentProgress({ sale, rate, isAtiPlusMember = false }: { sale: Sale; rate: PlanRate; isAtiPlusMember?: boolean }) {
  const progressPct = Math.min(Math.round((sale.amountPaid / sale.totalPayable) * 100), 100);
  const schedule = buildInstallmentSchedule(sale.startDate, sale.totalPrice, rate, sale.paymentHistory.length, isAtiPlusMember);
  const nextDue = schedule.find((row) => row.status !== "Paid");

  return (
    <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-navy-950">Payment Progress</h3>
        <span className="text-sm font-semibold text-navy-950">{progressPct}% paid</span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-navy-100">
        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">Amount Paid</p>
          <p className="font-bold text-navy-950">{formatNaira(sale.amountPaid)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">Outstanding</p>
          <p className="font-bold text-navy-950">{formatNaira(sale.outstandingBalance)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">Total Payable</p>
          <p className="font-bold text-navy-950">{formatNaira(sale.totalPayable)}</p>
        </div>
      </div>

      {nextDue && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
            nextDue.isReminderWindow ? "border-gold-400 bg-gold-50" : "border-navy-800/10 bg-navy-50"
          }`}
        >
          <BellRing className={`mt-0.5 h-4 w-4 shrink-0 ${nextDue.isReminderWindow ? "text-gold-600" : "text-navy-600"}`} />
          <div>
            <p className="text-sm font-semibold text-navy-950">
              Next payment: {formatNaira(nextDue.amount)} due {formatDate(nextDue.dueDate)}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              {nextDue.isReminderWindow
                ? "Reminder: this payment is due within 5 days. A reminder notification has been sent."
                : "You'll receive a reminder 5 days before this payment is due."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
