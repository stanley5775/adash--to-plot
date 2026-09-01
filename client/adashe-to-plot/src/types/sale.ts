export type PaymentStatus = "Paid" | "Due" | "Upcoming" | "Overdue";

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  propertyId: string;
  estateId: string;
  planDuration: 0 | 6 | 12 | 18 | 24;
  startDate: string;
  totalPrice: number;
  totalPayable: number;
  amountPaid: number;
  outstandingBalance: number;
  salesStatus: "Completed" | "In Progress" | "Pending";
  paymentHistory: PaymentRecord[];
}
