import { useQuery } from "@tanstack/react-query";
import {
  getPropertiesUsers,
  getPropertyFilters,
  getPropertiesUsersById,
  getAllEstates,
} from "../api/estate";

export const useGetPropertiesUser = () => {
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: getPropertiesUsers,
  });

  const { data: filtersData, isLoading: filtersLoading } = useQuery({
    queryKey: ["property-filters"],
    queryFn: getPropertyFilters,
  });

  return {
    properties: propertiesData?.data ?? [],
    filters: filtersData?.data ?? {
      locations: [],
      cities: [],
      estateNames: [],
    },
    isLoading: propertiesLoading || filtersLoading,
  };
};

export const useGetPropertiesUsersById = (propertyId: string) => {
  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertiesUsersById(propertyId),
    enabled: !!propertyId,
  });
};

export const useGetAllEstates = () => {
  return useQuery({
    queryKey: ["estates"],
    queryFn: getAllEstates,
  });
};
