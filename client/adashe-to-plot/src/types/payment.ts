/**
 * Backend-ready payment model. The frontend currently produces and consumes
 * these shapes via a mock implementation (src/services/payment.service.ts),
 * but the shape is designed to map directly onto a future
 * POST /api/payments/initialize + webhook-verified backend record.
 */
export type PaymentType = "application_fee" | "property_purchase" | "installment";

export type PaymentStatus = "pending" | "success" | "failed";

export interface Payment {
  id: string;
  userId?: string;
  applicationId?: string;
  propertyId?: string;
  amount: number;
  currency: "NGN";
  type: PaymentType;
  status: PaymentStatus;
  reference: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentRequest {
  amount: number;
  email: string;
  applicationId: string;
}

export interface PaymentResult {
  success: boolean;
  reference?: string;
  status: "success" | "failed" | "pending";
  error?: string;
}
