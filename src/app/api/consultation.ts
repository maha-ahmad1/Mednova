import type { AxiosInstance } from "axios";

export interface UpdateStatusValues {
  id: string | number;
  status: string;
  action_by: string;
  consultant_nature: string;
  action_reason?: string;
}

export const consultationApi = {
  updateStatus: async (axios: AxiosInstance, params: UpdateStatusValues) => {
    const response = await axios.post(
      "/api/consultation-request/update-status-request",
      params,
    );
    return response.data;
  },
};
