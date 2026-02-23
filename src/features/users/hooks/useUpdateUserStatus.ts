"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import {
  updateUserStatus,
  type UpdateUserApprovalStatus,
} from "../api/usersManagement.api";
import type { AxiosError } from "axios";

interface UpdateUserStatusParams {
  userId: string;
  approvalStatus: UpdateUserApprovalStatus;
  reason?: string;
}

export function useUpdateUserStatus() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      approvalStatus,
      reason,
    }: UpdateUserStatusParams) =>
      updateUserStatus(axiosInstance, userId, {
        approval_status: approvalStatus,
        ...(reason ? { reason } : {}),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(
        variables.approvalStatus === "approved"
          ? "تم تحديث حالة المستخدم إلى موافق عليه"
          : "تم تحديث حالة المستخدم إلى مرفوض",
      );
    },
    onError: (error: AxiosError<{ data?: Record<string, string[]>; message?: string }>) => {
      const responseData = error.response?.data;

      const validationErrors = responseData?.data;

      const firstError =
        validationErrors && (Object.values(validationErrors)[0] as string[])?.[0];

      toast.error(
        firstError ||
          responseData?.message ||
          "تعذر تحديث حالة المستخدم. حاول مرة أخرى.",
      );
    },
  });
}
