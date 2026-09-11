export const saveUser = (user: {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
}) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      role: user.role,
    }),
  );
};
