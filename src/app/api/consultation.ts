 import axios from "axios";

export interface UpdateStatusValues {
  id: string | number;
  status: string;
  action_by: string;
  consultant_nature: string;
  action_reason?: string;
}

 const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const consultationApi = {

  updateStatus: async (
    params: UpdateStatusValues,
    token?: string
  ) => {
    const response = await apiClient.post(
      "/api/consultation-request/update-status-request",
      params,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return response.data;
  },
};
