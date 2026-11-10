"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { updateConsultantProgramVideo } from "../api";
import type { ConsultantProgramVideoPayload } from "../types/consultant-program";

export function useUpdateConsultantProgramVideo(programId: number) {
  const t = useTranslations("consultantPrograms.toast");
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      videoId,
      payload,
    }: {
      videoId: number;
      payload: Omit<ConsultantProgramVideoPayload, "video"> & { video?: File };
    }) => updateConsultantProgramVideo(axiosInstance, { programId, videoId, payload }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-program", programId] });
      toast.success(response.message || t("updateVideoSuccess"));
    },
    onError: () => {
      toast.error(t("updateVideoError"));
    },
  });

  return { updateVideo: mutation.mutateAsync, isLoading: mutation.isPending };
}
