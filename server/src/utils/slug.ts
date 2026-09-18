export const createSlug = (...values: string[]) => {
  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const EstatecreateSlug = (value: string, id: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${slug}-${id}`;
};
