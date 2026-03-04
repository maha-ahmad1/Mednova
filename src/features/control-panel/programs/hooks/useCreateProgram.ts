"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { createProgram } from "../api/createProgram.api";
import type { CreateProgramPayload } from "../types/create-program";

interface ValidationErrorResponse {
  message?: string;
  data?: Record<string, string[]>;
}

export function useCreateProgram() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (payload: CreateProgramPayload) => createProgram(axiosInstance, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-programs"] });
      toast.success(response.message || "تم الإنشاء بنجاح");
      router.push("/control-panel/programs");
    },
    onError: (error: AxiosError<ValidationErrorResponse>) => {
      const responseData = error.response?.data;
      const validationErrors = responseData?.data;
      const firstError = validationErrors ? Object.values(validationErrors)[0]?.[0] : undefined;

      toast.error(firstError || responseData?.message || "تعذر إنشاء البرنامج. حاول مرة أخرى.");
    },
  });

  return {
    createProgram: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
