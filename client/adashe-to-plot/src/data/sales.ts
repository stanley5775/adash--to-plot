import type { Sale } from "@/types/sale";

// Amounts below reflect property payment plans only (interest applied, ATI Plus
// 5% discount applied where the customer is a member — see src/lib/payment.ts).
// The ₦15,000 Land Application fee is billed separately via the Land Application
// flow (see src/services/application.service.ts) and is NEVER included here.
export const sales: Sale[] = [
  {
    id: "sale-001",
    customerId: "cust-001",
    customerName: "Emeka Okafor",
    propertyId: "thrive-3bed-penthouse",
    estateId: "thrive-estate",
    planDuration: 12,
    startDate: "2026-01-05",
    totalPrice: 2700000,
    totalPayable: 2795850,
    amountPaid: 1863904,
    outstandingBalance: 931946,
    salesStatus: "In Progress",
    paymentHistory: [
      { id: "pay-001-1", date: "2026-01-05", description: "Installment 1 of 12 (ATI Plus 5% discount applied)", amount: 232988, status: "Paid", reference: "ATP-EO-0001" },
      { id: "pay-001-2", date: "2026-02-05", description: "Installment 2 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0002" },
      { id: "pay-001-3", date: "2026-03-05", description: "Installment 3 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0003" },
      { id: "pay-001-4", date: "2026-04-05", description: "Installment 4 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0004" },
      { id: "pay-001-5", date: "2026-05-05", description: "Installment 5 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0005" },
      { id: "pay-001-6", date: "2026-06-05", description: "Installment 6 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0006" },
      { id: "pay-001-7", date: "2026-07-05", description: "Installment 7 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0007" },
      { id: "pay-001-8", date: "2026-08-05", description: "Installment 8 of 12", amount: 232988, status: "Paid", reference: "ATP-EO-0008" },
    ],
  },
  {
    id: "sale-002",
    customerId: "cust-002",
    customerName: "Chiamaka Nwosu",
    propertyId: "amio-2bed-bungalow",
    estateId: "amio-vista-homes",
    planDuration: 0,
    startDate: "2025-11-20",
    totalPrice: 3000000,
    totalPayable: 2850000,
    amountPaid: 2850000,
    outstandingBalance: 0,
    salesStatus: "Completed",
    paymentHistory: [
      { id: "pay-002-1", date: "2025-11-20", description: "Outright payment (ATI Plus 5% discount applied)", amount: 2850000, status: "Paid", reference: "ATP-CN-0001" },
    ],
  },
  {
    id: "sale-003",
    customerId: "cust-003",
    customerName: "Ibrahim Sule",
    propertyId: "thrive-fully-detached",
    estateId: "thrive-estate",
    planDuration: 24,
    startDate: "2026-04-02",
    totalPrice: 4600000,
    totalPayable: 5106000,
    amountPaid: 1063750,
    outstandingBalance: 4042250,
    salesStatus: "In Progress",
    paymentHistory: [
      { id: "pay-003-1", date: "2026-04-02", description: "Installment 1 of 24", amount: 212750, status: "Paid", reference: "ATP-IS-0001" },
      { id: "pay-003-2", date: "2026-05-02", description: "Installment 2 of 24", amount: 212750, status: "Paid", reference: "ATP-IS-0002" },
      { id: "pay-003-3", date: "2026-06-02", description: "Installment 3 of 24", amount: 212750, status: "Paid", reference: "ATP-IS-0003" },
      { id: "pay-003-4", date: "2026-07-02", description: "Installment 4 of 24", amount: 212750, status: "Paid", reference: "ATP-IS-0004" },
      { id: "pay-003-5", date: "2026-08-02", description: "Installment 5 of 24", amount: 212750, status: "Paid", reference: "ATP-IS-0005" },
    ],
  },
  {
    id: "sale-004",
    customerId: "cust-004",
    customerName: "Grace Adeyemi",
    propertyId: "thrive-4bed-semi-detached",
    estateId: "thrive-estate",
    planDuration: 6,
    startDate: "2026-05-10",
    totalPrice: 3400000,
    totalPayable: 3230000,
    amountPaid: 2153332,
    outstandingBalance: 1076668,
    salesStatus: "In Progress",
    paymentHistory: [
      { id: "pay-004-1", date: "2026-05-10", description: "Installment 1 of 6 (ATI Plus 5% discount applied)", amount: 538333, status: "Paid", reference: "ATP-GA-0001" },
      { id: "pay-004-2", date: "2026-06-10", description: "Installment 2 of 6", amount: 538333, status: "Paid", reference: "ATP-GA-0002" },
      { id: "pay-004-3", date: "2026-07-10", description: "Installment 3 of 6", amount: 538333, status: "Paid", reference: "ATP-GA-0003" },
      { id: "pay-004-4", date: "2026-08-10", description: "Installment 4 of 6", amount: 538333, status: "Paid", reference: "ATP-GA-0004" },
    ],
  },
  {
    id: "sale-005",
    customerId: "cust-005",
    customerName: "Tunde Bakare",
    propertyId: "amio-3bed-bungalow",
    estateId: "amio-vista-homes",
    planDuration: 6,
    startDate: "2026-06-01",
    totalPrice: 4000000,
    totalPayable: 4000000,
    amountPaid: 1333334,
    outstandingBalance: 2666666,
    salesStatus: "In Progress",
    paymentHistory: [
      { id: "pay-005-1", date: "2026-06-01", description: "Installment 1 of 6", amount: 666667, status: "Paid", reference: "ATP-TB-0001" },
      { id: "pay-005-2", date: "2026-07-01", description: "Installment 2 of 6", amount: 666667, status: "Paid", reference: "ATP-TB-0002" },
      { id: "pay-005-3", date: "2026-08-01", description: "Installment 3 of 6 — overdue", amount: 666667, status: "Overdue", reference: "ATP-TB-0003" },
    ],
  },
];

export async function getSales(): Promise<Sale[]> {
  return sales;
}

export async function getSaleByCustomerId(customerId: string): Promise<Sale | undefined> {
  return sales.find((s) => s.customerId === customerId);
}
