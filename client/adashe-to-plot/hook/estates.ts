import { useQuery } from "@tanstack/react-query";
import {
  getPropertiesUsers,
  getPropertyFilters,
  getPropertiesUsersById,
  getAllEstates,
  getPropertiesByEstate,
  getAllActiveProperties,
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

export const useGetAllEstates = ({
  search = "",
  state = "",
  price = "",
}: {
  search?: string;
  state?: string;
  price?: string;
} = {}) => {
  return useQuery({
    queryKey: ["estates", search, state, price],
    queryFn: () =>
      getAllEstates({
        search,
        state,
        price,
      }),
  });
};

export const useGetPropertiesByEstate = (estateId: string) => {
  return useQuery({
    queryKey: ["estate-properties", estateId],
    queryFn: () => getPropertiesByEstate(estateId),
    enabled: !!estateId,
  });
};

export const useGetActivePropertiesUser = (
  search = "",
  state = "",
  price = "",
) => {
  const query = useQuery({
    queryKey: ["active-properties", search, state, price],
    queryFn: () => getAllActiveProperties(search, state, price),
  });

  return {
    ...query,
    properties: query.data?.data ?? [],
    filters: query.data?.filters ?? {
      states: [],
    },
  };
};
