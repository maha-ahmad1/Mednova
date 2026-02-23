"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

type UpdateApprovalStatusPayload = {
  userId: string;
  approvalStatus: "approved" | "rejected";
  reason?: string;
};

const defaultErrorMessage = "حدث خطأ أثناء تنفيذ العملية";

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      defaultErrorMessage
    );
  }

  return defaultErrorMessage;
};

export function useDeleteAdminUserMutation() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, unknown, { userId: string }>({
    mutationFn: async ({ userId }) => {
      const response = await axiosInstance.delete<ApiResponse>(`/api/control-panel/users/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "تم حذف المستخدم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateApprovalStatusMutation() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, unknown, UpdateApprovalStatusPayload>({
    mutationFn: async ({ userId, approvalStatus, reason }) => {
      const response = await axiosInstance.patch<ApiResponse>(
        `/api/control-panel/users/${userId}/status`,
        {
          approval_status: approvalStatus,
          ...(reason ? { reason } : {}),
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "تم تحديث حالة المستخدم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
