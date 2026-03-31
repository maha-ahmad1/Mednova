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

export type MutationApiResponse<T = unknown> = ApiResponse<T>;

export interface SubscriptionErrorResponse {
  error?: string;
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

export const activateSubscription = async (axiosInstance: AxiosInstance, userId: string) => {
  const response = await axiosInstance.post<MutationApiResponse<SubscriptionErrorResponse>>(
    `/api/control-panel/users/${userId}/temporary-subscription`,
  );

  return response.data;
};

export const getSubscribingUsers = async <T>(axiosInstance: AxiosInstance) => {
  const response = await axiosInstance.get<MutationApiResponse<T>>(
    "/api/control-panel/subscription/subscribing-users",
  );

  return response.data;
};

export const deactivateSubscription = async (axiosInstance: AxiosInstance, id: string) => {
  const response = await axiosInstance.patch<MutationApiResponse<SubscriptionErrorResponse>>(
    `/api/control-panel/subscription/subscribing-users/${id}`,
  );

  return response.data;
};
