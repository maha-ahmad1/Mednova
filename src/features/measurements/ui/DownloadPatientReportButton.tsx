"use client";

import { useTranslations } from "next-intl";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadMeasurementReport } from "../hooks/useDownloadMeasurementReport";

interface DownloadPatientReportButtonProps {
  patientId: number;
}

export default function DownloadPatientReportButton({
  patientId,
}: DownloadPatientReportButtonProps) {
  const t = useTranslations();
  const { download, isDownloading } = useDownloadMeasurementReport();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isDownloading}
      onClick={() => download({ patient_id: patientId })}
      className="cursor-pointer border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 flex items-center gap-2 shrink-0"
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {t("measurements.history.downloadFullReport")}
    </Button>
  );
}
