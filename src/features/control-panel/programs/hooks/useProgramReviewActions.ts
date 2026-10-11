"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { handleBackendFormError } from "@/lib/backendFormErrors";
import {
  approveProgram,
  approveProgramVideo,
  rejectProgram,
  rejectProgramVideo,
} from "../api/programManagement.api";

type ReviewError = AxiosError<{ message?: string; data?: Record<string, unknown> }>;

// Review actions on the admin program details page (program- and video-level). The backend
// message is shown as-is (e.g. 422 "already reviewed by another admin").
export function useProgramReviewActions(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["control-panel-program-details", String(programId)] });
    queryClient.invalidateQueries({ queryKey: ["review-queue"] });
    queryClient.invalidateQueries({ queryKey: ["control-panel-programs"] });
  };

  const onError = (error: ReviewError) => handleBackendFormError(error);

  const approveProgramMutation = useMutation({
    mutationFn: () => approveProgram(axiosInstance, programId),
    onSuccess: () => {
      invalidate();
      toast.success("تمت الموافقة على البرنامج");
    },
    onError,
  });

  const rejectProgramMutation = useMutation({
    mutationFn: (reason: string) => rejectProgram(axiosInstance, programId, reason),
    onSuccess: () => {
      invalidate();
      toast.success("تم رفض البرنامج");
    },
    onError,
  });

  const approveVideoMutation = useMutation({
    mutationFn: (videoId: number) => approveProgramVideo(axiosInstance, programId, videoId),
    onSuccess: () => {
      invalidate();
      toast.success("تمت الموافقة على الفيديو");
    },
    onError,
  });

  const rejectVideoMutation = useMutation({
    mutationFn: ({ videoId, reason }: { videoId: number; reason: string }) =>
      rejectProgramVideo(axiosInstance, programId, videoId, reason),
    onSuccess: () => {
      invalidate();
      toast.success("تم رفض الفيديو");
    },
    onError,
  });

  return { approveProgramMutation, rejectProgramMutation, approveVideoMutation, rejectVideoMutation };
}
