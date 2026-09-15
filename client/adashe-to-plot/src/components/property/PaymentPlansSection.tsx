"use client";

import { Star } from "lucide-react";
import type { PlanRate } from "@/types/payment-plan";
import { PaymentPlanCard } from "./PaymentPlanCard";

export function PaymentPlansSection({
  price,
  rates,
  isAuthenticated,
  isAtiMember,
  canPurchase,
}: {
  price: number;
  rates: PlanRate[];
  isAuthenticated: boolean;
  isAtiMember: boolean;
  canPurchase: boolean;
}) {
  return (
    <div>
      {/* ATI PLUS NOTICE */}
      <div className="flex items-center gap-2.5 rounded-xl border border-gold-400 bg-gold-50 px-4 py-3 text-sm text-gold-700">
        <Star className="h-4 w-4 shrink-0" />

        <p>
          {isAtiMember ? (
            <>
              <span className="font-semibold">
                ATI Plus 5% discount applied.
              </span>{" "}
              Your member discount has been applied to these plans.
            </>
          ) : (
            <>
              <span className="font-semibold">ATI Plus members</span> get 5% off
              every payment plan.
            </>
          )}
        </p>
      </div>

      {/* PLANS */}
      <div
        className={`mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 ${
          rates.length > 3 ? "lg:grid-cols-5" : "lg:grid-cols-2"
        }`}>
        {rates.map((rate) => (
          <PaymentPlanCard
            key={rate.id}
            price={price}
            rate={rate}
            highlight={Number(rate.interestRate) === 0}
            isAtiPlusMember={isAtiMember}
            isAuthenticated={isAuthenticated}
            canPurchase={canPurchase}
          />
        ))}
      </div>
    </div>
  );
}
