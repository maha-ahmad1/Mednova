"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { approveProgram, rejectProgram } from "../api/programManagement.api";
import type { ProgramStatus } from "../types/program";

interface ProgramStatusActionParams {
  programId: number;
  nextStatus: Extract<ProgramStatus, "approved" | "rejected">;
}

export function useProgramStatusAction() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ programId, nextStatus }: ProgramStatusActionParams) =>
      nextStatus === "approved"
        ? approveProgram(axiosInstance, programId)
        : rejectProgram(axiosInstance, programId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-programs"] });
      toast.success(variables.nextStatus === "approved" ? "تمت الموافقة على البرنامج" : "تم رفض البرنامج");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "تعذر تحديث حالة البرنامج. حاول مرة أخرى.");
    },
  });
}
