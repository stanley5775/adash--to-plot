import { estatePaymentPlans } from "@/data/payment-plans";
import type { EstatePaymentPlan } from "@/types/payment-plan";

export async function getPaymentPlanForEstate(estateId: string): Promise<EstatePaymentPlan | undefined> {
  return estatePaymentPlans.find((p) => p.estateId === estateId);
}

export async function getAllPaymentPlans(): Promise<EstatePaymentPlan[]> {
  return estatePaymentPlans;
}
