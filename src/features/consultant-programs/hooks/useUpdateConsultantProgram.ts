"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { updateConsultantProgram } from "../api";
import type { ConsultantProgramFormPayload } from "../types/consultant-program";

export function useUpdateConsultantProgram(id: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ConsultantProgramFormPayload) =>
      updateConsultantProgram(axiosInstance, id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      queryClient.invalidateQueries({ queryKey: ["consultant-program", id] });
      toast.success(response.message || "تم التحديث بنجاح");
    },
    onError: (error: AxiosError) => {
      toast.error("تعذر تحديث الكورس. حاول مرة أخرى.");
    },
  });

  return {
    updateProgram: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
