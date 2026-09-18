import { useQuery } from "@tanstack/react-query";
import {
  getPropertiesUsersById,
  getAllEstates,
  getPropertiesByEstate,
  getAllActiveProperties,
} from "../api/estate";
const API_URL = process.env.NEXT_PUBLIC_BACKEND;
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

export const useGetPublicStats = () => {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/estate/public/stats`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch public statistics");
      }

      return data;
    },
  });
};
