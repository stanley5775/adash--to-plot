import { useQuery } from "@tanstack/react-query";
import { getEstatesName } from "../api/admin";

export const useGetEstates = () => {
  return useQuery({
    queryKey: ["estates"],
    queryFn: getEstatesName,
  });
};
