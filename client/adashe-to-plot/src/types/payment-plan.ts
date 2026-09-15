export type PlanRate = {
  id: string;
  propertyId: string;
  estateId: string;
  name: string;
  durationMonths: number | null;
  totalAmount: string;
  monthlyAmount: string | null;
  interestRate: string;
  createdAt: string;
  updatedAt: string;

  originalTotalAmount?: string;
  originalMonthlyAmount?: string | null;
  atiDiscountAmount?: string;
  atiDiscountPercentage?: number;
};
