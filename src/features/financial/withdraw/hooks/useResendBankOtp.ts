import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { resendBankOtp } from "../api/bankAccountApi";

export function useResendBankOtp() {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: () => resendBankOtp(axiosInstance),
    onSuccess: () => {
      toast.success("تم إرسال رمز التحقق بنجاح");
    },
    onError: () => {
      toast.error("تعذر إرسال رمز التحقق. حاول مرة أخرى.");
    },
  });
}
