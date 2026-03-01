"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  total?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function PaginationControls({
  currentPage,
  lastPage,
  total,
  onPageChange,
  isLoading = false,
}: PaginationControlsProps) {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-white p-3">
      <p className="text-sm text-muted-foreground">
        الصفحة {currentPage} من {lastPage}
        {typeof total === "number" ? ` • إجمالي ${total}` : ""}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isLoading || currentPage <= 1}
        >
          السابق
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLoading || currentPage >= lastPage}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
