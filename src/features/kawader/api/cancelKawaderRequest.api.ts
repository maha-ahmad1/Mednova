import type { AxiosInstance } from "axios";
import type {
  CancelKawaderRequestPayload,
  KawaderEnvelope,
  KawaderRequest,
} from "../types/kawader";
import { cleanParams } from "../utils/kawader-params";

export const cancelKawaderRequest = async (
  axiosInstance: AxiosInstance,
  id: number | string,
  payload: CancelKawaderRequestPayload = {},
): Promise<KawaderEnvelope<KawaderRequest>> => {
  const res = await axiosInstance.post<KawaderEnvelope<KawaderRequest>>(
    `/api/kawader/patient/requests/${id}/cancel`,
    cleanParams(payload),
  );
  return res.data;
};
