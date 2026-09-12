"use client";

import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { useCreatePropertyPaymentPlans } from "../../../hook/admin";

type Props = {
  property: {
    id: string;
    estateName: string;
    startingPrice: string;
  } | null;
  onClose: () => void;
};

const plans = [
  { name: "6 Months", durationMonths: 6 },
  { name: "12 Months", durationMonths: 12 },
  { name: "18 Months", durationMonths: 18 },
  { name: "24 Months", durationMonths: 24 },
];

export function AddPaymentPlanModal({ property, onClose }: Props) {
  const mutation = useCreatePropertyPaymentPlans();

  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    durationMonths: number;
  } | null>(null);

  if (!property) return null;

  const handleSubmit = () => {
    if (!selectedPlan) {
      toast.error("Select a payment plan");
      return;
    }

    const totalAmount = Number(property.startingPrice);

    mutation.mutate(
      {
        propertyId: property.id,
        plans: [
          {
            name: selectedPlan.name,
            durationMonths: selectedPlan.durationMonths,
            totalAmount: totalAmount.toFixed(2),
            monthlyAmount: (totalAmount / selectedPlan.durationMonths).toFixed(
              2,
            ),
          },
        ],
      },
      {
        onSuccess: () => {
          toast.success("Payment plan added successfully");
          setSelectedPlan(null);
          onClose();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-navy-950">
              Add Payment Plan
            </h2>

            <p className="mt-1 text-sm text-ink-500">{property.estateName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm font-medium text-navy-950">
            Select payment duration
          </p>

          <div className="grid grid-cols-2 gap-3">
            {plans.map((plan) => {
              const selected =
                selectedPlan?.durationMonths === plan.durationMonths;

              return (
                <button
                  key={plan.durationMonths}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-ink-200 hover:border-navy-400"
                  }`}>
                  <p className="font-semibold">{plan.name}</p>

                  <p
                    className={`mt-1 text-xs ${
                      selected ? "text-white/70" : "text-ink-500"
                    }`}>
                    ₦
                    {(
                      Number(property.startingPrice) / plan.durationMonths
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /month
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-ink-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Property price</span>

              <span className="font-semibold text-navy-950">
                ₦{Number(property.startingPrice).toLocaleString()}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-500">Estate</span>

              <span className="font-semibold text-navy-950">
                {property.estateName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-ink-100 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedPlan || mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
