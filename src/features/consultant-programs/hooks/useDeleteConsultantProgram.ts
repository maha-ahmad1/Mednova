"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteConsultantProgram } from "../api";

export function useDeleteConsultantProgram() {
  const t = useTranslations("consultantPrograms.toast");
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteConsultantProgram(axiosInstance, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      toast.success(t("deleteSuccess"));
    },
    onError: () => {
      toast.error(t("deleteError"));
    },
  });
}
