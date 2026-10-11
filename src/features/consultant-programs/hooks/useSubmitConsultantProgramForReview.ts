"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { handleBackendFormError } from "@/lib/backendFormErrors";
import { submitConsultantProgramForReview } from "../api";

export function useSubmitConsultantProgramForReview(id: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => submitConsultantProgramForReview(axiosInstance, id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      queryClient.invalidateQueries({ queryKey: ["consultant-program", id] });
      toast.success(response.message || "تم إرسال الكورس للمراجعة");
    },
    onError: (error: AxiosError<{ message?: string; data?: Record<string, unknown> }>) => {
      handleBackendFormError(error);
    },
  });

  return { submitForReview: mutation.mutateAsync, isLoading: mutation.isPending };
}
