"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { reviewProgram } from "../api/reviewProgram.api";
import type { ReviewActionPayload } from "../types/review";

export function useReviewProgram(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewActionPayload) => reviewProgram(axiosInstance, programId, payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["review-program-detail", programId] });
      toast.success(payload.action === "approve" ? "تمت الموافقة على الكورس" : "تم رفض الكورس");
    },
    onError: (error: Error) => {
      toast.error(error.message || "تعذر تنفيذ الإجراء. حاول مرة أخرى.");
    },
  });
}
