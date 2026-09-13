const api = process.env.NEXT_PUBLIC_BACKEND;
//
export const getPropertiesUsers = async () => {
  const res = await fetch(`${api}/api/estate/properties`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch properties");

  return res.json();
};

export const getPropertyFilters = async () => {
  const res = await fetch(`${api}/api/estate/property-filters`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch property filters");

  return res.json();
};

export const getPropertiesUsersById = async (propertyId: string) => {
  const res = await fetch(`${api}/api/estate/properties/${propertyId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch property");
  }

  return res.json();
};

export const getAllEstates = async () => {
  const res = await fetch(`${api}/api/estate`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch estates");
  }

  return res.json();
};
