import type { AxiosInstance } from "axios";

export type UpdateUserApprovalStatus = "approved" | "rejected";

export interface UpdateUserStatusPayload {
  approval_status: UpdateUserApprovalStatus;
  reason?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

export const updateUserStatus = async (
  axiosInstance: AxiosInstance,
  userId: string,
  payload: UpdateUserStatusPayload,
) => {
  const response = await axiosInstance.patch<ApiResponse>(
    `/api/control-panel/users/${userId}/status`,
    payload,
  );

  return response.data;
};

export const deleteUser = async (axiosInstance: AxiosInstance, userId: string) => {
  const response = await axiosInstance.delete<ApiResponse>(`/api/control-panel/users/${userId}`);

  return response.data;
};
