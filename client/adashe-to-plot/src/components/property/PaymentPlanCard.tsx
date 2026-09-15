"use client";

import type { PlanRate } from "@/types/payment-plan";
import { formatNaira } from "@/lib/payment";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";

export function PaymentPlanCard({
  price,
  rate,
  highlight,
  isAtiPlusMember,
  isAuthenticated,
  canPurchase,
}: {
  price: number;
  rate: PlanRate;
  highlight?: boolean;
  isAtiPlusMember?: boolean;
  isAuthenticated?: boolean;
  canPurchase?: boolean;
}) {
  const interestRate = Number(rate.interestRate);
  const totalPayable = Number(rate.totalAmount);
  const originalTotal = Number(rate.originalTotalAmount ?? rate.totalAmount);

  const discountAmount = Number(rate.atiDiscountAmount ?? 0);

  const monthlyAmount = rate.monthlyAmount ? Number(rate.monthlyAmount) : null;

  const isOutright = rate.durationMonths === null;

  const router = useRouter();

  const handlePurchase = () => {
    // Visitor → login and return directly to this purchase
    if (!isAuthenticated) {
      const redirectUrl = `/properties/${rate.propertyId}/purchase?plan=${rate.id}`;

      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    // Logged-in user, but property is unavailable
    if (!canPurchase) {
      return;
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-6 ${
        highlight
          ? "border-gold-500 bg-gold-50 shadow-[0_16px_32px_-20px_rgba(198,151,26,0.6)]"
          : "border-navy-800/10 bg-white"
      }`}>
      {/* PLAN HEADER */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-base font-bold text-navy-950">{rate.name}</h4>

        {interestRate === 0 ? (
          <Badge tone="success">0% interest</Badge>
        ) : (
          <Badge tone="gold">{interestRate}% interest</Badge>
        )}
      </div>

      {/* ATI PLUS PRIVILEGE */}
      {isAtiPlusMember && discountAmount > 0 && (
        <div className="rounded-xl border border-gold-300 bg-gold-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
            ATI Plus Member Privilege
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-500">
            Your exclusive 5% member discount has been applied to this payment
            plan.
          </p>

          <p className="mt-2 text-sm font-bold text-gold-700">
            You saved {formatNaira(discountAmount)}
          </p>
        </div>
      )}

      {/* PAYMENT DETAILS */}
      {isOutright ? (
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">
            Full Payment
          </p>

          {/* ORIGINAL PRICE */}
          {isAtiPlusMember && discountAmount > 0 && (
            <p className="mt-1 text-sm text-ink-400 line-through">
              {formatNaira(originalTotal)}
            </p>
          )}

          {/* ACTUAL PRICE */}
          <p className="text-2xl font-bold text-navy-950">
            {formatNaira(totalPayable)}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Monthly Payment
            </p>

            <p className="text-2xl font-bold text-navy-950">
              {formatNaira(monthlyAmount ?? 0)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-navy-800/10 pt-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Duration
              </p>

              <p className="font-semibold text-navy-950">
                {rate.durationMonths} months
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Total Payable
              </p>

              <p className="font-semibold text-navy-950">
                {formatNaira(totalPayable)}
              </p>
            </div>
          </div>

          {/* ORIGINAL PLAN PRICE */}
          {isAtiPlusMember && discountAmount > 0 && (
            <div className="border-t border-navy-800/10 pt-3">
              <p className="text-xs text-ink-400">
                Original plan:{" "}
                <span className="line-through">
                  {formatNaira(originalTotal)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* TOTAL */}
      <div className="flex items-center justify-between border-t border-navy-800/10 pt-3 text-sm">
        <span className="text-ink-500">Total payable</span>

        <span className="font-bold text-navy-950">
          {formatNaira(totalPayable)}
        </span>
      </div>

      {/* PURCHASE BUTTON */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handlePurchase}
          disabled={isAuthenticated && !canPurchase}
          className="w-full rounded-full bg-navy-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-50">
          {!isAuthenticated
            ? "Login to Purchase"
            : !canPurchase
              ? "Currently Unavailable"
              : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
