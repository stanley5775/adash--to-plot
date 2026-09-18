import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { application, verify, checkApplication } from "../api/users";
const API_URL = process.env.NEXT_PUBLIC_BACKEND;
export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: application,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-application"],
      });
    },
  });
};

export const useVerifyApplicationPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verify,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-application"],
      });
    },
  });
};

export const useCheckApplication = () => {
  return useQuery({
    queryKey: ["check-application"],
    queryFn: checkApplication,
  });
};

export const useGetUserDashboard = () => {
  return useQuery({
    queryKey: ["user-dashboard"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/users/dashboard`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      return data;
    },
  });
};

export const useGetMyProperties = () => {
  return useQuery({
    queryKey: ["user-properties"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/users/properties`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch your properties");
      }

      return data;
    },
  });
};

export const useGetMyPaymentHistory = () => {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/users/history`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment history");
      }

      return data;
    },
  });
};

export const useGetMyApplicationHistory = () => {
  return useQuery({
    queryKey: ["application-history"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/users/applications-history`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch application history");
      }

      return data;
    },
  });
};

export const useGetMyApplicationById = (applicationId: string) => {
  return useQuery({
    queryKey: ["application", applicationId],

    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/users/applications/${applicationId}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch application");
      }

      return data;
    },

    enabled: !!applicationId,
  });
};
