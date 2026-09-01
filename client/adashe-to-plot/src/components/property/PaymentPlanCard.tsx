import type { PlanRate } from "@/types/payment-plan";
import { computePaymentPlan, formatNaira } from "@/lib/payment";
import { Badge } from "@/components/ui/Badge";
import { Star } from "lucide-react";

export function PaymentPlanCard({
  price,
  rate,
  highlight = false,
  isAtiPlusMember = false,
}: {
  price: number;
  rate: PlanRate;
  highlight?: boolean;
  isAtiPlusMember?: boolean;
}) {
  const plan = computePaymentPlan(price, rate, isAtiPlusMember);

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-6 ${
        highlight ? "border-gold-500 bg-gold-50 shadow-[0_16px_32px_-20px_rgba(198,151,26,0.6)]" : "border-navy-800/10 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-navy-950">{rate.label}</h4>
        {rate.interestRate === 0 ? (
          <Badge tone="success">0% interest</Badge>
        ) : (
          <Badge tone="gold">{Math.round(rate.interestRate * 100)}% interest</Badge>
        )}
      </div>

      {plan.duration === 0 ? (
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">Full Payment</p>
          <p className="text-2xl font-bold text-navy-950">{formatNaira(plan.firstPaymentAmount)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">Monthly Payment</p>
            <p className="text-2xl font-bold text-navy-950">{formatNaira(plan.monthlyAmount)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-navy-800/10 pt-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">Duration</p>
              <p className="font-semibold text-navy-950">{plan.installments} months</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">Total Payable</p>
              <p className="font-semibold text-navy-950">{formatNaira(plan.totalPayable)}</p>
            </div>
          </div>
        </div>
      )}

      {plan.isAtiPlusMember && plan.atiPlusDiscount > 0 && (
        <div className="flex items-center gap-1.5 rounded-lg bg-gold-100 px-3 py-2 text-xs font-semibold text-gold-700">
          <Star className="h-3.5 w-3.5" /> ATI Plus 5% discount applied — you saved {formatNaira(plan.atiPlusDiscount)}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-navy-800/10 pt-3 text-sm">
        <span className="text-ink-500">Total payable</span>
        <span className="font-bold text-navy-950">{formatNaira(plan.totalPayable)}</span>
      </div>
    </div>
  );
}
