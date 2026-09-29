"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { addConsultantProgramVideo } from "../api";
import type { ConsultantProgramVideoPayload } from "../types/consultant-program";

/**
 * Tracks upload progress per temp id since more than one video may be
 * uploading for the same program at once.
 */
export function useAddConsultantProgramVideo(programId: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const [progressByTempId, setProgressByTempId] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: ({
      tempId,
      payload,
    }: {
      tempId: string;
      payload: ConsultantProgramVideoPayload;
    }) =>
      addConsultantProgramVideo(axiosInstance, {
        programId,
        payload,
        onUploadProgress: ({ loaded, total }) => {
          const percent = total ? Math.round((loaded / total) * 100) : 0;
          setProgressByTempId((prev) => ({ ...prev, [tempId]: percent }));
        },
      }),
    onSuccess: (response, { tempId }) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      queryClient.invalidateQueries({ queryKey: ["consultant-program", programId] });
      toast.success(response.message || "تمت إضافة الفيديو بنجاح");
      setProgressByTempId((prev) => {
        const { [tempId]: _removed, ...rest } = prev;
        return rest;
      });
    },
    onError: (_error, { tempId }) => {
      toast.error("تعذر رفع الفيديو. حاول مرة أخرى.");
      setProgressByTempId((prev) => {
        const { [tempId]: _removed, ...rest } = prev;
        return rest;
      });
    },
  });

  const addVideo = useCallback(
    (tempId: string, payload: ConsultantProgramVideoPayload) =>
      mutation.mutateAsync({ tempId, payload }),
    [mutation],
  );

  const isUploading = Object.keys(progressByTempId).length > 0;

  return { addVideo, progressByTempId, isUploading };
}
