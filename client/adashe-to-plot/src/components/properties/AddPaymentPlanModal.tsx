"use client";

import { Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import {
  useCreatePropertyPaymentPlans,
  useDeletePropertyPaymentPlan,
  useGetPropertyPaymentPlans,
} from "../../../hook/admin";
import { DeletePaymentPlanModal } from "./DeletePaymentPlanModal";

type Props = {
  property: {
    id: string;
    estateName: string;
    startingPrice: string;
  } | null;

  onClose: () => void;
};

const plans = [
  {
    name: "6 Months",
    durationMonths: 6,
    description: "Short-term payment",
  },
  {
    name: "12 Months",
    durationMonths: 12,
    description: "Flexible yearly payment",
  },
  {
    name: "18 Months",
    durationMonths: 18,
    description: "More time to pay",
  },
  {
    name: "24 Months",
    durationMonths: 24,
    description: "Lowest monthly payment",
  },
];

export function AddPaymentPlanModal({ property, onClose }: Props) {
  const mutation = useCreatePropertyPaymentPlans();

  const deleteMutation = useDeletePropertyPaymentPlan();

  const { data: existingPlans = [], isLoading: plansLoading } =
    useGetPropertyPaymentPlans(property?.id ?? "");

  const [selectedPlans, setSelectedPlans] = useState<typeof plans>([]);

  const [planToDelete, setPlanToDelete] = useState<any | null>(null);

  if (!property) return null;

  const price = Number(property.startingPrice);

  const togglePlan = (plan: (typeof plans)[number]) => {
    setSelectedPlans((current) => {
      const exists = current.some(
        (item) => item.durationMonths === plan.durationMonths,
      );

      if (exists) {
        return current.filter(
          (item) => item.durationMonths !== plan.durationMonths,
        );
      }

      return [...current, plan];
    });
  };

  const selectAll = () => {
    setSelectedPlans(plans);
  };

  const clearAll = () => {
    setSelectedPlans([]);
  };

  const isSelected = (durationMonths: number) => {
    return selectedPlans.some((plan) => plan.durationMonths === durationMonths);
  };

  const handleSubmit = () => {
    if (selectedPlans.length === 0) {
      toast.error("Select at least one payment plan");
      return;
    }

    mutation.mutate(
      {
        propertyId: property.id,

        plans: selectedPlans.map((plan) => ({
          name: plan.name,
          durationMonths: plan.durationMonths,
          totalAmount: price.toFixed(2),
          monthlyAmount: (price / plan.durationMonths).toFixed(2),
        })),
      },
      {
        onSuccess: () => {
          toast.success(
            `${selectedPlans.length} payment ${
              selectedPlans.length === 1 ? "plan" : "plans"
            } added successfully`,
          );

          setSelectedPlans([]);
          onClose();
        },

        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const allSelected = selectedPlans.length === plans.length;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-navy-950">
                Add Payment Plans
              </h2>

              <p className="mt-1 text-sm text-ink-500">{property.estateName}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 disabled:opacity-50">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(90vh-145px)] overflow-y-auto p-6">
            {/* Property price */}
            <div className="mb-5 rounded-xl bg-ink-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Property price</span>

                <span className="font-bold text-navy-950">
                  ₦{price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Plan heading */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-navy-950">
                  Select payment plans
                </p>

                <p className="mt-1 text-xs text-ink-500">
                  You can select more than one.
                </p>
              </div>

              <button
                type="button"
                onClick={allSelected ? clearAll : selectAll}
                className="text-xs font-semibold text-navy-950 hover:underline">
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>

            {/* Selected count */}
            <div className="mb-4 flex items-center justify-between rounded-lg border border-ink-100 bg-white px-3 py-2">
              <span className="text-xs text-ink-500">Selected</span>

              <span className="text-xs font-semibold text-navy-950">
                {selectedPlans.length} of {plans.length}
              </span>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => {
                const selected = isSelected(plan.durationMonths);

                const monthlyAmount = price / plan.durationMonths;

                return (
                  <button
                    key={plan.durationMonths}
                    type="button"
                    onClick={() => togglePlan(plan)}
                    disabled={mutation.isPending}
                    className={`relative rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-navy-950 bg-navy-950 text-white"
                        : "border-ink-200 bg-white hover:border-navy-400 hover:bg-ink-50"
                    }`}>
                    {/* Checkbox */}
                    <div
                      className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-md border ${
                        selected
                          ? "border-white bg-white text-navy-950"
                          : "border-ink-300 bg-white"
                      }`}>
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </div>

                    <p className="pr-6 font-semibold">{plan.name}</p>

                    <p
                      className={`mt-1 text-xs ${
                        selected ? "text-white/70" : "text-ink-500"
                      }`}>
                      {plan.description}
                    </p>

                    <div
                      className={`mt-3 border-t pt-3 text-xs ${
                        selected ? "border-white/20" : "border-ink-100"
                      }`}>
                      <p
                        className={selected ? "text-white/70" : "text-ink-500"}>
                        Monthly
                      </p>

                      <p className="mt-0.5 font-semibold">
                        ₦
                        {monthlyAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selection summary */}
            {selectedPlans.length > 0 && (
              <div className="mt-4 rounded-xl bg-navy-50 p-4">
                <p className="text-sm font-semibold text-navy-950">
                  {selectedPlans.length}{" "}
                  {selectedPlans.length === 1 ? "plan" : "plans"} selected
                </p>

                <p className="mt-1 text-xs text-ink-500">
                  {selectedPlans.map((plan) => plan.name).join(" • ")}
                </p>
              </div>
            )}

            {/* Existing Payment Plans */}
            <div className="mt-6 border-t border-ink-100 pt-5">
              <div className="mb-3">
                <p className="text-sm font-semibold text-navy-950">
                  Existing Payment Plans
                </p>

                <p className="mt-1 text-xs text-ink-500">
                  Payment plans already added to this property.
                </p>
              </div>

              {plansLoading ? (
                <div className="rounded-xl border border-ink-100 bg-ink-50 p-4">
                  <p className="text-sm text-ink-500">
                    Loading payment plans...
                  </p>
                </div>
              ) : existingPlans.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-200 p-4 text-center">
                  <p className="text-sm text-ink-500">
                    No payment plans added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-4">
                      <div>
                        <p className="text-sm font-semibold text-navy-950">
                          {plan.name}
                        </p>

                        <p className="mt-1 text-xs text-ink-500">
                          {plan.durationMonths === null
                            ? "Full payment"
                            : `${plan.durationMonths} months`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-navy-950">
                            ₦{Number(plan.totalAmount).toLocaleString()}
                          </p>

                          {plan.monthlyAmount && (
                            <p className="mt-1 text-xs text-ink-500">
                              ₦{Number(plan.monthlyAmount).toLocaleString()}
                              /month
                            </p>
                          )}
                        </div>

                        {/* Outright cannot be deleted */}
                        {plan.durationMonths !== null && (
                          <button
                            type="button"
                            onClick={() => setPlanToDelete(plan)}
                            disabled={deleteMutation.isPending}
                            className="rounded-lg p-2 text-status-sold transition hover:bg-status-sold/10 disabled:opacity-50"
                            aria-label={`Delete ${plan.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-ink-100 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending || deleteMutation.isPending}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                selectedPlans.length === 0 ||
                mutation.isPending ||
                deleteMutation.isPending
              }>
              {mutation.isPending
                ? "Adding..."
                : selectedPlans.length > 0
                  ? `Add ${selectedPlans.length} ${
                      selectedPlans.length === 1 ? "Plan" : "Plans"
                    }`
                  : "Add Plans"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <DeletePaymentPlanModal
        plan={planToDelete}
        propertyId={property.id}
        mutation={deleteMutation}
        onClose={() => setPlanToDelete(null)}
        onSuccess={() => {
          toast.success("Payment plan deleted successfully");
          setPlanToDelete(null);
        }}
      />
    </>
  );
}
