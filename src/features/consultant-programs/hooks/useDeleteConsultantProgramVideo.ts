"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteConsultantProgramVideo } from "../api";

export function useDeleteConsultantProgramVideo(programId: number) {
  const t = useTranslations("consultantPrograms.toast");
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (videoId: number) =>
      deleteConsultantProgramVideo(axiosInstance, programId, videoId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-program", programId] });
      toast.success(response.message || t("deleteVideoSuccess"));
    },
    onError: () => {
      toast.error(t("deleteVideoError"));
    },
  });

  return { deleteVideo: mutation.mutateAsync, isLoading: mutation.isPending };
}
