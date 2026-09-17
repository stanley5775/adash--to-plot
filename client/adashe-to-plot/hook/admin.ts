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
  toggleUserATI,
  getAllATIMembers,
  getAllApplicants,
  getPropertyPaymentPlans,
  deletePropertyPaymentPlan,
  GetAllPayment,
  RejectPayment,
  ApprovePayment,
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
      formData,
    }: {
      estateId: string;
      formData: FormData;
    }) => updateEstateName(estateId, formData),

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

export const useATIMembers = () => {
  return useQuery({
    queryKey: ["ati-members"],
    queryFn: getAllATIMembers,
  });
};

export const useToggleUserATI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserATI,

    onSuccess: (data) => {
      console.log("ATI TOGGLE SUCCESS:", data);

      queryClient.invalidateQueries({
        queryKey: ["ati-members"],
      });
    },

    onError: (error) => {
      console.error("ATI TOGGLE ERROR:", error);
    },

    onSettled: () => {
      console.log("ATI TOGGLE FINISHED");
    },
  });
};

export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: ["applicants"],
    queryFn: getAllApplicants,
  });
};

export const useGetPropertyPaymentPlans = (propertyId: string) => {
  return useQuery({
    queryKey: ["propertyPaymentPlans", propertyId],
    queryFn: () => getPropertyPaymentPlans(propertyId),
    enabled: !!propertyId,
  });
};

export const useDeletePropertyPaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      propertyId,
    }: {
      planId: string;
      propertyId: string;
    }) => deletePropertyPaymentPlan(planId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["propertyPaymentPlans", variables.propertyId],
      });
    },
  });
};

export const useGetAllPayment = () => {
  return useQuery({
    queryKey: ["admin-payment-verifications"],
    queryFn: GetAllPayment,
  });
};

// Approve payment
export const useApprovePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (verificationId: string) => ApprovePayment(verificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-payment-verifications"],
      });
    },
  });
};

// Reject payment
export const useRejectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      verificationId,
      rejectionReason,
    }: {
      verificationId: string;
      rejectionReason: string;
    }) => RejectPayment(verificationId, rejectionReason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-payment-verifications"],
      });
    },
  });
};
