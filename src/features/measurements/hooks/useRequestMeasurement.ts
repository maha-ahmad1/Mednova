"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { requestMeasurement } from "../api/measurementApi";
import type { Measurement, RequestMeasurementPayload } from "../types";

export const useRequestMeasurement = (
  type: "video" | "chat",
  consultationId: number,
  onSuccess?: (measurement: Measurement) => void,
) => {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (payload: RequestMeasurementPayload) =>
      requestMeasurement(axiosInstance, type, consultationId, payload, locale),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["measurement", type, consultationId, "latest"],
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: ["measurements", type, consultationId],
      });
      toast.success(t("measurements.requestSuccess"));
      onSuccess?.(response.data);
    },
  });
};
