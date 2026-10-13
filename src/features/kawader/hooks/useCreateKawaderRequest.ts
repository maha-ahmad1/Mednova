"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { createKawaderRequest } from "../api";
import type { CreateKawaderRequestPayload } from "../types/kawader";
import { handleKawaderError, type KawaderFieldErrors } from "../utils/kawader-errors";
import { kawaderKeys } from "../utils/kawader-query-keys";

interface UseCreateKawaderRequestOptions {
  /** Receives `{ field: message }` on a 422 validation error — wire it to `form.setError`. */
  onValidationError?: (errors: KawaderFieldErrors) => void;
}

export function useCreateKawaderRequest({ onValidationError }: UseCreateKawaderRequestOptions = {}) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: (payload: CreateKawaderRequestPayload) => createKawaderRequest(axiosInstance, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: kawaderKeys.myRequests(locale) });
      if (response.message) toast.success(response.message);
    },
    onError: (error) => handleKawaderError(error, t, onValidationError),
  });

  return { createRequest: mutation.mutateAsync, isLoading: mutation.isPending };
}
