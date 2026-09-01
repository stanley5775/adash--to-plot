export type PlanDuration = 0 | 6 | 12 | 18 | 24;

export interface PlanRate {
  duration: PlanDuration;
  interestRate: number;
  label: string;
}

export interface EstatePaymentPlan {
  estateId: string;
  rates: PlanRate[];
}

export interface ComputedInstallment {
  number: number;
  dueDate: string;
  amount: number;
  status: "Paid" | "Due" | "Upcoming";
  isFirstPayment: boolean;
}

export interface ComputedPaymentPlan {
  duration: PlanDuration;
  interestRate: number;
  principal: number;
  totalBeforeDiscount: number;
  atiPlusDiscount: number;
  isAtiPlusMember: boolean;
  monthlyAmount: number;
  firstPaymentAmount: number;
  totalPayable: number;
  installments: number;
}
