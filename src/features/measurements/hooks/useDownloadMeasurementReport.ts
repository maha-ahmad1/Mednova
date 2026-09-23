"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { resolveApiMessage } from "../utils/resolveApiMessage";

type ReportFilters =
  | { patient_id: number; exercise_type?: string; consultation_id?: never; consultation_type?: never }
  | { consultation_id: number; consultation_type: string; exercise_type?: string; patient_id?: never };

export const useDownloadMeasurementReport = () => {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();
  const t = useTranslations();
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (filters: ReportFilters) => {
    if (!filters.patient_id && !(filters.consultation_id && filters.consultation_type)) {
      toast.error(t("measurementSessionResult.downloadMissingFilters"));
      return;
    }

    setIsDownloading(true);
    try {
      const res = await axiosInstance.get("/api/measurements/report/pdf", {
        params: { ...filters, lang: locale },
        responseType: "blob",
      });

      const contentDisposition = res.headers["content-disposition"] as string | undefined;
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] ?? `measurement-report-${Date.now()}.pdf`;

      const blobUrl = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // With responseType: "blob", an error JSON body also arrives as a Blob —
      // parse it back to text so the toast shows the real message instead of "[object Blob]".
      let message = t("measurementSessionResult.downloadFailed");
      if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text) as { message?: string };
          if (parsed?.message) {
            message = resolveApiMessage(parsed.message, t);
          }
        } catch {
          // keep default message
        }
      }
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
};
