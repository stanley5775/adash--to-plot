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
