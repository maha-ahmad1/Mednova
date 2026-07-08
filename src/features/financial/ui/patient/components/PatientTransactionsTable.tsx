"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { usePatientTransactions } from "@/features/financial/hooks";
import { CurrencyAmount, StatusBadge, EmptyWalletState } from "../../shared";
import { formatDate } from "@/utils/dateUtils";

const PER_PAGE = 15;
const SKELETON_ROWS = 8;

export function PatientTransactionsTable() {
  const t = useTranslations("financial");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-OM" : "en-US";
  const [page, setPage] = useState(1);

  const {
    data: envelope,
    isLoading,
    isFetching,
    isError,
  } = usePatientTransactions(page, PER_PAGE);

  const transactions = envelope?.data ?? [];
  const pagination = envelope?.pagination;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-start font-medium">{t("patientTransactions.colOperation")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("patientTransactions.colConsultation")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("patientTransactions.colAmount")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("patientTransactions.colStatus")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("patientTransactions.colDate")}</th>
            </tr>
          </thead>

          <tbody>
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`ptx-skeleton-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                </tr>
              ))}

            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-destructive">
                  {t("patientTransactions.loadError")}
                </td>
              </tr>
            )}

            {!isLoading && !isFetching && !isError && transactions.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyWalletState
                    title={t("patientTransactions.emptyTitle")}
                    description={t("patientTransactions.emptyDescription")}
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
                        ? t("shared.consultationType.chat")
                        : t("shared.consultationType.video")
                      : t("patientTransactions.notLinked")}
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
                    {formatDate(tx.created_at, undefined, dateLocale)}
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
