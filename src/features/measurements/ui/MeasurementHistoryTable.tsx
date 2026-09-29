"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { formatDate } from "@/utils/dateUtils";
import { usePatientMeasurementHistory } from "../hooks/usePatientMeasurementHistory";
import { useDownloadMeasurementReport } from "../hooks/useDownloadMeasurementReport";
import { getMeasurementStatusBadgeClass } from "../utils/mapMeasurementStatus";
import { EXERCISE_TYPES } from "../utils/exerciseTypes";
import type { AffectedSide, Measurement } from "../types";

interface MeasurementHistoryTableProps {
  patientId: number;
}

const SKELETON_ROWS = 6;
const EM_DASH = "—";

// One hook instance per row so each row's `isDownloading` is independent —
// otherwise clicking one row's download would spin every row's button.
function MeasurementRowDownloadButton({ measurementId }: { measurementId: string }) {
  const t = useTranslations();
  const { download, isDownloading } = useDownloadMeasurementReport();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      disabled={isDownloading}
      onClick={() => download({ measurement_id: measurementId })}
      aria-label={t("measurements.history.downloadReport")}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  );
}

export default function MeasurementHistoryTable({
  patientId,
}: MeasurementHistoryTableProps) {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-OM" : "en-US";
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = usePatientMeasurementHistory(
    patientId,
    page,
  );

  const measurements = data?.data ?? [];
  const pagination = data?.pagination;

  const exerciseLabel = (measurement: Measurement) => {
    const config = EXERCISE_TYPES.find(
      (entry) => entry.value === measurement.exercise_type,
    );
    return config
      ? t(`measurements.exerciseTypes.${config.labelKey}`)
      : measurement.exercise_type;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colDate")}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colExercise")}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colSide")}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colStatus")}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colRom")}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colAccuracy")}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t("measurements.history.colActions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`measurement-skeleton-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-14" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </td>
                </tr>
              ))}

            {!isLoading && isError && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-destructive">
                  {t("measurements.history.loadError")}
                </td>
              </tr>
            )}

            {!isLoading && !isError && measurements.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {t("measurements.history.emptyTitle")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("measurements.history.emptyDescription")}
                  </p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              measurements.map((measurement) => {
                const dateValue = measurement.completed_at ?? measurement.created_at;
                const hasRom = measurement.measured_rom !== null;
                const hasAccuracy = measurement.accuracy_percentage !== null;

                return (
                  <tr
                    key={measurement.measurement_id}
                    className="border-t align-middle hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(
                        dateValue,
                        { year: "numeric", month: "short", day: "numeric" },
                        dateLocale,
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {exerciseLabel(measurement)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t(
                        `measurements.affectedSideOptions.${measurement.affected_side as AffectedSide}`,
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border shrink-0 ${getMeasurementStatusBadgeClass(measurement.status)}`}
                      >
                        {measurement.status_label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {hasRom
                        ? `${measurement.measured_rom}° / ${measurement.target_rom}°`
                        : EM_DASH}
                    </td>
                    <td className="px-4 py-3">
                      {hasAccuracy ? `${measurement.accuracy_percentage}%` : EM_DASH}
                    </td>
                    <td className="px-4 py-3">
                      <MeasurementRowDownloadButton
                        measurementId={measurement.measurement_id}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={pagination?.current_page ?? page}
        lastPage={pagination?.last_page ?? 1}
        total={pagination?.total}
        isLoading={isLoading || isFetching}
        onPageChange={(nextPage) => {
          if (nextPage < 1 || nextPage > (pagination?.last_page ?? 1)) return;
          setPage(nextPage);
        }}
      />
    </div>
  );
}
