import type { EstatePaymentPlan } from "@/types/payment-plan";

export const estatePaymentPlans: EstatePaymentPlan[] = [
  {
    estateId: "thrive-estate",
    rates: [
      { duration: 0, interestRate: 0, label: "Outright" },
      { duration: 6, interestRate: 0, label: "6 Months" },
      { duration: 12, interestRate: 0.09, label: "12 Months" },
      { duration: 18, interestRate: 0.09, label: "18 Months" },
      { duration: 24, interestRate: 0.11, label: "24 Months" },
    ],
  },
  {
    estateId: "amio-vista-homes",
    rates: [
      { duration: 0, interestRate: 0, label: "Outright" },
      { duration: 6, interestRate: 0, label: "6 Months" },
    ],
  },
];

export async function getPaymentPlanForEstate(estateId: string): Promise<EstatePaymentPlan | undefined> {
  return estatePaymentPlans.find((p) => p.estateId === estateId);
}
