"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteUser } from "../api/usersManagement.api";

export function useDeleteUser() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => deleteUser(axiosInstance, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "تعذر حذف المستخدم. حاول مرة أخرى.");
    },
  });
}
