"use client";

import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/utils/dateUtils";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { EXERCISE_TYPES } from "../utils/exerciseTypes";
import { getMeasurementStatusBadgeClass } from "../utils/mapMeasurementStatus";
import { downloadMeasurementReport } from "../api/measurementApi";
import type { AffectedSide, Measurement } from "../types";

interface SessionResultPanelProps {
  measurement: Measurement;
  patientId: number;
}

const KNOWN_END_REASONS = new Set([
  "completed",
  "stopped_by_therapist",
  "stopped_by_patient",
  "pain",
  "disconnected",
  "timeout",
  "technical_error",
  "cancelled_by_doctor",
]);

function ProgressMetric({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  const percentage = target > 0 ? Math.min(100, Math.max(0, (value / target) * 100)) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">
          {value}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#32A88D]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm text-center">
      <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-800 text-sm sm:text-base">{value}</p>
    </div>
  );
}

export default function SessionResultPanel({
  measurement,
  patientId,
}: SessionResultPanelProps) {
  const t = useTranslations();
  const locale = useLocale();
  const axios = useAxiosInstance();
  const dateLocale = locale === "ar" ? "ar-OM" : "en-US";

  const exerciseTypeConfig = EXERCISE_TYPES.find(
    (entry) => entry.value === measurement.exercise_type,
  );
  const exerciseLabel = exerciseTypeConfig
    ? t(`measurements.exerciseTypes.${exerciseTypeConfig.labelKey}`)
    : measurement.exercise_type;

  const affectedSideLabel = t(
    `measurements.affectedSideOptions.${measurement.affected_side as AffectedSide}`,
  );

  const hasResultData =
    measurement.measured_rom !== null && measurement.reps_completed !== null;
  const showMetrics =
    measurement.status === "completed" ||
    (measurement.status === "abandoned" && hasResultData);
  const showExplanation =
    measurement.status === "cancelled" ||
    (measurement.status === "abandoned" && !hasResultData);

  const endReasonLabel =
    measurement.end_reason && KNOWN_END_REASONS.has(measurement.end_reason)
      ? t(`measurements.endReasons.${measurement.end_reason}`)
      : t("measurements.endReasons.unknown");

  const handleDownloadReport = async () => {
    try {
      const blob = await downloadMeasurementReport(axios, measurement.measurement_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `measurement-report-${measurement.measurement_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // TODO: depends on the backend endpoint GET /api/measurements/{id}/report, which
      // does not exist yet — this will 404 until the backend team ships it.
      toast.error(t("measurementSessionResult.downloadFailed"));
    }
  };

  return (
    <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg mt-4 sm:mt-6">
      <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
        {measurement.status === "completed" && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#32A88D] shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {t("measurementSessionResult.title")}
              </p>
              {measurement.completed_at && (
                <p className="text-xs text-gray-500">
                  {formatDate(
                    measurement.completed_at,
                    { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
                    dateLocale,
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {exerciseLabel}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {t("measurementSessionResult.affectedSide")}: {affectedSideLabel}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs border shrink-0 ${getMeasurementStatusBadgeClass(measurement.status)}`}
          >
            {measurement.status_label}
          </Badge>
        </div>

        {showMetrics && (
          <>
            <div className="flex gap-3">
              <MetricTile
                label={t("measurementSessionResult.reps")}
                value={String(measurement.reps_completed ?? 0)}
              />
              <MetricTile
                label={t("measurementSessionResult.accuracy")}
                value={
                  measurement.accuracy_percentage !== null
                    ? `${measurement.accuracy_percentage}%`
                    : "-"
                }
              />
            </div>

            <ProgressMetric
              label={t("measurementSessionResult.romAchieved")}
              value={measurement.measured_rom ?? 0}
              target={measurement.target_rom}
              unit="°"
            />
          </>
        )}

        {showExplanation && (
          <p className="text-xs sm:text-sm text-muted-foreground">{endReasonLabel}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button
            asChild
            variant="outline"
            className="cursor-pointer flex-1 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10"
          >
            <Link
              href={`/profile/consultations/patients/${patientId}/measurements`}
            >
              {t("measurementSessionResult.viewFullHistory")}
            </Link>
          </Button>
          <Button
            type="button"
            onClick={handleDownloadReport}
            className="cursor-pointer flex-1 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t("measurementSessionResult.downloadReport")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SessionResultPanelSkeleton() {
  const t = useTranslations();

  return (
    <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg mt-4 sm:mt-6">
      <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
        <p className="text-xs text-gray-400">
          {t("measurementSessionResult.waitingForResults")}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-16 flex-1 rounded-lg sm:rounded-xl" />
          <Skeleton className="h-16 flex-1 rounded-lg sm:rounded-xl" />
        </div>

        <Skeleton className="h-8 w-full rounded-full" />

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Skeleton className="h-10 flex-1 rounded-lg sm:rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-lg sm:rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
