import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAtiMembership,
  verifyAtiMembership,
  checkAtiMembership,
} from "../api/ati";

export const useCreateAtiMembership = () => {
  return useMutation({
    mutationFn: createAtiMembership,
  });
};

export const useVerifyAtiMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAtiMembership,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ati-membership"],
      });
    },
  });
};

export const useCheckAtiMembership = () => {
  return useQuery({
    queryKey: ["ati-membership"],
    queryFn: checkAtiMembership,
  });
};
