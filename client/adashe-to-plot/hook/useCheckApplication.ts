import { useQuery } from "@tanstack/react-query";
import { checkApplication } from "../api/users";

export const useCheckApplication = () => {
  return useQuery({
    queryKey: ["check-application"],
    queryFn: checkApplication,
  });
};
