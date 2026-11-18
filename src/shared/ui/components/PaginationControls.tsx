"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface PaginationSummaryInfo {
  currentPage: number;
  lastPage: number;
  total?: number;
}

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  total?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  /** Replaces the "page X of Y • total" text. Defaults to the localized wording. */
  formatSummary?: (info: PaginationSummaryInfo) => string;
}

export function PaginationControls({
  currentPage,
  lastPage,
  total,
  onPageChange,
  isLoading = false,
  prevLabel,
  nextLabel,
  formatSummary,
}: PaginationControlsProps) {
  const t = useTranslations("common.pagination");
  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-white p-3">
      <p className="text-sm text-muted-foreground">
        {formatSummary
          ? formatSummary({ currentPage, lastPage, total })
          : typeof total === "number"
            ? t("summaryTotal", { current: currentPage, last: lastPage, total })
            : t("summary", { current: currentPage, last: lastPage })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isLoading || currentPage <= 1}
        >
          {prevLabel ?? t("previous")}
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLoading || currentPage >= lastPage}
        >
          {nextLabel ?? t("next")}
        </Button>
      </div>
    </div>
  );
}
