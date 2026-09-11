import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../api/auth";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
