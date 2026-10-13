"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { changeKawaderRequestStatus } from "../api";
import type { ChangeKawaderStatusPayload } from "../types/kawader";
import { handleKawaderError, type KawaderFieldErrors } from "../utils/kawader-errors";
import { kawaderKeys } from "../utils/kawader-query-keys";

interface UseChangeKawaderRequestStatusOptions {
  /** Receives `{ field: message }` on a 422 validation error (e.g. a missing `reason`). */
  onValidationError?: (errors: KawaderFieldErrors) => void;
}

export function useChangeKawaderRequestStatus({
  onValidationError,
}: UseChangeKawaderRequestStatusOptions = {}) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: ChangeKawaderStatusPayload }) =>
      changeKawaderRequestStatus(axiosInstance, id, payload),
    onSuccess: (response, { id }) => {
      // The response has the same shape as A2, and the detail hook caches the unwrapped `data`
      // under this same key, so the open page re-renders with the new status at once.
      queryClient.setQueryData(kawaderKeys.adminRequestDetail(locale, id), response.data);
      queryClient.invalidateQueries({ queryKey: [...kawaderKeys.adminRequests(locale), "list"] });
      if (response.message) toast.success(response.message);
    },
    onError: (error) => handleKawaderError(error, t, onValidationError),
  });

  return { changeStatus: mutation.mutateAsync, isLoading: mutation.isPending };
}
