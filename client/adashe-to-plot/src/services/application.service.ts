/**
 * Land Application service.
 *
 * ARCHITECTURE:
 * Pages/components call only the functions exported here.
 * All application data is retrieved and mutated through the backend API.
 *
 * The backend is responsible for:
 * - Creating application records
 * - Generating official application numbers
 * - Storing application data
 * - Updating application status
 * - Verifying payments
 * - Recording payment references and timestamps
 */

import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
} from "@/types/application";

async function parseResponse(response: Response): Promise<{
  success: boolean;
  application?: Application;
  applications?: Application[];
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
 * Create a new land application.
 *
 * The backend should generate the application ID,
 * application number and timestamps.
 */
export async function createApplication(
  input: CreateApplicationInput,
): Promise<Application> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const result = await parseResponse(response);

  if (!response.ok || !result.success || !result.application) {
    throw new Error(result.error ?? "Unable to create your application.");
  }

  return result.application;
}

/**
 * Get an application by ID.
 */
export async function getApplicationById(
  id: string,
): Promise<Application | undefined> {
  try {
    const response = await fetch(
      `/api/applications/${encodeURIComponent(id)}`,
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

    if (!result.success || !result.application) {
      return undefined;
    }

    return result.application;
  } catch (error) {
    console.error("Get application request failed:", error);
    return undefined;
  }
}

/**
 * Get applications belonging to the currently authenticated customer.
 *
 * The email parameter is retained for compatibility with existing
 * pages/components. The backend should determine the authenticated
 * customer from the session rather than trusting the email supplied
 * by the frontend.
 */
export async function getUserApplications(
  _userEmail?: string,
): Promise<Application[]> {
  try {
    const response = await fetch("/api/applications/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const result = await parseResponse(response);

    if (!result.success) {
      return [];
    }

    return result.applications ?? [];
  } catch (error) {
    console.error("Get user applications request failed:", error);
    return [];
  }
}

/**
 * Get the current customer's application.
 *
 * The email parameter is retained for compatibility.
 * The backend should identify the customer from authentication.
 */
export async function getApplicationByCustomerEmail(
  _email: string,
): Promise<Application | undefined> {
  try {
    const response = await fetch("/api/applications/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return undefined;
    }

    const result = await parseResponse(response);

    if (!result.success || !result.applications?.length) {
      return undefined;
    }

    return result.applications[0];
  } catch (error) {
    console.error("Get customer application request failed:", error);
    return undefined;
  }
}

/**
 * Update an application.
 *
 * In production, the backend should validate which fields
 * the authenticated customer is allowed to update.
 */
export async function updateApplication(
  id: string,
  patch: Partial<Application>,
): Promise<Application | undefined> {
  try {
    const response = await fetch(
      `/api/applications/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(patch),
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const result = await parseResponse(response);

    if (!result.success || !result.application) {
      return undefined;
    }

    return result.application;
  } catch (error) {
    console.error("Update application request failed:", error);
    return undefined;
  }
}

/**
 * Submit an application after payment has been verified.
 *
 * The paymentReference is retained because the existing
 * application flow passes it here.
 *
 * IMPORTANT:
 * The backend must verify the payment before changing
 * the application to "submitted" / "Payment Confirmed".
 */
export async function submitApplication(
  id: string,
  paymentReference: string,
): Promise<Application | undefined> {
  try {
    const response = await fetch(
      `/api/applications/${encodeURIComponent(id)}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentReference,
        }),
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const result = await parseResponse(response);

    if (!result.success || !result.application) {
      return undefined;
    }

    return result.application;
  } catch (error) {
    console.error("Submit application request failed:", error);
    return undefined;
  }
}

/**
 * Get the current status of an application.
 */
export async function getApplicationStatus(
  id: string,
): Promise<ApplicationStatus | undefined> {
  const application = await getApplicationById(id);

  return application?.status;
}
