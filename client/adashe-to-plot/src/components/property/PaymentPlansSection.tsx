"use client";

import { Star } from "lucide-react";
import type { PlanRate } from "@/types/payment-plan";
import { PaymentPlanCard } from "./PaymentPlanCard";
import { useGetMyPropertyPurchase } from "../../../hook/property-payment";

export function PaymentPlansSection({
  price,
  isApplication,
  propertyId,
  isAtiMember,
  rates,
  estate,
  propertyLocation,
  propertyCity,
  propertyState,
  isAuthenticated,
  canPurchase,
}: {
  price: number;
  propertyId: string;
  isAtiMember: any;
  isApplication: any;
  rates: PlanRate[];
  estate: {
    id: string;
    name: string;
    accountName: string | null;
    accountNumber: string | null;
    bankName: string | null;
  };
  propertyLocation?: string;
  propertyCity?: string;
  propertyState?: string;
  isAuthenticated: boolean;
  canPurchase: boolean;
}) {
  const { data: purchaseData, isLoading: purchaseLoading } =
    useGetMyPropertyPurchase(propertyId);
  console.log("data from purchaseData", purchaseData);
  const existingPurchaseId = purchaseData?.data?.purchase?.id ?? null;
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
            estate={estate}
            propertyLocation={propertyLocation}
            propertyCity={propertyCity}
            propertyState={propertyState}
            highlight={Number(rate.interestRate) === 0}
            isAtiPlusMember={isAtiMember}
            isApplication={isApplication}
            isAuthenticated={isAuthenticated}
            canPurchase={canPurchase}
            existingPurchaseId={existingPurchaseId}
          />
        ))}
      </div>
    </div>
  );
}
