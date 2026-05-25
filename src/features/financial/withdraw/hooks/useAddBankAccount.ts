import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { addBankAccount } from "../api/bankAccountApi";
import type { AddBankAccountPayload } from "@/features/financial/types";

export function useAddBankAccount() {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: (payload: AddBankAccountPayload) =>
      addBankAccount(axiosInstance, payload),
    onError: (
      error: AxiosError<{ data?: Record<string, string[]>; message?: string }>,
    ) => {
      const responseData = error.response?.data;
      const firstError =
        responseData?.data &&
        (Object.values(responseData.data)[0] as string[])?.[0];
      toast.error(
        firstError || responseData?.message || "تعذر إضافة الحساب البنكي. حاول مرة أخرى.",
      );
    },
  });
}
