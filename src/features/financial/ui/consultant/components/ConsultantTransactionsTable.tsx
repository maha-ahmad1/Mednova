"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { useConsultantTransactions } from "@/features/financial/hooks";
import {
  CurrencyAmount,
  StatusBadge,
  EmptyWalletState,
} from "../../shared";
import { formatDate } from "@/lib/utils/dateUtils";

const TRANSACTIONS_PER_PAGE = 15;
const SKELETON_ROWS = 8;

export function ConsultantTransactionsTable() {
  const [page, setPage] = useState(1);

  const {
    data: txEnvelope,
    isLoading,
    isFetching,
    isError,
  } = useConsultantTransactions(page, TRANSACTIONS_PER_PAGE);

  const transactions = txEnvelope?.data ?? [];
  const pagination = txEnvelope?.pagination;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-[#32A88D]" />
        <h2 className="font-semibold text-foreground">الحركات المالية</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">العملية</th>
              <th className="px-4 py-3 text-right font-medium">الاستشارة</th>
              <th className="px-4 py-3 text-right font-medium">المريض</th>
              <th className="px-4 py-3 text-right font-medium">المبلغ</th>
              <th className="px-4 py-3 text-right font-medium">الحالة</th>
              <th className="px-4 py-3 text-right font-medium">التاريخ</th>
            </tr>
          </thead>

          <tbody>
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`tx-skeleton-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                </tr>
              ))}

            {!isLoading && !isFetching && isError && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-destructive"
                >
                  تعذر تحميل الحركات المالية. حاول مرة أخرى.
                </td>
              </tr>
            )}

            {!isLoading && !isFetching && !isError && transactions.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyWalletState
                    title="لا توجد حركات مالية"
                    description="ستظهر هنا حركاتك المالية عند إجراء أي عمليات"
                  />
                </td>
              </tr>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t align-middle hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{tx.label}</div>
                    {tx.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {tx.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tx.consultation
                      ? tx.consultation.type === "chat"
                        ? "دردشة"
                        : "فيديو"
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tx.consultation?.patient_name ?? "غير مرتبط باستشارة"}
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={tx.amount}
                      currency={tx.currency}
                      signed
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} label={tx.status_label} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(tx.created_at)}
                  </td>
                </tr>
              ))}
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
