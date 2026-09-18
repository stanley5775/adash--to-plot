// hooks/useRegister.ts

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
