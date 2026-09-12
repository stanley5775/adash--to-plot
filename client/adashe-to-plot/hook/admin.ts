import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEstate,
  getProperties,
  deleteProperty,
  deleteEstateName,
  updateProperty,
  updateEstateName,
  createPropertyPaymentPlans,
  getAllUsers,
  toggleUserStatus,
} from "../api/admin";
import { useQuery } from "@tanstack/react-query";

export const useCreateEstate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEstate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
};
export const useGetProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
};

export const useDeleteEstateName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEstateName,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["estates"],
      });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      formData,
    }: {
      propertyId: string;
      formData: FormData;
    }) => updateProperty(propertyId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
};

export const useUpdateEstateName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      estateId,
      data,
    }: {
      estateId: string;
      data: {
        name: string;
        accountName: string;
        accountNumber: string;
        bankName: string;
      };
    }) => updateEstateName(estateId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["estates"],
      });
    },
  });
};
export const useCreatePropertyPaymentPlans = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPropertyPaymentPlans,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["property-payment-plans", variables.propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
};
