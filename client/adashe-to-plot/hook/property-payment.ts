import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPropertyPurchase,
  submitPropertyPaymentReceipt,
} from "../api/property-payment";
const API_URL = process.env.NEXT_PUBLIC_BACKEND;
export const useCreatePropertyPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPropertyPurchase,

    onSuccess: async (data) => {
      // Refresh user's properties
      await queryClient.invalidateQueries({
        queryKey: ["user-properties"],
      });

      // Refresh dashboard stats
      await queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
      });

      // Refresh current property's purchase
      const propertyId = data?.data?.purchase?.propertyId;

      if (propertyId) {
        await queryClient.invalidateQueries({
          queryKey: ["my-property-purchase", propertyId],
        });
      }
    },
  });
};

export const useSubmitPropertyPaymentReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPropertyPaymentReceipt,

    onSuccess: async () => {
      // Payment affects the user's property/payment information
      await queryClient.invalidateQueries({
        queryKey: ["user-properties"],
      });

      // Payment also affects dashboard totals
      await queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
      });
    },
  });
};
export const useGetMyPropertyPurchase = (propertyId: string) => {
  return useQuery({
    queryKey: ["my-property-purchase", propertyId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/property-payment/properties/${propertyId}/purchase`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch purchase");
      }

      return data;
    },
    enabled: !!propertyId,
  });
};
