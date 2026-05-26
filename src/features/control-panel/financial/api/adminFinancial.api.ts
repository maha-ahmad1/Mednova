import type { AxiosInstance } from "axios";
import type { ApiEnvelope } from "@/features/financial/types";
import type {
  AdminDashboard,
  RevenueData,
  EscrowData,
  EscrowStatusFilter,
  AdminTransactionType,
  AdminTransactionsResponse,
  AdminWithdrawalStatusFilter,
  AdminWithdrawalsResponse,
  AdminWithdrawalDetailResponse,
  AdminProcessWithdrawalPayload,
} from "../types";

export const getAdminDashboard = async (
  axios: AxiosInstance,
): Promise<ApiEnvelope<AdminDashboard>> => {
  const res = await axios.get<ApiEnvelope<AdminDashboard>>(
    "/api/control-panel/financial/dashboard",
  );
  return res.data;
};

export const getAdminRevenue = async (
  axios: AxiosInstance,
  params?: { month?: string; page?: number; per_page?: number },
): Promise<ApiEnvelope<RevenueData>> => {
  const cleanParams: Record<string, unknown> = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 15,
  };
  if (params?.month) cleanParams.month = params.month;

  const res = await axios.get<ApiEnvelope<RevenueData>>(
    "/api/control-panel/financial/revenue",
    { params: cleanParams },
  );
  return res.data;
};

export const getAdminEscrow = async (
  axios: AxiosInstance,
  params?: { status?: EscrowStatusFilter; page?: number; per_page?: number },
): Promise<ApiEnvelope<EscrowData>> => {
  const cleanParams: Record<string, unknown> = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 15,
  };
  // "all" means no filter — omit the param so the backend returns everything
  if (params?.status && params.status !== "all") {
    cleanParams.status = params.status;
  }

  const res = await axios.get<ApiEnvelope<EscrowData>>(
    "/api/control-panel/financial/escrow",
    { params: cleanParams },
  );
  return res.data;
};

export const getAdminTransactions = async (
  axios: AxiosInstance,
  params?: { type?: AdminTransactionType | "all"; page?: number; per_page?: number },
): Promise<AdminTransactionsResponse> => {
  const cleanParams: Record<string, unknown> = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 15,
  };
  if (params?.type && params.type !== "all") {
    cleanParams.type = params.type;
  }

  const res = await axios.get<AdminTransactionsResponse>(
    "/api/control-panel/financial/transactions",
    { params: cleanParams },
  );
  return res.data;
};

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export const getAdminWithdrawals = async (
  axios: AxiosInstance,
  params?: { status?: AdminWithdrawalStatusFilter; page?: number; per_page?: number },
): Promise<AdminWithdrawalsResponse> => {
  const cleanParams: Record<string, unknown> = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 15,
  };
  // "all" means no filter — omit the param so the backend returns everything
  if (params?.status && params.status !== "all") {
    cleanParams.status = params.status;
  }

  const res = await axios.get<AdminWithdrawalsResponse>(
    "/api/control-panel/financial/withdrawals",
    { params: cleanParams },
  );
  return res.data;
};

export const getAdminWithdrawalDetails = async (
  axios: AxiosInstance,
  id: string,
): Promise<AdminWithdrawalDetailResponse> => {
  const res = await axios.get<AdminWithdrawalDetailResponse>(
    `/api/control-panel/financial/withdrawals/${id}`,
  );
  return res.data;
};

export const processAdminWithdrawal = async (
  axios: AxiosInstance,
  id: string,
  payload: AdminProcessWithdrawalPayload,
): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append("action", payload.action);
  if (payload.admin_note) formData.append("admin_note", payload.admin_note);
  if (payload.transfer_reference) formData.append("transfer_reference", payload.transfer_reference);
  if (payload.transfer_proof) formData.append("transfer_proof", payload.transfer_proof);

  const res = await axios.post<{ success: boolean; message: string }>(
    `/api/control-panel/financial/withdrawals/${id}/process`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};

export const downloadAdminWithdrawalProof = async (
  axios: AxiosInstance,
  id: string,
): Promise<Blob> => {
  const res = await axios.get<Blob>(
    `/api/control-panel/financial/withdrawals/${id}/proof`,
    { responseType: "blob" },
  );
  return res.data;
};
