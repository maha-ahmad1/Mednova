"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { resolveDispute } from "../api/disputesApi";
import type { ResolveDisputePayload } from "../types";

export function useResolveDispute(disputeId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResolveDisputePayload) =>
      resolveDispute(axiosInstance, disputeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dispute", String(disputeId)] });
      toast.success("تم حل النزاع بنجاح.");
    },
    onError: (error: AxiosError<{ data?: Record<string, string[]>; message?: string }>) => {
      const responseData = error.response?.data;
      const validationErrors = responseData?.data;
      const firstError =
        validationErrors && (Object.values(validationErrors)[0] as string[])?.[0];
      toast.error(firstError || responseData?.message || "تعذر حل النزاع. حاول مرة أخرى.");
    },
  });
}
