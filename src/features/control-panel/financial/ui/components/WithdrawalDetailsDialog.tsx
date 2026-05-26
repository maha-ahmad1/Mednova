"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrencyAmount } from "@/features/financial/ui/shared/CurrencyAmount";
import { formatDate } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { downloadAdminWithdrawalProof } from "../../api/adminFinancial.api";
import { useAdminWithdrawalDetails } from "../../hooks/useAdminWithdrawalDetails";
import { WithdrawalStatusBadge } from "./WithdrawalStatusBadge";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 pt-1">
      <div className="h-3.5 w-0.5 rounded-full bg-[#32A88D] shrink-0" />
      <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </h4>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={cn("text-xs text-foreground text-start font-medium", mono && "font-mono")}>
        {value}
      </span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface WithdrawalDetailsDialogProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: called when the admin clicks "Process" from inside the dialog */
  onProcess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WithdrawalDetailsDialog({
  id,
  open,
  onOpenChange,
  onProcess,
}: WithdrawalDetailsDialogProps) {
  const t = useTranslations("controlPanel.financial.withdrawals");
  const axiosInstance = useAxiosInstance();

  const { data: response, isLoading, isError } = useAdminWithdrawalDetails(id);
  const detail = response?.data;

  // ── Download proof ─────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!id) return;
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

  const isPending = detail?.withdrawal.status === "pending_review";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{t("details.title")}</DialogTitle>
        </DialogHeader>

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-3 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full rounded" />
            ))}
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {!isLoading && isError && (
          <p className="py-4 text-center text-sm text-destructive">
            تعذر تحميل التفاصيل. حاول مرة أخرى.
          </p>
        )}

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {!isLoading && !isError && detail && (
          <div className="space-y-5 text-start">

            {/* 1. Withdrawal Summary */}
            <div>
              <SectionHeading>{t("details.sectionWithdrawal")}</SectionHeading>
              <div className="space-y-0">
                <InfoRow
                  label={t("details.labelId")}
                  value={`#${detail.withdrawal.id}`}
                  mono
                />
                <InfoRow
                  label={t("details.labelAmount")}
                  value={
                    <CurrencyAmount
                      amount={parseFloat(detail.withdrawal.amount)}
                      currency={detail.withdrawal.currency}
                      size="sm"
                    />
                  }
                />
                <InfoRow
                  label={t("details.labelStatus")}
                  value={
                    <WithdrawalStatusBadge
                      status={detail.withdrawal.status}
                      label={detail.withdrawal.status_label}
                    />
                  }
                />
                <InfoRow
                  label={t("details.labelCreatedAt")}
                  value={formatDate(detail.withdrawal.created_at)}
                />
                <InfoRow
                  label={t("details.labelProcessedAt")}
                  value={
                    detail.withdrawal.processed_at
                      ? formatDate(detail.withdrawal.processed_at)
                      : <span className="text-muted-foreground">{t("details.notProcessed")}</span>
                  }
                />
                <InfoRow
                  label={t("details.labelTransferRef")}
                  value={
                    detail.withdrawal.transfer_reference
                      ? <span className="font-mono">{detail.withdrawal.transfer_reference}</span>
                      : <span className="text-muted-foreground">{t("details.noReference")}</span>
                  }
                />
                <InfoRow
                  label={t("details.labelAdminNote")}
                  value={
                    detail.withdrawal.admin_note
                      ? detail.withdrawal.admin_note
                      : <span className="text-muted-foreground">{t("details.noNote")}</span>
                  }
                />
                <InfoRow
                  label={t("details.labelHasProof")}
                  value={
                    detail.withdrawal.has_transfer_proof
                      ? <span className="text-emerald-600 font-medium">{t("details.proofAvailable")}</span>
                      : <span className="text-muted-foreground">{t("details.proofNotAvailable")}</span>
                  }
                />
              </div>
            </div>

            {/* 2. User Information */}
            <div>
              <SectionHeading>{t("details.sectionUser")}</SectionHeading>
              <div className="space-y-0">
                <InfoRow label={t("details.labelFullName")} value={detail.user.full_name} />
                <InfoRow label={t("details.labelUserType")} value={detail.user.type} />
                <InfoRow label={t("details.labelEmail")} value={detail.user.email} mono />
                <InfoRow label={t("details.labelPhone")} value={detail.user.phone} mono />
              </div>
            </div>

            {/* 3. Bank Account */}
            <div>
              <SectionHeading>{t("details.sectionBank")}</SectionHeading>
              {detail.bank_account ? (
                <div className="space-y-0">
                  <InfoRow label={t("details.labelBankName")} value={detail.bank_account.bank_name} />
                  <InfoRow label={t("details.labelAccountHolder")} value={detail.bank_account.account_holder_name} />
                  <InfoRow label={t("details.labelAccountNumber")} value={detail.bank_account.account_number} mono />
                  <InfoRow label={t("details.labelIban")} value={detail.bank_account.iban} mono />
                  {detail.bank_account.swift_code && (
                    <InfoRow label={t("details.labelSwift")} value={detail.bank_account.swift_code} mono />
                  )}
                  <InfoRow label={t("details.labelBankCountry")} value={detail.bank_account.bank_country} />
                  <InfoRow label={t("details.labelBankStatus")} value={detail.bank_account.status} />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-1">{t("details.noBankAccount")}</p>
              )}
            </div>

            {/* 4. Wallet Snapshot */}
            <div>
              <SectionHeading>{t("details.sectionWallet")}</SectionHeading>
              {detail.wallet_snapshot ? (
                <div className="space-y-0">
                  <InfoRow
                    label={t("details.labelAvailableBalance")}
                    value={
                      <CurrencyAmount
                        amount={parseFloat(detail.wallet_snapshot.available_balance)}
                        size="sm"
                      />
                    }
                  />
                  <InfoRow
                    label={t("details.labelPendingBalance")}
                    value={
                      <CurrencyAmount
                        amount={parseFloat(detail.wallet_snapshot.pending_balance)}
                        size="sm"
                      />
                    }
                  />
                  <InfoRow
                    label={t("details.labelTotalBalance")}
                    value={
                      <CurrencyAmount
                        amount={parseFloat(detail.wallet_snapshot.total_balance)}
                        size="sm"
                      />
                    }
                  />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-1">{t("details.noWalletSnapshot")}</p>
              )}
            </div>

            {/* ── Footer actions ─────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
              {detail.withdrawal.has_transfer_proof && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("details.downloadProof")}
                </Button>
              )}
              {isPending && onProcess && (
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onProcess();
                  }}
                  className="bg-[#32A88D] hover:bg-[#2a9079] text-white gap-1.5"
                >
                  {t("actionProcess")}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="ms-auto"
              >
                {t("process.cancel")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
