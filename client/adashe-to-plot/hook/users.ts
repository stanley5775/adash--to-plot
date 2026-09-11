import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { application, verify, checkApplication } from "../api/users";

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: application,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-application"],
      });
    },
  });
};

export const useVerifyApplicationPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verify,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-application"],
      });
    },
  });
};

export const useCheckApplication = () => {
  return useQuery({
    queryKey: ["check-application"],
    queryFn: checkApplication,
  });
};
