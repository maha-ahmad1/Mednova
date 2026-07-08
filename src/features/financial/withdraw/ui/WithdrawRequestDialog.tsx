"use client";

import { Loader2, Building2, ArrowDownCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRequestWithdrawal } from "../hooks/useRequestWithdrawal";
import type { BankAccount } from "@/features/financial/types";

function maskIban(iban: string): string {
  if (iban.length < 8) return iban;
  return `${iban.slice(0, 4)} •••• •••• •••• ${iban.slice(-4)}`;
}

interface WithdrawRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: { withdrawable_balance: number; currency: string };
  bankAccount: BankAccount;
}

export function WithdrawRequestDialog({
  open,
  onOpenChange,
  wallet,
  bankAccount,
}: WithdrawRequestDialogProps) {
  const t = useTranslations("financial.withdraw.request");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const { mutateAsync, isPending } = useRequestWithdrawal();

  const handleClose = () => {
    if (isPending) return;
    onOpenChange(false);
  };

  const MIN_WITHDRAWAL = 5;
  const isBelowMinimum = wallet.withdrawable_balance < MIN_WITHDRAWAL;

  const handleConfirm = async () => {
    try {
      await mutateAsync(wallet.withdrawable_balance);
      onOpenChange(false);
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl bg-gradient-to-br from-[#32A88D] to-[#1F6069] p-6 text-white text-center space-y-1">
            <p className="text-sm text-white/80">{t("availableLabel")}</p>
            <p className="text-4xl font-bold tracking-tight">
              {Number(wallet.withdrawable_balance).toFixed(3)}
            </p>
            <p className="text-sm text-white/80">{wallet.currency}</p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
            <div className="rounded-lg bg-[#32A88D]/10 p-2 shrink-0">
              <Building2 className="h-4 w-4 text-[#32A88D]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t("bankLabel")}</p>
              <p className="text-sm font-medium">{bankAccount.bank_name}</p>
              <p
                className="text-xs text-muted-foreground font-mono truncate"
                dir="ltr"
              >
                {maskIban(bankAccount.iban)}
              </p>
            </div>
            <span className="text-xs text-[#32A88D] border border-[#32A88D]/30 rounded-full px-2.5 py-0.5 shrink-0">
              {t("bankType")}
            </span>
          </div>

          <div className="space-y-2 text-sm border-t pt-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("summaryAmount")}</span>
              <span className="font-medium">
                {Number(wallet.withdrawable_balance).toFixed(3)} {wallet.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("summaryFee")}</span>
              <span className="font-medium">0.000 {wallet.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("summaryEta")}</span>
              <span className="font-medium">{t("summaryEtaValue")}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">{t("summaryRecipient")}</span>
              <span className="font-semibold">
                {bankAccount.account_holder_name}
              </span>
            </div>
          </div>
        </div>

        {isBelowMinimum && (
          <p className="text-sm text-amber-600 text-center py-1">
            {t("minimumWarning", { amount: `5.000 ${wallet.currency}` })}
          </p>
        )}

        <DialogFooter className="flex-row-reverse gap-2 sm:gap-2">
          <Button
            onClick={handleConfirm}
            disabled={isPending || isBelowMinimum}
            className="flex-1 bg-[#32A88D] hover:bg-[#2a9278] text-white gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("confirmingButton")}
              </>
            ) : (
              <>
                <ArrowDownCircle className="h-4 w-4" />
                {t("confirmButton")}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {t("cancelButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
