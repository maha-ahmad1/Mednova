"use client";

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
  /** Replaces the "page X of Y • total" text. Defaults to the Arabic wording. */
  formatSummary?: (info: PaginationSummaryInfo) => string;
}

const defaultSummary = ({ currentPage, lastPage, total }: PaginationSummaryInfo) =>
  `الصفحة ${currentPage} من ${lastPage}${typeof total === "number" ? ` • إجمالي ${total}` : ""}`;

export function PaginationControls({
  currentPage,
  lastPage,
  total,
  onPageChange,
  isLoading = false,
  prevLabel = "السابق",
  nextLabel = "التالي",
  formatSummary = defaultSummary,
}: PaginationControlsProps) {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-white p-3">
      <p className="text-sm text-muted-foreground">
        {formatSummary({ currentPage, lastPage, total })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isLoading || currentPage <= 1}
        >
          {prevLabel}
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLoading || currentPage >= lastPage}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
