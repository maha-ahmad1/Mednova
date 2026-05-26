"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { processAdminWithdrawal } from "../api/adminFinancial.api";
import type { AdminProcessWithdrawalPayload } from "../types";

export function useProcessAdminWithdrawal(id: string) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminProcessWithdrawalPayload) =>
      processAdminWithdrawal(axiosInstance, id, payload),
    onSuccess: (data) => {
      // Refresh both the list and the detail cache
      void queryClient.invalidateQueries({ queryKey: ["admin-financial-withdrawals"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-financial-withdrawal-detail", id] });
      toast.success(data.message || "تمت معالجة طلب السحب بنجاح.");
    },
    onError: (error: AxiosError<{ data?: Record<string, string[]>; message?: string }>) => {
      const responseData = error.response?.data;
      const validationErrors = responseData?.data;
      // Surface the first backend field error; fall back to the general message
      const firstError =
        validationErrors &&
        (Object.values(validationErrors)[0] as string[] | undefined)?.[0];
      toast.error(firstError ?? responseData?.message ?? "تعذر معالجة طلب السحب. حاول مرة أخرى.");
    },
  });
}
