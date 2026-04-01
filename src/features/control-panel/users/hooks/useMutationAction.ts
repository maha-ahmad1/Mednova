"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface UseMutationActionParams<TData, TVariables>
  extends Omit<UseMutationOptions<TData, AxiosError, TVariables>, "mutationFn" | "onSuccess" | "onError"> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string | ((data: TData, variables: TVariables) => string | undefined);
  errorExtractor?: (error: AxiosError) => string | undefined;
  fallbackErrorMessage?: string;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
}

export function useMutationAction<TData, TVariables>({
  mutationFn,
  successMessage,
  errorExtractor,
  fallbackErrorMessage = "حدث خطأ غير متوقع. حاول مرة أخرى.",
  onSuccess,
  ...options
}: UseMutationActionParams<TData, TVariables>) {
  return useMutation<TData, AxiosError, TVariables>({
    ...options,
    mutationFn,
    onSuccess: async (data, variables) => {
      const resolvedSuccessMessage =
        typeof successMessage === "function" ? successMessage(data, variables) : successMessage;

      if (resolvedSuccessMessage) {
        toast.success(resolvedSuccessMessage);
      }

      await onSuccess?.(data, variables);
    },
    onError: (error) => {
      const extractedMessage = errorExtractor?.(error);
      toast.error(extractedMessage || fallbackErrorMessage);
    },
  });
}
