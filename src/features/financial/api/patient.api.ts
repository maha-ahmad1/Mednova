import type { AxiosInstance } from "axios";
import type { ApiEnvelope, PatientWallet, Transaction, PatientPayment } from "../types";

export const getPatientWallet = async (
  axios: AxiosInstance,
): Promise<ApiEnvelope<PatientWallet>> => {
  const res = await axios.get<ApiEnvelope<PatientWallet>>(
    "/api/financial/patient/wallet",
  );
  return res.data;
};

export const getPatientTransactions = async (
  axios: AxiosInstance,
  params: { page?: number; per_page?: number } = { page: 1, per_page: 15 },
): Promise<ApiEnvelope<Transaction[]>> => {
  const res = await axios.get<ApiEnvelope<Transaction[]>>(
    "/api/financial/patient/transactions",
    { params },
  );
  return res.data;
};

export const getPatientPayments = async (
  axios: AxiosInstance,
  params: { page?: number; per_page?: number } = { page: 1, per_page: 15 },
): Promise<ApiEnvelope<PatientPayment[]>> => {
  const res = await axios.get<ApiEnvelope<PatientPayment[]>>(
    "/api/financial/patient/payments",
    { params },
  );
  return res.data;
};
