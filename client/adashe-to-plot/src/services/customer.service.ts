import type { Customer } from "@/types/customer";

async function parseResponse(response: Response): Promise<{
  success: boolean;
  customer?: Customer;
  customers?: Customer[];
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
 * Get all customers.
 *
 * Customer records will come from the backend.
 * This endpoint is primarily intended for authenticated/admin use.
 */
export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch("/api/customers", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const result = await parseResponse(response);

    if (!response.ok || !result.success) {
      return [];
    }

    return result.customers ?? [];
  } catch (error) {
    console.error("Get customers request failed:", error);
    return [];
  }
}

/**
 * Get the customer profile belonging to the currently
 * authenticated user.
 */
export async function getCurrentCustomer(): Promise<Customer | null> {
  try {
    const response = await fetch("/api/customers/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await parseResponse(response);

    if (!result.success || !result.customer) {
      return null;
    }

    return result.customer;
  } catch (error) {
    console.error("Get current customer request failed:", error);
    return null;
  }
}

/**
 * Get a specific customer by ID.
 */
export async function getCustomerById(
  id: string,
): Promise<Customer | undefined> {
  try {
    const response = await fetch(`/api/customers/${encodeURIComponent(id)}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return undefined;
    }

    const result = await parseResponse(response);

    if (!result.success || !result.customer) {
      return undefined;
    }

    return result.customer;
  } catch (error) {
    console.error("Get customer request failed:", error);
    return undefined;
  }
}
