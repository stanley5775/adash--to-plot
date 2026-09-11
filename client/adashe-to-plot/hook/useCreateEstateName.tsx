import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEstateName } from "../api/admin";

export const useCreateEstateName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEstateName,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["estates"],
      });
    },
  });
};
