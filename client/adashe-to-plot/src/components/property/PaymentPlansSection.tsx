"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { PlanRate } from "@/types/payment-plan";
import { PaymentPlanCard } from "./PaymentPlanCard";

export function PaymentPlansSection({
  price,
  rates,
}: {
  price: number;
  rates: PlanRate[];
}) {
  const [isAtiPlusMember, setIsAtiPlusMember] = useState(false);

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-gold-400 bg-gold-50 px-4 py-2.5 text-sm font-medium text-gold-700">
        <button
          type="button"
          role="switch"
          aria-checked={isAtiPlusMember}
          onClick={() => setIsAtiPlusMember(!isAtiPlusMember)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
            isAtiPlusMember ? "bg-gold-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              isAtiPlusMember ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <Star className="h-4 w-4" />
        Preview pricing as an ATI Plus member (5% off every plan)
      </label>

      <div
        className={`mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 ${rates.length > 3 ? "lg:grid-cols-5" : "lg:grid-cols-2"}`}
      >
        {rates.map((rate) => (
          <PaymentPlanCard
            key={rate.duration}
            price={price}
            rate={rate}
            highlight={rate.interestRate === 0}
            isAtiPlusMember={isAtiPlusMember}
          />
        ))}
      </div>
    </div>
  );
}
