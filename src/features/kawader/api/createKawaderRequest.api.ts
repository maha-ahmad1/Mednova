import type { AxiosInstance } from "axios";
import type {
  CreateKawaderRequestPayload,
  KawaderEnvelope,
  KawaderRequest,
} from "../types/kawader";

export const createKawaderRequest = async (
  axiosInstance: AxiosInstance,
  payload: CreateKawaderRequestPayload,
): Promise<KawaderEnvelope<KawaderRequest>> => {
  const res = await axiosInstance.post<KawaderEnvelope<KawaderRequest>>(
    "/api/kawader/patient/requests",
    payload,
  );
  return res.data;
};
