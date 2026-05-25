import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { updateBankAccount } from "../api/bankAccountApi";
import type { AddBankAccountPayload } from "@/features/financial/types";

export function useUpdateBankAccount() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddBankAccountPayload) =>
      updateBankAccount(axiosInstance, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "bank-account"] });
    },
    onError: (
      error: AxiosError<{ data?: Record<string, string | string[]>; message?: string }>,
    ) => {
      const responseData = error.response?.data;
      const rawError = responseData?.data && Object.values(responseData.data)[0];
      const firstError = Array.isArray(rawError)
        ? rawError[0]
        : typeof rawError === "string"
        ? rawError
        : undefined;
      toast.error(firstError || responseData?.message || "تعذر تحديث الحساب البنكي. حاول مرة أخرى.");
    },
  });
}
