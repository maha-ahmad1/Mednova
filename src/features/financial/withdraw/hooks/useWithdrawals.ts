import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getWithdrawals } from "../api/withdrawalsApi";
import type { ApiEnvelope, Withdrawal, WithdrawalStatus } from "@/features/financial/types";

export const useWithdrawals = (
  page = 1,
  perPage = 15,
  status?: WithdrawalStatus | "all",
) => {
  const axiosInstance = useAxiosInstance();
  return useQuery<ApiEnvelope<Withdrawal[]>, Error>({
    queryKey: ["financial", "withdrawals", { page, perPage, status }],
    queryFn: () => getWithdrawals(axiosInstance, { page, per_page: perPage, status }),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};
