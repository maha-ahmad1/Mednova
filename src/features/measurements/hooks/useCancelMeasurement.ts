"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { cancelMeasurement } from "../api/measurementApi";
import { resolveApiMessage } from "../utils/resolveApiMessage";

export const useCancelMeasurement = (
  type: "video" | "chat",
  consultationId: number,
) => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (measurementId: string) =>
      cancelMeasurement(axiosInstance, type, consultationId, measurementId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["measurements", type, consultationId],
      });
      toast.success(t("measurements.cancelSuccess"));
    },
    onError: (error) => {
      if (!axios.isAxiosError(error)) {
        toast.error(t("measurements.apiMessages.ERROR_OCCURRED"));
        return;
      }
      const message = error.response?.data?.message ?? "";
      toast.error(resolveApiMessage(message, t));
    },
  });
};
