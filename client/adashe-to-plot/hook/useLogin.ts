import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
