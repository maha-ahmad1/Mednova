import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { verifyBankOtp } from "../api/bankAccountApi";

export function useVerifyBankOtp() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otp: string) => verifyBankOtp(axiosInstance, { otp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "bank-account"] });
      toast.success("تم التحقق من حسابك البنكي بنجاح");
    },
    onError: (
      error: AxiosError<{ data?: Record<string, string[]>; message?: string }>,
    ) => {
      const responseData = error.response?.data;
      const firstError =
        responseData?.data &&
        (Object.values(responseData.data)[0] as string[])?.[0];
      toast.error(
        firstError || responseData?.message || "رمز التحقق غير صحيح. حاول مرة أخرى.",
      );
    },
  });
}
