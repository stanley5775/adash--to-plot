/**
 * Backend-ready payment model.
 *
 * The frontend communicates with the backend through the payment service.
 * Payment initialization may return a checkout URL, while final payment
 * status must come from backend verification/webhooks.
 */

export type PaymentType =
  | "application_fee"
  | "property_purchase"
  | "installment";

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
  status: PaymentStatus;
  authorizationUrl?: string;
  error?: string;
}
