"use client";

import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deactivateSubscription } from "../api/usersManagement.api";
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

export function useDeactivateSubscription() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutationAction({
    mutationFn: async (id: string) => deactivateSubscription(axiosInstance, id),
    successMessage: (response) => response.message,
    errorExtractor: extractSubscriptionError,
    fallbackErrorMessage: "تعذر تعطيل الاشتراك. حاول مرة أخرى.",
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscribing-users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
