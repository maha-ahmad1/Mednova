"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Banknote, Download, Eye, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { downloadAdminWithdrawalProof } from "../../api/adminFinancial.api";
import type { AdminWithdrawalStatusFilter } from "../../types";
import { useAdminWithdrawals } from "../../hooks/useAdminWithdrawals";
import { WithdrawalStatusBadge } from "./WithdrawalStatusBadge";
import { WithdrawalDetailsDialog } from "./WithdrawalDetailsDialog";
import { ProcessWithdrawalDialog } from "./ProcessWithdrawalDialog";

const SKELETON_ROWS = 10;

const STATUS_OPTIONS: AdminWithdrawalStatusFilter[] = [
  "pending_review",
  "approved",
  "rejected",
  "all",
];

export function WithdrawalsTable() {
  const t = useTranslations("controlPanel.financial.withdrawals");
  const axiosInstance = useAxiosInstance();

  // ── Filters & pagination ──────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdminWithdrawalStatusFilter>("pending_review");

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string | null>(null);

  const { items, pagination, isLoading, isFetching, isError } =
    useAdminWithdrawals(status, page);

  const handleStatusChange = (value: string) => {
    setStatus(value as AdminWithdrawalStatusFilter);
    setPage(1);
  };

  // ── Download proof inline ─────────────────────────────────────────────────
  const handleDownload = async (id: string) => {
    try {
      const blob = await downloadAdminWithdrawalProof(axiosInstance, id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `withdrawal-proof-${id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("تعذر تحميل إثبات التحويل.");
    }
  };

  const COL_COUNT = 8;

  return (
    <div className="space-y-4">
      {/* ── Header + status filter ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Banknote className="h-4 w-4 text-[#32A88D]" />
          <h2 className="font-semibold text-foreground">{t("title")}</h2>
        </div>

        <Select onValueChange={handleStatusChange} defaultValue="pending_review">
          <SelectTrigger className="w-52 h-8 text-sm">
            <SelectValue placeholder={t("statusFilter.pending_review")} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`statusFilter.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">{t("colId")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colUser")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colUserType")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colAmount")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colStatus")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colBank")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colDate")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("colActions")}</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={`wd-sk-${i}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-7 w-20 rounded-md" /></td>
                </tr>
              ))}

            {/* Error */}
            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={COL_COUNT} className="px-4 py-10 text-center text-destructive text-sm">
                  {t("loadError")}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && !isFetching && !isError && items.length === 0 && (
              <tr>
                <td colSpan={COL_COUNT}>
                  <EmptyWalletState
                    title={t("emptyTitle")}
                    description={t("emptyDescription")}
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
                  {/* ID */}
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    #{item.id}
                  </td>

                  {/* User */}
                  <td className="px-4 py-3 text-xs font-medium text-foreground">
                    {item.user_name}
                  </td>

                  {/* User type */}
                  <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                    {item.user_type}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={parseFloat(item.amount)}
                      currency={item.currency}
                      size="sm"
                    />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <WithdrawalStatusBadge
                      status={item.status}
                      label={item.status_label}
                    />
                  </td>

                  {/* Bank */}
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {item.bank_name ?? "—"}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(item.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* View details */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 gap-1 text-xs"
                        onClick={() => setDetailsId(item.id)}
                        title={t("actionView")}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t("actionView")}</span>
                      </Button>

                      {/* Process — only for pending_review */}
                      {item.status === "pending_review" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 gap-1 text-xs border-[#32A88D]/40 text-[#32A88D] hover:bg-[#32A88D]/10"
                          onClick={() => setProcessId(item.id)}
                          title={t("actionProcess")}
                        >
                          <Settings2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{t("actionProcess")}</span>
                        </Button>
                      )}

                      {/* Download proof */}
                      {item.has_transfer_proof && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => handleDownload(item.id)}
                          title={t("actionDownloadProof")}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {pagination && (
        <PaginationControls
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          onPageChange={setPage}
          isLoading={isLoading || isFetching}
        />
      )}

      {/* ── Dialogs ────────────────────────────────────────────────────────── */}
      <WithdrawalDetailsDialog
        id={detailsId}
        open={detailsId !== null}
        onOpenChange={(open) => { if (!open) setDetailsId(null); }}
        onProcess={
          detailsId
            ? () => setProcessId(detailsId)
            : undefined
        }
      />

      {processId !== null && (
        <ProcessWithdrawalDialog
          id={processId}
          open={processId !== null}
          onOpenChange={(open) => { if (!open) setProcessId(null); }}
        />
      )}
    </div>
  );
}
