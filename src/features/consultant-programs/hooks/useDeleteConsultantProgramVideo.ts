"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteConsultantProgramVideo } from "../api";

export function useDeleteConsultantProgramVideo(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (videoId: number) =>
      deleteConsultantProgramVideo(axiosInstance, programId, videoId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-program", programId] });
      toast.success(response.message || "تم حذف الفيديو بنجاح");
    },
    onError: () => {
      toast.error("تعذر حذف الفيديو. حاول مرة أخرى.");
    },
  });

  return { deleteVideo: mutation.mutateAsync, isLoading: mutation.isPending };
}
