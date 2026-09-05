import type { Sale } from "@/types/sale";

async function parseResponse(response: Response): Promise<{
  success: boolean;
  sales?: Sale[];
  sale?: Sale;
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

export async function getSales(): Promise<Sale[]> {
  try {
    const response = await fetch("/api/sales", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const result = await parseResponse(response);

    if (!response.ok || !result.success) {
      return [];
    }

    return result.sales ?? [];
  } catch (error) {
    console.error("Get sales request failed:", error);
    return [];
  }
}

export async function getSaleByCustomerId(
  customerId: string,
): Promise<Sale | undefined> {
  try {
    const response = await fetch(
      `/api/sales/customer/${encodeURIComponent(customerId)}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const result = await parseResponse(response);

    if (!result.success || !result.sale) {
      return undefined;
    }

    return result.sale;
  } catch (error) {
    console.error("Get sale by customer request failed:", error);
    return undefined;
  }
}
