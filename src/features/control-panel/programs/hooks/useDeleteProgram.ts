"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteProgram } from "../api/programManagement.api";

export function useDeleteProgram() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programId: number) => deleteProgram(axiosInstance, programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-programs"] });
      toast.success("تم حذف البرنامج بنجاح");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "تعذر حذف البرنامج. حاول مرة أخرى.");
    },
  });
}
