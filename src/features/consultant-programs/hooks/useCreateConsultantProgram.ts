"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { createConsultantProgram } from "../api";
import type { ConsultantProgramFormPayload } from "../types/consultant-program";

export function useCreateConsultantProgram() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: ConsultantProgramFormPayload) =>
      createConsultantProgram(axiosInstance, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      toast.success(response.message || "تم الإنشاء بنجاح");
      router.push(`/profile/programs/${response.data.id}/edit`);
    },
    onError: (error: AxiosError) => {
      toast.error("تعذر إنشاء الكورس. حاول مرة أخرى.");
    },
  });

  return {
    createProgram: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
