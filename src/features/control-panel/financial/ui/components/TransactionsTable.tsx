"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import type { AdminTransaction, AdminTransactionType, TransactionSource } from "../../types";
import { useAdminTransactions } from "../../hooks/useAdminTransactions";

const SKELETON_ROWS = 10;
const TRANSACTION_TYPES: (AdminTransactionType | "all")[] = [
  "all",
  "payment_record",
  "consultation_hold",
  "consultation_credit",
  "platform_fee",
  "refund",
  "dispute_freeze",
  "dispute_release",
  "withdrawal",
];

const entryTypeClass: Record<"credit" | "debit", string> = {
  credit: "bg-emerald-100 text-emerald-700 border-emerald-200",
  debit: "bg-rose-100 text-rose-700 border-rose-200",
};

const sourceClass: Record<TransactionSource, string> = {
  course: "bg-sky-100 text-sky-700 border-sky-200",
  consultation: "bg-violet-100 text-violet-700 border-violet-200",
  withdrawal: "bg-amber-100 text-amber-700 border-amber-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

// Unknown future values fall back to "other" instead of breaking the row.
const resolveSource = (source: string | undefined): TransactionSource =>
  source === "course" || source === "consultation" || source === "withdrawal"
    ? source
    : "other";

function parseAmount(item: AdminTransaction): number {
  const magnitude = Number(item.amount.replace(/[^d.]/g, ""));
  if (Number.isNaN(magnitude)) return 0;
  return item.entry_type === "debit" ? -magnitude : magnitude;
}

function TransactionDetails({ item }: { item: AdminTransaction }) {
  const source = resolveSource(item.source);

  if (source === "course" && item.course) {
    return (
      <>
        <div className="text-xs font-medium text-foreground">{item.course.program_title}</div>
        <div className="text-xs text-muted-foreground">{item.course.patient_name}</div>
      </>
    );
  }

  if (source === "consultation" && item.consultation) {
    return (
      <>
        <div className="text-xs font-medium text-foreground">
          {item.consultation.patient_name} → {item.consultation.consultant_name}
        </div>
        <div className="text-xs text-muted-foreground capitalize">
          #{item.consultation.id} · {item.consultation.type}
        </div>
      </>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}

export function TransactionsTable() {
  const t = useTranslations("controlPanel.financial");
  const [page, setPage] = useState(1);
  const [type, setType] = useState<AdminTransactionType | "all">("all");

  const { items, pagination, isLoading, isFetching, isError } =
    useAdminTransactions(type, page);

  const handleTypeChange = (value: string) => {
    setType(value as AdminTransactionType | "all");
    setPage(1);
  };

  const colCount = 8;

  return (
    <div className="space-y-4">
      {/* Header + type filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-[#32A88D]" />
          <h2 className="font-semibold text-foreground">{t("transactions.title")}</h2>
        </div>

        <Select onValueChange={handleTypeChange} defaultValue="all">
          <SelectTrigger className="w-52 h-8 text-sm">
            <SelectValue placeholder={t("transactions.typeFilter")} />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_TYPES.map((txType) => (
              <SelectItem key={txType} value={txType}>
                {t(`transactions.type.${txType}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colId")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colSource")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colLabel")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colDetails")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colEntry")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colAmount")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colStatus")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("transactions.colDate")}</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`tx-sk-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))}

            {/* Error */}
            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-destructive text-sm">
                  {t("transactions.loadError")}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && !isFetching && !isError && items.length === 0 && (
              <tr>
                <td colSpan={colCount}>
                  <EmptyWalletState
                    title={t("transactions.emptyTitle")}
                    description={t("transactions.emptyDescription")}
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
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full text-xs font-medium",
                        sourceClass[resolveSource(item.source)],
                      )}
                    >
                      {t(`transactions.source.${resolveSource(item.source)}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {item.type.replace(/_/g, " ")}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TransactionDetails item={item} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full text-xs font-medium",
                        entryTypeClass[item.entry_type],
                      )}
                    >
                      {t(`transactions.entryType.${item.entry_type}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {/* amount string carries a +/- prefix (possibly a unicode minus, which
                        parseFloat can't read) — take the magnitude and sign from entry_type. */}
                    <CurrencyAmount
                      amount={parseAmount(item)}
                      currency={item.currency}
                      size="sm"
                      signed
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
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
