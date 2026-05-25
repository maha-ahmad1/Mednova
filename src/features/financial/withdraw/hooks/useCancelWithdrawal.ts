import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { cancelWithdrawal } from "../api/withdrawalsApi";

export function useCancelWithdrawal() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelWithdrawal(axiosInstance, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "withdrawals"] });
      toast.success("تم إلغاء طلب السحب بنجاح");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "تعذر إلغاء طلب السحب. حاول مرة أخرى.",
      );
    },
  });
}
