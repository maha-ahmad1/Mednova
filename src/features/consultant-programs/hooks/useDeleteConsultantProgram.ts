"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { deleteConsultantProgram } from "../api";

export function useDeleteConsultantProgram() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteConsultantProgram(axiosInstance, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
      toast.success("تم حذف الكورس بنجاح");
    },
    onError: () => {
      toast.error("تعذر حذف الكورس. حاول مرة أخرى.");
    },
  });
}
