"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteProgramVideo } from "../api/createProgram.api";
import { getMutationErrorMessage } from "./useMutationErrorMessage";

export function useDeleteProgramVideo(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (videoId: number) => deleteProgramVideo(axiosInstance, videoId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-program-details", String(programId)] });
      toast.success(response.message || "تم حذف الفيديو بنجاح");
    },
    onError: (error: AxiosError) => {
      toast.error(getMutationErrorMessage(error, "تعذر حذف الفيديو."));
    },
  });

  return { deleteVideo: mutation.mutateAsync, isLoading: mutation.isPending };
}
