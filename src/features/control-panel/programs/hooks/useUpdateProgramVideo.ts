"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { updateProgramVideo } from "../api/createProgram.api";
import type { UpdateProgramVideoPayload } from "../types/create-program";
import { getMutationErrorMessage } from "./useMutationErrorMessage";

export function useUpdateProgramVideo(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ videoId, payload }: { videoId: number; payload: UpdateProgramVideoPayload }) =>
      updateProgramVideo(axiosInstance, videoId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-program-details", String(programId)] });
      toast.success(response.message || "تم تحديث الفيديو بنجاح");
    },
    onError: (error: AxiosError) => {
      toast.error(getMutationErrorMessage(error, "تعذر تحديث الفيديو."));
    },
  });

  return { updateVideo: mutation.mutateAsync, isLoading: mutation.isPending };
}
