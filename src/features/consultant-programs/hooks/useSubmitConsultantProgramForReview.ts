"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
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
    onError: () => {
      toast.error("تعذر إرسال الكورس للمراجعة. حاول مرة أخرى.");
    },
  });

  return { submitForReview: mutation.mutateAsync, isLoading: mutation.isPending };
}
