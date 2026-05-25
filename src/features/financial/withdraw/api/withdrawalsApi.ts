import type { AxiosInstance } from "axios";
import type { ApiEnvelope, Withdrawal, GetWithdrawalsParams } from "@/features/financial/types";

export const requestWithdrawal = async (
  axios: AxiosInstance,
  amount: number,
): Promise<ApiEnvelope<void>> => {
  const res = await axios.post<ApiEnvelope<void>>(
    "/api/financial/withdrawals",
    { amount },
  );
  return res.data;
};

export const getWithdrawals = async (
  axios: AxiosInstance,
  params: GetWithdrawalsParams = {},
): Promise<ApiEnvelope<Withdrawal[]>> => {
  const queryParams: Record<string, unknown> = {
    per_page: params.per_page ?? 15,
    page: params.page ?? 1,
  };
  if (params.status && params.status !== "all") queryParams.status = params.status;
  const res = await axios.get<ApiEnvelope<Withdrawal[]>>("/api/financial/withdrawals", {
    params: queryParams,
  });
  return res.data;
};

export const cancelWithdrawal = async (
  axios: AxiosInstance,
  id: number,
): Promise<ApiEnvelope<void>> => {
  const res = await axios.post<ApiEnvelope<void>>(
    `/api/financial/withdrawals/${id}/cancel`,
  );
  return res.data;
};
