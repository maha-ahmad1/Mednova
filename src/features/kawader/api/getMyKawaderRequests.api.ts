import type { AxiosInstance } from "axios";
import type {
  KawaderListEnvelope,
  KawaderRequest,
  MyKawaderRequestsFilters,
} from "../types/kawader";
import { cleanParams } from "../utils/kawader-params";

export const getMyKawaderRequests = async (
  axiosInstance: AxiosInstance,
  filters: MyKawaderRequestsFilters = {},
): Promise<KawaderListEnvelope<KawaderRequest>> => {
  const res = await axiosInstance.get<KawaderListEnvelope<KawaderRequest>>(
    "/api/kawader/patient/requests",
    { params: cleanParams(filters) },
  );
  return res.data;
};
