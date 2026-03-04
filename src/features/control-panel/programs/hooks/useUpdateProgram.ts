"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { updateProgram } from "../api/createProgram.api";
import type { UpdateProgramPayload } from "../types/create-program";
import { getMutationErrorMessage } from "./useMutationErrorMessage";

export function useUpdateProgram(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateProgramPayload) => updateProgram(axiosInstance, programId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-programs"] });
      queryClient.invalidateQueries({ queryKey: ["control-panel-program-details", String(programId)] });
      toast.success(response.message || "تم تحديث البرنامج بنجاح");
      router.push("/control-panel/programs");
    },
    onError: (error: AxiosError) => {
      toast.error(getMutationErrorMessage(error, "تعذر تحديث البرنامج. حاول مرة أخرى."));
    },
  });

  return {
    updateProgram: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
