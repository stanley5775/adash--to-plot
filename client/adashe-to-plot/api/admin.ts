const api = process.env.NEXT_PUBLIC_BACKEND;

export type Estate = {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  createdAt: string;
};

export const getEstates = async (): Promise<Estate[]> => {
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

export const createEstateName = async (data: {
  name: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}) => {
  const res = await fetch(`${api}/admin/estate/create-estatename`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
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
  data: {
    name: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  },
) => {
  const res = await fetch(`${api}/admin/estate/estate-name/${estateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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
