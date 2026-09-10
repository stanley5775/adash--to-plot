const api = process.env.NEXT_PUBLIC_BACKEND;
export const getEstatesName = async () => {
  const res = await fetch(`${api}/admin/estate`, {
    method: "GET",
  });

  const result = await res.json();
  console.log(result, "from estateName");
  if (!res.ok) {
    throw new Error(result.message || "Failed to get estates");
  }

  return result.data;
};
