/**
 * Payment service.
 *
 * ARCHITECTURE:
 *
 *   Frontend
 *     -> POST /api/payments/initialize
 *     -> Backend
 *     -> Payment Gateway (e.g. Paystack)
 *     -> Checkout
 *     -> Payment Gateway
 *     -> Backend verification / webhook
 *     -> Payment marked PAID in database
 *     -> Frontend reflects verified payment status
 *
 * IMPORTANT:
 * Payment secrets, gateway secret keys, verification logic,
 * webhook handling and amount validation belong on the backend.
 *
 * The frontend only communicates with the backend through
 * the functions exported from this service.
 */

import type { PaymentRequest, PaymentResult, Payment } from "@/types/payment";

async function parseResponse(response: Response): Promise<{
  success: boolean;
  status?: PaymentResult["status"];
  reference?: string;
  authorizationUrl?: string;
  payment?: Payment;
  payments?: Payment[];
  error?: string;
}> {
  try {
    return await response.json();
  } catch {
    return {
      success: false,
      error: "Unable to process the server response.",
    };
  }
}

/**
 * Initialize an application payment.
 *
 * The backend should:
 * 1. Validate the authenticated user.
 * 2. Validate the application.
 * 3. Validate the amount.
 * 4. Create/initialize the payment with the gateway.
 * 5. Return the payment reference and checkout URL.
 *
 * No payment is considered successful at this point.
 */
export async function initializePayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  try {
    const response = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    const result = await parseResponse(response);

    if (!response.ok || !result.success) {
      return {
        success: false,
        status: result.status ?? "failed",
        error: result.error ?? "Unable to initialize payment.",
      };
    }

    return {
      success: true,
      status: result.status ?? "pending",
      reference: result.reference,
      authorizationUrl: result.authorizationUrl,
    };
  } catch (error) {
    console.error("Initialize payment request failed:", error);

    return {
      success: false,
      status: "failed",
      error: "Unable to connect to the payment server. Please try again.",
    };
  }
}

/**
 * Compatibility wrapper for the existing application flow.
 *
 * This function no longer simulates a payment.
 * It delegates directly to the real payment initialization API.
 */
export async function processApplicationPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  return initializePayment(request);
}

/**
 * Get payments belonging to an application.
 *
 * The backend must verify that the authenticated customer
 * is allowed to access the requested application.
 */
export async function getPaymentsByApplicationId(
  applicationId: string,
): Promise<Payment[]> {
  try {
    const response = await fetch(
      `/api/payments/application/${encodeURIComponent(applicationId)}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const result = await parseResponse(response);

    if (!result.success) {
      return [];
    }

    return result.payments ?? [];
  } catch (error) {
    console.error("Get application payments request failed:", error);
    return [];
  }
}
