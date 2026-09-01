"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { PlanRate } from "@/types/payment-plan";
import { PaymentPlanCard } from "./PaymentPlanCard";

export function PaymentPlansSection({ price, rates }: { price: number; rates: PlanRate[] }) {
  const [isAtiPlusMember, setIsAtiPlusMember] = useState(false);

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-gold-400 bg-gold-50 px-4 py-2.5 text-sm font-medium text-gold-700">
        <input
          type="checkbox"
          checked={isAtiPlusMember}
          onChange={(e) => setIsAtiPlusMember(e.target.checked)}
          className="h-4 w-4 rounded border-gold-400 text-gold-600 focus:ring-gold-500"
        />
        <Star className="h-4 w-4" />
        Preview pricing as an ATI Plus member (5% off every plan)
      </label>

      <div className={`mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 ${rates.length > 3 ? "lg:grid-cols-5" : "lg:grid-cols-2"}`}>
        {rates.map((rate) => (
          <PaymentPlanCard key={rate.duration} price={price} rate={rate} highlight={rate.interestRate === 0} isAtiPlusMember={isAtiPlusMember} />
        ))}
      </div>
    </div>
  );
}
