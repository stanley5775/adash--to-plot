import { useMutation } from "@tanstack/react-query";
import { application, verify } from "../api/users";

export const useCreateApplication = () => {
  return useMutation({
    mutationFn: application,
  });
};

export const useVerifyApplicationPayment = () => {
  return useMutation({
    mutationFn: verify,
  });
};
import { useQuery } from "@tanstack/react-query";
import { checkApplication } from "../api/users";

export const useCheckApplication = () => {
  return useQuery({
    queryKey: ["check-application"],
    queryFn: checkApplication,
  });
};
