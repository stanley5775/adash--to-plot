export type ContactFormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  message: string;
};
const api = process.env.NEXT_PUBLIC_BACKEND;
export const submitContactForm = async (data: ContactFormData) => {
  const response = await fetch(`${api}/api/v1/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send message");
  }

  return result;
};
