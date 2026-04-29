"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { usePatientPayments } from "@/features/financial/hooks";
import { CurrencyAmount, StatusBadge, EmptyWalletState } from "../../shared";
import { formatDate } from "@/lib/utils/dateUtils";

const PER_PAGE = 15;
const SKELETON_ROWS = 8;

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "ماستركارد",
  apple_pay: "Apple Pay",
  th: "ثواني",
  mada: "مدى",
};

function resolvePaymentMethod(method: string): string {
  return PAYMENT_METHOD_LABELS[method.toLowerCase()] ?? method;
}

export function PatientPaymentsTable() {
  const [page, setPage] = useState(1);

  const {
    data: envelope,
    isLoading,
    isFetching,
    isError,
  } = usePatientPayments(page, PER_PAGE);

  const payments = envelope?.data ?? [];
  const pagination = envelope?.pagination;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">الاستشارة</th>
              <th className="px-4 py-3 text-right font-medium">المستشار</th>
              <th className="px-4 py-3 text-right font-medium">المبلغ المدفوع</th>
              <th className="px-4 py-3 text-right font-medium">رسوم الدفع</th>
              <th className="px-4 py-3 text-right font-medium">طريقة الدفع</th>
              <th className="px-4 py-3 text-right font-medium">الحالة</th>
              <th className="px-4 py-3 text-right font-medium">الاسترجاع</th>
              <th className="px-4 py-3 text-right font-medium">التاريخ</th>
            </tr>
          </thead>

          <tbody>
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`pay-skeleton-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                </tr>
              ))}

            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-destructive">
                  تعذر تحميل المدفوعات. حاول مرة أخرى.
                </td>
              </tr>
            )}

            {!isLoading && !isFetching && !isError && payments.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyWalletState
                    title="لا توجد مدفوعات"
                    description="ستظهر هنا مدفوعاتك عند إتمام أي استشارة"
                  />
                </td>
              </tr>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              payments.map((pay) => (
                <tr
                  key={pay.id}
                  className="border-t align-middle hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {pay.consultation.type === "chat" ? "دردشة" : "فيديو"}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {pay.consultation.consultant_name}
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount amount={pay.amount_paid} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount amount={pay.gateway_fee} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {resolvePaymentMethod(pay.payment_method)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pay.status} label={pay.status_label} />
                  </td>
                  <td className="px-4 py-3">
                    {pay.is_refunded ? (
                      <CurrencyAmount
                        amount={pay.refunded_amount}
                        size="sm"
                        className="text-sky-600"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(pay.created_at)}
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
