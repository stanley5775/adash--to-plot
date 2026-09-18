import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/auth";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
