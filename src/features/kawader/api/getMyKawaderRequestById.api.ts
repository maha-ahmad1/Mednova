import type { AxiosInstance } from "axios";
import type { KawaderEnvelope, KawaderRequest } from "../types/kawader";

export const getMyKawaderRequestById = async (
  axiosInstance: AxiosInstance,
  id: number | string,
): Promise<KawaderEnvelope<KawaderRequest>> => {
  const res = await axiosInstance.get<KawaderEnvelope<KawaderRequest>>(
    `/api/kawader/patient/requests/${id}`,
  );
  return res.data;
};
