"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ReceiptText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { CurrencyAmount } from "@/features/financial/ui/shared/CurrencyAmount";
import { EmptyWalletState } from "@/features/financial/ui/shared/EmptyWalletState";
import { formatDate } from "@/utils/dateUtils";
import { useAdminRevenue } from "../../hooks/useAdminRevenue";

const SKELETON_ROWS = 8;

/** Generate last 13 months in YYYY-MM format (current month first). */
function buildMonthOptions(): { label: string; value: string }[] {
  const now = new Date();
  return Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("ar-OM", { year: "numeric", month: "long" });
    return { value, label };
  });
}

export function RevenueTable() {
  const t = useTranslations("controlPanel.financial");
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState<string | undefined>(undefined);

  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const { items, summary, pagination, isLoading, isFetching, isError } =
    useAdminRevenue(month, page);

  const handleMonthChange = (value: string) => {
    setMonth(value === "all" ? undefined : value);
    setPage(1);
  };

  const colCount = 6;

  return (
    <div className="space-y-4">
      {/* Header + filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-[#32A88D]" />
          <h2 className="font-semibold text-foreground">{t("revenue.title")}</h2>
          {summary && (
            <span className="text-xs text-muted-foreground">
              ({summary.total_count} {t("revenue.entries")})
            </span>
          )}
        </div>

        <Select onValueChange={handleMonthChange} defaultValue="all">
          <SelectTrigger className="w-44 h-8 text-sm">
            <SelectValue placeholder={t("revenue.monthFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("revenue.allMonths")}</SelectItem>
            {monthOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary strip */}
      {summary && !isLoading && (
        <div className="flex items-center gap-2 rounded-xl border bg-emerald-50/60 px-4 py-2.5">
          <span className="text-xs text-muted-foreground">{t("revenue.totalRevenue")}:</span>
          <CurrencyAmount
            amount={parseFloat(summary.total_revenue)}
            currency={summary.currency}
            size="sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">{t("revenue.colId")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("revenue.colConsultation")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("revenue.colPrice")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("revenue.colCommission")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("revenue.colConsultantEarning")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("revenue.colDate")}</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading rows */}
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`rev-sk-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))}

            {/* Error */}
            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-destructive text-sm">
                  {t("revenue.loadError")}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && !isFetching && !isError && items.length === 0 && (
              <tr>
                <td colSpan={colCount}>
                  <EmptyWalletState
                    title={t("revenue.emptyTitle")}
                    description={t("revenue.emptyDescription")}
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
                  key={item.id}
                  className="border-t align-middle hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">#{item.id}</td>
                  <td className="px-4 py-3">
                    {item.consultation ? (
                      <>
                        <div className="text-xs font-medium text-foreground">
                          {item.consultation.patient_name} → {item.consultation.consultant_name}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {item.consultation.type}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={parseFloat(item.consultation_price)}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-foreground">
                      <CurrencyAmount
                        amount={parseFloat(item.platform_commission_amount)}
                        size="sm"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.platform_commission_rate}%
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={parseFloat(item.consultant_earning_amount)}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(item.created_at)}
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
