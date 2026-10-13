import type { AxiosInstance } from "axios";
import type { AdminKawaderDetails, KawaderEnvelope } from "../types/kawader";

export const getAdminKawaderRequestById = async (
  axiosInstance: AxiosInstance,
  id: number | string,
): Promise<KawaderEnvelope<AdminKawaderDetails>> => {
  const res = await axiosInstance.get<KawaderEnvelope<AdminKawaderDetails>>(
    `/api/control-panel/kawader/requests/${id}`,
  );
  return res.data;
};
