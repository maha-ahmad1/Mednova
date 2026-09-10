"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";
import { EXERCISE_TYPES } from "../utils/exerciseTypes";
import { getMeasurementStatusBadgeClass } from "../utils/mapMeasurementStatus";
import type { AffectedSide, Measurement } from "../types";

interface MeasurementResultCardProps {
  measurement: Measurement;
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

const formatDurationLabel = (startedAt: string, completedAt: string): string => {
  const seconds = Math.max(
    0,
    Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000),
  );
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

export default function MeasurementResultCard({
  measurement,
}: MeasurementResultCardProps) {
  const t = useTranslations();
  const locale = useLocale();
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
  const showProgress =
    measurement.status === "completed" ||
    (measurement.status === "abandoned" && hasResultData);
  const showExplanation =
    measurement.status === "cancelled" ||
    (measurement.status === "abandoned" && !hasResultData);

  const endReasonLabel =
    measurement.end_reason && KNOWN_END_REASONS.has(measurement.end_reason)
      ? t(`measurements.endReasons.${measurement.end_reason}`)
      : t("measurements.endReasons.unknown");

  const durationLabel =
    measurement.started_at && measurement.completed_at
      ? formatDurationLabel(measurement.started_at, measurement.completed_at)
      : null;

  return (
    <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg mt-4 sm:mt-6">
      <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {exerciseLabel}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">{affectedSideLabel}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs border shrink-0 ${getMeasurementStatusBadgeClass(measurement.status)}`}
          >
            {measurement.status_label}
          </Badge>
        </div>

        {showProgress && (
          <div className="flex flex-col gap-3">
            <ProgressMetric
              label={t("measurements.romLabel")}
              value={measurement.measured_rom ?? 0}
              target={measurement.target_rom}
              unit="°"
            />
            <ProgressMetric
              label={t("measurements.repsLabel")}
              value={measurement.reps_completed ?? 0}
              target={measurement.target_reps}
              unit=""
            />
          </div>
        )}

        {showExplanation && (
          <p className="text-xs sm:text-sm text-muted-foreground">{endReasonLabel}</p>
        )}

        {(measurement.accuracy_percentage !== null || durationLabel !== null) && (
          <div className="flex gap-3">
            {measurement.accuracy_percentage !== null && (
              <MetricTile
                label={t("measurements.accuracyLabel")}
                value={`${measurement.accuracy_percentage}%`}
              />
            )}
            {durationLabel !== null && (
              <MetricTile
                label={t("measurements.resultDurationLabel")}
                value={durationLabel}
              />
            )}
          </div>
        )}

        {measurement.completed_at && (
          <p className="text-xs text-gray-400 text-end">
            {formatDate(
              measurement.completed_at,
              { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
              dateLocale,
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
