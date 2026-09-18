const API_URL = process.env.NEXT_PUBLIC_BACKEND;
export type CreatePropertyPurchasePayload = {
  propertyId: string;
  paymentPlanId: string;
};

export type CreatePropertyPurchaseResponse = {
  success: boolean;
  message: string;
  data: {
    purchase: {
      id: string;
      propertyId: string;
      paymentPlanId: string;
      propertyPrice: string;
      totalPayable: string;
      amountPaid: string;
      balance: string;
      durationMonths: number;
      paymentAmount: string;
      interestPercentage: string;
      status: string;
    };
    pricing: {
      originalAmount: number;
      discountPercentage: number;
      discountAmount: number;
      totalPayable: number;
      hasATIDiscount: boolean;
      paymentAmount: number;
      durationMonths: number;
    };
  };
};

export type SubmitPropertyPaymentReceiptPayload = {
  purchaseId: string;
  amount: number;
  receipt: File;
};

export type SubmitPropertyPaymentReceiptResponse = {
  success: boolean;
  message: string;
  data: {
    verification: unknown;
    amountPaid: string;
    balance: string;
  };
};

export const createPropertyPurchase = async (
  payload: CreatePropertyPurchasePayload,
): Promise<CreatePropertyPurchaseResponse> => {
  const response = await fetch(
    `${API_URL}/api/property-payment/property-purchase`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to create property purchase");
  }

  return data;
};

export const submitPropertyPaymentReceipt = async (
  payload: SubmitPropertyPaymentReceiptPayload,
): Promise<SubmitPropertyPaymentReceiptResponse> => {
  const formData = new FormData();

  formData.append("purchaseId", payload.purchaseId);
  formData.append("amount", payload.amount.toFixed(2));
  formData.append("receipt", payload.receipt);

  const response = await fetch(`${API_URL}/api/property-payment/receipt`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to submit payment receipt");
  }

  return data;
};
