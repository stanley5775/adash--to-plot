const api = process.env.NEXT_PUBLIC_BACKEND;

export const getEstates = async (): Promise<any[]> => {
  const res = await fetch(`${api}/admin/estate`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log(result, "from estates");

  if (!res.ok) {
    throw new Error(result.message || "Failed to get estates");
  }

  return result.data;
};

export const createEstateName = async (formData: FormData) => {
  const res = await fetch(`${api}/admin/estate/create-estatename`, {
    method: "POST",

    credentials: "include",
    body: formData,
  });
  const result = await res.json();
  console.log(result, "from create estate");
  if (!res.ok) {
    throw new Error(result.message || "Failed to create estate");
  }
  return result.data;
};

export const createEstate = async (formData: FormData) => {
  const res = await fetch(`${api}/admin/estate/create-estate`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create property");
  }

  return result.data;
};

export const getProperties = async (): Promise<any[]> => {
  const res = await fetch(`${api}/admin/estate/properties`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to get properties");
  }

  return result.data;
};

export const deleteProperty = async (propertyId: string) => {
  const res = await fetch(`${api}/admin/estate/properties/${propertyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete property");
  }

  return result.data;
};

export const deleteEstateName = async (estateId: string) => {
  const res = await fetch(`${api}/admin/estate/estate-name/${estateId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete estate name");
  }

  return result.data;
};

export const updateProperty = async (
  propertyId: string,
  formData: FormData,
) => {
  const res = await fetch(`${api}/admin/estate/properties/${propertyId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update property");
  }

  return result.data;
};

export const updateEstateName = async (
  estateId: string,
  formData: FormData,
) => {
  const res = await fetch(`${api}/admin/estate/estate-name/${estateId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update estate name");
  }

  return result.data;
};

export const createPropertyPaymentPlans = async ({
  propertyId,
  plans,
}: {
  propertyId: string;
  plans: {
    name: string;
    durationMonths: number;
    totalAmount: string;
    monthlyAmount: string;
  }[];
}) => {
  const res = await fetch(`${api}/admin/estate/${propertyId}/payment-plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ plans }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create payment plans");
  }

  return result.data;
};

export const getAllUsers = async () => {
  const res = await fetch(`${api}/admin/estate/users`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  console.log("GET USERS STATUS:", res.status);
  console.log("GET USERS RESPONSE:", result);
  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result.data;
};

export const toggleUserStatus = async (userId: string) => {
  const res = await fetch(`${api}/admin/estate/users/${userId}/status`, {
    method: "PUT",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update user status");
  }

  return result.data;
};

export type ATIMember = {
  membershipId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  ATI_membership: boolean;
  startDate: string;
  expiryDate: string;
  createdAt: string;
};

export const getAllATIMembers = async (): Promise<ATIMember[]> => {
  const res = await fetch(`${api}/admin/estate/ati-members`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log("GET ATI MEMBERS STATUS:", res.status);
  console.log("GET ATI MEMBERS RESPONSE:", result);

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch ATI members");
  }

  return result.data;
};

export const toggleUserATI = async (userId: string) => {
  const res = await fetch(`${api}/admin/estate/ati-members/${userId}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  // /ati-members/:userId/toggle
  const result = await res.json();

  console.log("TOGGLE ATI STATUS:", res.status);
  console.log("TOGGLE ATI RESPONSE:", result);

  if (!res.ok) {
    throw new Error(result.message || "Failed to update ATI membership");
  }

  return result.data;
};

export const getAllApplicants = async () => {
  const res = await fetch(`${api}/admin/estate/applicants`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log("ALL APPLICANTS:", result);

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch applicants");
  }

  return result.data;
};
