const api = process.env.NEXT_PUBLIC_BACKEND;

// Create ATI membership + pending payment
export const createAtiMembership = async () => {
  const res = await fetch(`${api}/api/ati/membership`, {
    method: "POST",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create ATI membership");
  }

  return result;
};

// Verify ATI Paystack payment
export const verifyAtiMembership = async (reference: string) => {
  const res = await fetch(`${api}/api/ati/membership/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      reference,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to verify ATI payment");
  }

  return result;
};

// Check current ATI membership
export const checkAtiMembership = async () => {
  const res = await fetch(`${api}/api/ati/membership/check`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to check ATI membership");
  }

  return result;
};
