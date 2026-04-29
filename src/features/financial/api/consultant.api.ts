import type { AxiosInstance } from "axios";
import type { ApiEnvelope, ConsultantWallet, Transaction } from "../types";

export const getConsultantWallet = async (
  axios: AxiosInstance,
): Promise<ApiEnvelope<ConsultantWallet>> => {
  const res = await axios.get<ApiEnvelope<ConsultantWallet>>(
    "/api/financial/consultant/wallet",
  );
  return res.data;
};

export const getConsultantTransactions = async (
  axios: AxiosInstance,
  params: { page?: number; per_page?: number } = { page: 1, per_page: 15 },
): Promise<ApiEnvelope<Transaction[]>> => {
  const res = await axios.get<ApiEnvelope<Transaction[]>>(
    "/api/financial/consultant/transactions",
    { params },
  );
  return res.data;
};
