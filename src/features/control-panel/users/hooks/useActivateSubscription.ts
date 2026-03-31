"use client";

import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { activateSubscription } from "../api/usersManagement.api";
import { useMutationAction } from "./useMutationAction";

interface SubscriptionErrorPayload {
  data?: {
    error?: string;
  };
  error?: string;
  message?: string;
}

const extractSubscriptionError = (error: AxiosError): string | undefined => {
  const payload = error.response?.data as SubscriptionErrorPayload | undefined;
  return payload?.data?.error || payload?.error || payload?.message;
};

export function useActivateSubscription() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutationAction({
    mutationFn: async (userId: string) => activateSubscription(axiosInstance, userId),
    successMessage: (response) => response.message,
    errorExtractor: extractSubscriptionError,
    fallbackErrorMessage: "تعذر تفعيل الاشتراك. حاول مرة أخرى.",
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
        queryClient.invalidateQueries({ queryKey: ["subscribing-users"] }),
      ]);
    },
  });
}
