import type { AxiosInstance } from "axios";
import type {
  AdminKawaderFilters,
  AdminKawaderListItem,
  KawaderListEnvelope,
} from "../types/kawader";
import { cleanParams } from "../utils/kawader-params";

export const getAdminKawaderRequests = async (
  axiosInstance: AxiosInstance,
  filters: AdminKawaderFilters = {},
): Promise<KawaderListEnvelope<AdminKawaderListItem>> => {
  // cleanParams turns has_insurance into 1/0 and drops empty filters.
  const res = await axiosInstance.get<KawaderListEnvelope<AdminKawaderListItem>>(
    "/api/control-panel/kawader/requests",
    { params: cleanParams(filters) },
  );
  return res.data;
};
