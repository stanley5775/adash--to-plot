import { useMutation } from "@tanstack/react-query";
import { createEstate } from "../api/admin";

export const useCreateEstate = () => {
  return useMutation({
    mutationFn: createEstate,
  });
};
