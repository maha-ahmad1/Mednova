import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { requestWithdrawal } from "../api/withdrawalsApi";

export function useRequestWithdrawal() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => requestWithdrawal(axiosInstance, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["financial", "consultant", "wallet"],
      });
      toast.success("تم إرسال طلب السحب بنجاح");
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
      toast.error(
        firstError ||
          responseData?.message ||
          "تعذر إرسال طلب السحب. حاول مرة أخرى.",
      );
    },
  });
}
