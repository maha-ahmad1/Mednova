"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { archiveConsultantProgram } from "../api";

export function useArchiveConsultantProgram(id: number) {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => archiveConsultantProgram(axiosInstance, id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      queryClient.invalidateQueries({ queryKey: ["consultant-program", id] });
      toast.success(response.message || "تمت أرشفة الكورس");
    },
    onError: () => {
      toast.error("تعذر أرشفة الكورس. حاول مرة أخرى.");
    },
  });

  return { archiveProgram: mutation.mutateAsync, isLoading: mutation.isPending };
}
