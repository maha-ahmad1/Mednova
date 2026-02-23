"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { updateUserStatus, type UpdateUserApprovalStatus } from "../api/usersManagement.api";

interface UpdateUserStatusParams {
  userId: string;
  approvalStatus: UpdateUserApprovalStatus;
  reason?: string;
}

export function useUpdateUserStatus() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, approvalStatus, reason }: UpdateUserStatusParams) =>
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
    onError: (error: Error) => {
      toast.error(error.message || "تعذر تحديث حالة المستخدم. حاول مرة أخرى.");
    },
  });
}
