"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { addProgramVideos } from "../api/createProgram.api";
import type { AddProgramVideosPayload } from "../types/create-program";
import { getMutationErrorMessage } from "./useMutationErrorMessage";

export function useAddProgramVideos(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddProgramVideosPayload) => addProgramVideos(axiosInstance, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["control-panel-program-details", String(programId)] });
      toast.success(response.message || "تمت إضافة الفيديوهات بنجاح");
    },
    onError: (error: AxiosError) => {
      toast.error(getMutationErrorMessage(error, "تعذر إضافة الفيديوهات."));
    },
  });

  return { addVideos: mutation.mutateAsync, isLoading: mutation.isPending };
}
