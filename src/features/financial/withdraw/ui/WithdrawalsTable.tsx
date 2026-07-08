"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { CurrencyAmount, StatusBadge, EmptyWalletState } from "../../ui/shared";
import { formatDate } from "@/utils/dateUtils";
import { useWithdrawals } from "../hooks/useWithdrawals";
import { CancelWithdrawalDialog } from "./CancelWithdrawalDialog";
import type { WithdrawalStatus, Withdrawal } from "@/features/financial/types";

const PER_PAGE = 15;
const SKELETON_ROWS = 8;

type StatusFilter = WithdrawalStatus | "all";

export function WithdrawalsTable() {
  const t = useTranslations("financial.withdrawals");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-OM" : "en-US";
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [cancelTarget, setCancelTarget] = useState<Withdrawal | null>(null);

  const { data: envelope, isLoading, isFetching, isError } = useWithdrawals(
    page,
    PER_PAGE,
    statusFilter,
  );

  const withdrawals = envelope?.data ?? [];
  const pagination = envelope?.pagination;

  const handleFilterChange = (value: string) => {
    setStatusFilter(value as StatusFilter);
    setPage(1);
  };

  const maskIban = (iban: string) =>
    iban.length > 4 ? `•••• ${iban.slice(-4)}` : iban;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ArrowDownCircle className="h-4 w-4 text-[#32A88D]" />
        <h2 className="font-semibold text-foreground">{t("sectionTitle")}</h2>
      </div>

      <Tabs value={statusFilter} onValueChange={handleFilterChange}>
        <TabsList className="grid w-full grid-cols-4 p-1 bg-gray-50 rounded-xl border-b border-gray-100">
          <TabsTrigger
            value="all"
            className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg py-2"
          >
            {t("filterAll")}
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg py-2"
          >
            {t("filterPending")}
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg py-2"
          >
            {t("filterCompleted")}
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg py-2"
          >
            {t("filterCancelled")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-start font-medium">{t("colId")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("colAmount")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("colBankAccount")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("colStatus")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("colDate")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("colActions")}</th>
            </tr>
          </thead>

          <tbody>
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`wd-skeleton-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-8 w-16 rounded-md" /></td>
                </tr>
              ))}

            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-destructive">
                  {t("loadError")}
                </td>
              </tr>
            )}

            {!isLoading && !isFetching && !isError && withdrawals.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyWalletState
                    title={t("emptyTitle")}
                    description={t("emptyDescription")}
                  />
                </td>
              </tr>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              withdrawals.map((wd) => (
                <tr
                  key={wd.id}
                  className="border-t align-middle hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">#{wd.id}</td>
                  <td className="px-4 py-3">
                    <CurrencyAmount amount={wd.amount} currency={wd.currency} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground text-xs">
                      {wd.bank_account.bank_name}
                    </div>
                    <div className="text-xs text-muted-foreground" dir="ltr">
                      {maskIban(wd.bank_account.iban)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={wd.status} label={wd.status_label} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(wd.created_at, undefined, dateLocale)}
                  </td>
                  <td className="px-4 py-3">
                    {wd.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/40 hover:bg-destructive/5 hover:text-destructive text-xs"
                        onClick={() => setCancelTarget(wd)}
                      >
                        {t("cancelButton")}
                      </Button>
                    )}
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

      {cancelTarget && (
        <CancelWithdrawalDialog
          open={!!cancelTarget}
          onOpenChange={(open) => { if (!open) setCancelTarget(null); }}
          withdrawalId={cancelTarget.id}
          amount={cancelTarget.amount}
          currency={cancelTarget.currency}
        />
      )}
    </div>
  );
}
