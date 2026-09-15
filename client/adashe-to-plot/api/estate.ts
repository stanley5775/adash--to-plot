const api = process.env.NEXT_PUBLIC_BACKEND;
//
// export const getPropertiesUsers = async () => {
//   const res = await fetch(`${api}/api/estate/properties`, {
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error("Failed to fetch properties");

//   return res.json();
// };

// export const getPropertyFilters = async () => {
//   const res = await fetch(`${api}/api/estate/property-filters`, {
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error("Failed to fetch property filters");

//   return res.json();
// };

export const getPropertiesUsersById = async (propertyId: string) => {
  const res = await fetch(`${api}/api/estate/properties/${propertyId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch property");
  }

  return res.json();
};

export const getAllEstates = async ({
  search = "",
  state = "",
  price = "",
}: {
  search?: string;
  state?: string;
  price?: string;
} = {}) => {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (state) {
    params.set("state", state);
  }

  if (price) {
    params.set("price", price);
  }

  const query = params.toString();

  const res = await fetch(`${api}/api/estate${query ? `?${query}` : ""}`, {
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch estates");
  }

  return result;
};

export const getPropertiesByEstate = async (estateId: string) => {
  const res = await fetch(`${api}/api/estate/${estateId}/properties`, {
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch estate properties");
  }

  return result;
};

export const getAllActiveProperties = async (
  search = "",
  state = "",
  price = "",
) => {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (state) {
    params.set("state", state);
  }

  if (price) {
    params.set("price", price);
  }

  const query = params.toString();

  const res = await fetch(
    `${api}/api/estate/active${query ? `?${query}` : ""}`,
    {
      credentials: "include",
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch active properties");
  }

  return result;
};
