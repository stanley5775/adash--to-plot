export type PlanDuration = 0 | 6 | 12 | 18 | 24;

export type PlanRate = {
  id: string;
  propertyId: string;
  estateId: string;
  name: string;
  durationMonths: number | null;

  // Original prices
  totalAmount: string;
  monthlyAmount: string | null;

  interestRate: string;

  createdAt: string;
  updatedAt: string;
  originalTotalAmount: string;
  // User-specific pricing
  payableAmount?: string;
  payableMonthlyAmount?: string | null;

  // ATI
  atiDiscountAmount?: string;
  atiDiscountPercentage?: number;
};
