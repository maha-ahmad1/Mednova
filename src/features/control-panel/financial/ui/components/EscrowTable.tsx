"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { CurrencyAmount } from "@/features/financial/ui/shared/CurrencyAmount";
import { EmptyWalletState } from "@/features/financial/ui/shared/EmptyWalletState";
import { formatDate } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import type { EscrowStatusFilter, EscrowFinancialStatus } from "../../types";
import { useAdminEscrow } from "../../hooks/useAdminEscrow";

const SKELETON_ROWS = 8;

const escrowStatusClass: Record<EscrowFinancialStatus, string> = {
  held: "bg-amber-100 text-amber-700 border-amber-200",
  review_window: "bg-sky-100 text-sky-700 border-sky-200",
};

const TAB_CLASS =
  "text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg py-2";

export function EscrowTable() {
  const t = useTranslations("controlPanel.financial");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EscrowStatusFilter>("all");

  const { items, summary, pagination, isLoading, isFetching, isError } =
    useAdminEscrow(status, page);

  const handleStatusChange = (value: string) => {
    setStatus(value as EscrowStatusFilter);
    setPage(1);
  };

  const colCount = 7;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#32A88D]" />
        <h2 className="font-semibold text-foreground">{t("escrow.title")}</h2>
      </div>

      {/* Status filter tabs */}
      <Tabs value={status} onValueChange={handleStatusChange}>
        <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-50 rounded-xl border-b border-gray-100">
          <TabsTrigger value="all" className={TAB_CLASS}>
            {t("escrow.statusAll")}
          </TabsTrigger>
          <TabsTrigger value="held" className={TAB_CLASS}>
            {t("escrow.statusHeld")}
          </TabsTrigger>
          <TabsTrigger value="review_window" className={TAB_CLASS}>
            {t("escrow.statusReview")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary strip */}
      {summary && !isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border bg-amber-50/60 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">{t("escrow.summaryHeld")}</p>
            <CurrencyAmount
              amount={parseFloat(summary.total_held_amount)}
              size="sm"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {summary.count_held} {t("escrow.entries")}
            </p>
          </div>
          <div className="rounded-xl border bg-sky-50/60 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">{t("escrow.summaryReview")}</p>
            <CurrencyAmount
              amount={parseFloat(summary.total_review_amount)}
              size="sm"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {summary.count_review} {t("escrow.entries")}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/40 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">{t("escrow.summaryTotal")}</p>
            <CurrencyAmount
              amount={parseFloat(summary.total_escrow)}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colId")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colType")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colPatient")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colConsultant")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colAmount")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colStatus")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("escrow.colDate")}</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`esc-sk-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-12 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))}

            {/* Error */}
            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-destructive text-sm">
                  {t("escrow.loadError")}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && !isFetching && !isError && items.length === 0 && (
              <tr>
                <td colSpan={colCount}>
                  <EmptyWalletState
                    title={t("escrow.emptyTitle")}
                    description={t("escrow.emptyDescription")}
                  />
                </td>
              </tr>
            )}

            {/* Rows */}
            {!isLoading &&
              !isFetching &&
              !isError &&
              items.map((item) => (
                <tr
                  key={item.consultation_id}
                  className="border-t align-middle hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    #{item.consultation_id}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs capitalize border-border/60"
                    >
                      {item.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">{item.patient_name}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{item.consultant_name}</td>
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={parseFloat(item.amount)}
                      currency={item.currency}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full font-medium",
                          escrowStatusClass[item.financial_status],
                        )}
                      >
                        {item.status_label}
                      </Badge>
                      {item.time_remaining && (
                        <p className="text-xs text-muted-foreground">
                          {item.time_remaining}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(item.paid_at)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <PaginationControls
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          onPageChange={setPage}
          isLoading={isLoading || isFetching}
        />
      )}
    </div>
  );
}
