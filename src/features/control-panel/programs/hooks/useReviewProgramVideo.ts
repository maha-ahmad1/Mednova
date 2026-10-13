"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { reviewProgramVideo } from "../api/reviewProgramVideo.api";
import type { ReviewActionPayload } from "../types/review";

interface ReviewProgramVideoParams {
  programId: number;
  videoId: number;
  payload: ReviewActionPayload;
}

export function useReviewProgramVideo(programId?: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId: videoProgramId, videoId, payload }: ReviewProgramVideoParams) =>
      reviewProgramVideo(axiosInstance, videoProgramId, videoId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["review-program-detail", programId ?? variables.programId] });
      toast.success(variables.payload.action === "approve" ? "تمت الموافقة على الفيديو" : "تم رفض الفيديو");
    },
    onError: (error: Error) => {
      toast.error(error.message || "تعذر تنفيذ الإجراء. حاول مرة أخرى.");
    },
  });
}
