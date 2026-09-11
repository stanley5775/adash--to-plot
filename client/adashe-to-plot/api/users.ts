const api = process.env.NEXT_PUBLIC_BACKEND;

export const application = async (data: any) => {
  const res = await fetch(`${api}/api/users/create_application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create application");
  }

  return result;
};

export const verify = async (data: any) => {
  const res = await fetch(`${api}/api/users/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create application");
  }

  return result;
};

export const checkApplication = async () => {
  const res = await fetch(`${api}/api/users/check-application`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to check application");
  }

  return result;
};
