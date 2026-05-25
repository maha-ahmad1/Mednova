import type { AxiosInstance } from "axios";
import type {
  ApiEnvelope,
  BankAccount,
  AddBankAccountPayload,
  VerifyOtpPayload,
} from "@/features/financial/types";

export const addBankAccount = async (
  axios: AxiosInstance,
  data: AddBankAccountPayload,
): Promise<ApiEnvelope<BankAccount>> => {
  const res = await axios.post<ApiEnvelope<BankAccount>>(
    "/api/financial/bank-account",
    data,
  );
  return res.data;
};

export const verifyBankOtp = async (
  axios: AxiosInstance,
  data: VerifyOtpPayload,
): Promise<ApiEnvelope<void>> => {
  const res = await axios.post<ApiEnvelope<void>>(
    "/api/financial/bank-account/verify-otp",
    data,
  );
  return res.data;
};

export const getBankAccount = async (
  axios: AxiosInstance,
): Promise<ApiEnvelope<BankAccount>> => {
  const res = await axios.get<ApiEnvelope<BankAccount>>(
    "/api/financial/bank-account",
  );
  return res.data;
};

export const updateBankAccount = async (
  axios: AxiosInstance,
  data: AddBankAccountPayload,
): Promise<ApiEnvelope<BankAccount>> => {
  const res = await axios.put<ApiEnvelope<BankAccount>>(
    "/api/financial/bank-account",
    data,
  );
  return res.data;
};

export const resendBankOtp = async (
  axios: AxiosInstance,
): Promise<ApiEnvelope<void>> => {
  const res = await axios.post<ApiEnvelope<void>>(
    "/api/financial/bank-account/resend-otp",
  );
  return res.data;
};
