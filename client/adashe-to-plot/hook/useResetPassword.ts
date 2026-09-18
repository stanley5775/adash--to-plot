import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
