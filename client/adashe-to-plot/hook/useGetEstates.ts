import { useQuery } from "@tanstack/react-query";
import { getEstates } from "../api/admin";

export const useGetEstates = () => {
  return useQuery({
    queryKey: ["estates"],
    queryFn: getEstates,
  });
};
