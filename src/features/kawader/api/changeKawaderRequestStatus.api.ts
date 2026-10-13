import type { AxiosInstance } from "axios";
import type {
  AdminKawaderDetails,
  ChangeKawaderStatusPayload,
  KawaderEnvelope,
} from "../types/kawader";
import { cleanParams } from "../utils/kawader-params";

export const changeKawaderRequestStatus = async (
  axiosInstance: AxiosInstance,
  id: number | string,
  payload: ChangeKawaderStatusPayload,
): Promise<KawaderEnvelope<AdminKawaderDetails>> => {
  const res = await axiosInstance.post<KawaderEnvelope<AdminKawaderDetails>>(
    `/api/control-panel/kawader/requests/${id}/status`,
    cleanParams(payload),
  );
  return res.data;
};
