/**
 * Payment service — currently backed by a mock/simulated processor.
 *
 * FUTURE REAL PAYMENT ARCHITECTURE:
 *
 *   Frontend
 *     -> POST /api/payments/initialize   (this file's future implementation)
 *     -> Backend
 *     -> Payment Gateway (e.g. Paystack)
 *     -> Checkout
 *     -> Payment Gateway
 *     -> Backend verification (webhook + amount check)
 *     -> Application/payment marked PAID in the database
 *     -> Frontend dashboard reflects the verified status
 *
 * A real payment gateway secret key must NEVER be placed in this frontend —
 * initialization, verification, webhooks and amount checks all belong on the
 * backend. This file's public functions (`processApplicationPayment`,
 * `initializePayment`) are the only thing the UI depends on, so swapping the
 * implementation later requires no changes to any page or component.
 */
import type { PaymentRequest, PaymentResult, Payment } from "@/types/payment";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";

function generateMockReference(): string {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const existing = readStorage<Payment[]>(STORAGE_KEYS.payments, []);
  const sequence = String(existing.length + 1).padStart(4, "0");
  return `APP-PAY-${datePart}-${sequence}`;
}

function recordPayment(payment: Payment): void {
  const existing = readStorage<Payment[]>(STORAGE_KEYS.payments, []);
  writeStorage(STORAGE_KEYS.payments, [...existing, payment]);
}

/**
 * MOCK implementation — simulates a successful ₦15,000 Land Application fee
 * payment with a short artificial delay. No real money moves.
 *
 * Later this becomes `initializePayment()`, which will call
 * `POST /api/payments/initialize`, redirect to the gateway's checkout, and
 * resolve only once the backend has verified the transaction via webhook.
 */
export async function processApplicationPayment(request: PaymentRequest): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const reference = generateMockReference();

  recordPayment({
    id: `payment-${Date.now()}`,
    applicationId: request.applicationId,
    amount: request.amount,
    currency: "NGN",
    type: "application_fee",
    status: "success",
    reference,
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  return { success: true, status: "success", reference };
}

/**
 * Placeholder for the future real payment gateway call. Intentionally
 * unimplemented — wiring this up means adding a backend route, never a
 * frontend secret key.
 */
export async function initializePayment(_request: PaymentRequest): Promise<PaymentResult> {
  throw new Error(
    "initializePayment() is not implemented yet — this frontend prototype uses processApplicationPayment() " +
      "as a stand-in. Connect a backend /api/payments/initialize route (e.g. Paystack) to implement this."
  );
}

export async function getPaymentsByApplicationId(applicationId: string): Promise<Payment[]> {
  const all = readStorage<Payment[]>(STORAGE_KEYS.payments, []);
  return all.filter((p) => p.applicationId === applicationId);
}
