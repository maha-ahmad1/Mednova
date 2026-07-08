"use client";

import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCancelWithdrawal } from "../hooks/useCancelWithdrawal";

interface CancelWithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalId: number;
  amount: number;
  currency: string;
}

export function CancelWithdrawalDialog({
  open,
  onOpenChange,
  withdrawalId,
  amount,
  currency,
}: CancelWithdrawalDialogProps) {
  const t = useTranslations("financial.withdrawals.cancelDialog");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const { mutateAsync, isPending } = useCancelWithdrawal();

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const handleConfirm = async () => {
    try {
      await mutateAsync(withdrawalId);
      onOpenChange(false);
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={dir}>
        <DialogHeader className="ms-2 mt-2">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 px-1">
          <p className="text-sm text-foreground">
            {t("description", { amount: formatted, currency })}
          </p>
          <p className="text-sm text-muted-foreground">{t("warning")}</p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("back")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                {t("cancelling")}
              </>
            ) : (
              t("confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
