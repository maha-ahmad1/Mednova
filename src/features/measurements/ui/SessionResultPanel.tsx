"use client";

import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Download, HelpCircle, Info, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/utils/dateUtils";
import type { ConsultationType } from "@/types/consultation";
import { EXERCISE_TYPES } from "../utils/exerciseTypes";
import { getMeasurementStatusBadgeClass } from "../utils/mapMeasurementStatus";
import { mapMeasurementOutcome } from "../utils/mapSessionOutcome";
import { useDownloadMeasurementReport } from "../hooks/useDownloadMeasurementReport";
import type { AffectedSide, Measurement, MeasurementSessionStatus } from "../types";

interface SessionResultPanelProps {
  measurement: Measurement;
  patientId: number;
  consultationId: number;
  consultationType: ConsultationType;
}

// Outcome keys as produced by mapMeasurementOutcome; "unknown" also covers
// any future/unmapped {status, end_reason} combination.
const OUTCOME_HEADER_KEY: Record<string, string> = {
  completed: "measurementSessionResult.title",
  cancelled_by_doctor: "measurementSessionResult.titleCancelledByDoctor",
  stopped_by_patient: "measurementSessionResult.titleStoppedByPatient",
  pain: "measurementSessionResult.titlePain",
  technical_error: "measurementSessionResult.titleTechnicalError",
  unknown: "measurementSessionResult.titleUnknown",
};

const OUTCOME_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  cancelled_by_doctor: XCircle,
  stopped_by_patient: Info,
  pain: AlertTriangle,
  technical_error: XCircle,
  unknown: HelpCircle,
};

const OUTCOME_ICON_CLASS: Record<string, string> = {
  completed: "text-[#32A88D]",
  // Doctor-initiated cancellation is an expected, intentional action, not a
  // problem state — kept neutral/gray so it doesn't read as alarming.
  cancelled_by_doctor: "text-gray-500",
  stopped_by_patient: "text-blue-600",
  // Clinically relevant — visibly distinct (safety signal), not just another
  // neutral/info outcome.
  pain: "text-red-600",
  technical_error: "text-gray-500",
  unknown: "text-gray-400",
};

// Same distinction as OUTCOME_ICON_CLASS, applied as a border-inline-start
// accent on the outer card so outcomes are distinguishable beyond icon/text
// color alone (audit P0-2). Reuses the exact border-s-* accent pattern
// already used for the selected-item state in ConsultationList.tsx.
const OUTCOME_ACCENT_CLASS: Record<string, string> = {
  completed: "border-s-4 border-s-[#32A88D]",
  cancelled_by_doctor: "border-s-4 border-s-gray-400",
  stopped_by_patient: "border-s-4 border-s-blue-400",
  pain: "border-s-4 border-s-red-400",
  technical_error: "border-s-4 border-s-gray-400",
  unknown: "border-s-4 border-s-gray-300",
};

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
  consultationId,
  consultationType,
}: SessionResultPanelProps) {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-OM" : "en-US";
  const { download, isDownloading } = useDownloadMeasurementReport();

  const exerciseTypeConfig = EXERCISE_TYPES.find(
    (entry) => entry.value === measurement.exercise_type,
  );
  const exerciseLabel = exerciseTypeConfig
    ? t(`measurements.exerciseTypes.${exerciseTypeConfig.labelKey}`)
    : measurement.exercise_type;

  const affectedSideLabel = t(
    `measurements.affectedSideOptions.${measurement.affected_side as AffectedSide}`,
  );

  // measurement.status only reaches this panel as completed/abandoned/cancelled
  // (pending/in_progress are routed to MeasurementStatusCard by MeasurementSection).
  const outcome = mapMeasurementOutcome(
    measurement.status as MeasurementSessionStatus,
    measurement.end_reason ?? "unknown",
  );
  const hasPartialData = (measurement.reps_completed ?? 0) > 0;

  // completed shows the full metrics/ROM/download set; the other outcomes show
  // them only when reps were actually recorded; unknown never shows result
  // data, per the outcome table this panel implements.
  const showResultsData = outcome.key === "completed" || hasPartialData;
  const showRomBar = outcome.key === "completed";

  const OutcomeIcon = OUTCOME_ICON[outcome.key] ?? HelpCircle;

  const handleDownloadReport = () => {
    // A consultation-scoped report returns every measurement for this
    // consultation, not just the one shown here — expected if a single
    // bridge session covers more than one exercise, not a bug.
    download({ consultation_id: consultationId, consultation_type: consultationType });
  };

  return (
    <Card
      className={`bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg mt-4 sm:mt-6 ${OUTCOME_ACCENT_CLASS[outcome.key] ?? OUTCOME_ACCENT_CLASS.unknown}`}
    >
      <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <OutcomeIcon className={`w-5 h-5 shrink-0 ${OUTCOME_ICON_CLASS[outcome.key] ?? OUTCOME_ICON_CLASS.unknown}`} />
          <div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {t(OUTCOME_HEADER_KEY[outcome.key] ?? OUTCOME_HEADER_KEY.unknown)}
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

        {showResultsData && (
          <div className="flex gap-3">
            <MetricTile
              label={t("measurementSessionResult.reps")}
              value={measurement.reps_completed !== null ? String(measurement.reps_completed) : "—"}
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
        )}

        {showRomBar && (
          <ProgressMetric
            label={t("measurementSessionResult.romAchieved")}
            value={measurement.measured_rom ?? 0}
            target={measurement.target_rom}
            unit="°"
          />
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
          {showResultsData && (
            <Button
              type="button"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="cursor-pointer flex-1 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {t("measurementSessionResult.downloadReport")}
            </Button>
          )}
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
