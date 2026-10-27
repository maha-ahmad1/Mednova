import type { AxiosInstance } from "axios";
import type { AdminKawaderMeta, KawaderEnvelope } from "../types/kawader";

export const getAdminKawaderMeta = async (
  axiosInstance: AxiosInstance,
): Promise<KawaderEnvelope<AdminKawaderMeta>> => {
  const res = await axiosInstance.get<KawaderEnvelope<AdminKawaderMeta>>(
    "/api/control-panel/kawader/services",
  );
  return res.data;
};
