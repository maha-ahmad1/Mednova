import type { AxiosInstance } from "axios";
import type {
  DisputesEnvelope,
  DisputesListData,
  DisputeDetail,
  DisputeStatus,
  ResolveDisputePayload,
} from "../types";

export const getAdminDisputes = async (
  axios: AxiosInstance,
  params: { page?: number; per_page?: number; status?: DisputeStatus | "all" },
): Promise<DisputesEnvelope<DisputesListData>> => {
  const queryParams: Record<string, string | number> = {
    per_page: params.per_page ?? 15,
    page: params.page ?? 1,
    status: params.status ?? "all",
  };

  const res = await axios.get<DisputesEnvelope<DisputesListData>>("/api/control-panel/financial/disputes", {
    params: queryParams,
  });
  return res.data;
};

export const getAdminDisputeDetail = async (
  axios: AxiosInstance,
  id: number | string,
): Promise<DisputesEnvelope<DisputeDetail>> => {
  const res = await axios.get<DisputesEnvelope<DisputeDetail>>(`/api/control-panel/financial/disputes/${id}`);
  return res.data;
};

export const resolveDispute = async (
  axios: AxiosInstance,
  id: number,
  payload: ResolveDisputePayload,
): Promise<{ success: boolean; message: string }> => {
  const res = await axios.post<{ success: boolean; message: string }>(
    `/api/control-panel/financial/disputes/${id}/resolve`,
    payload,
  );
  return res.data;
};
