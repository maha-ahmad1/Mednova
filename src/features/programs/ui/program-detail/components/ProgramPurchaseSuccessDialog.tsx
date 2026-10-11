"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProgramPurchaseSuccessDialogProps {
  open: boolean;
  programTitle: string;
  onStart: () => void;
  onClose: () => void;
}

export function ProgramPurchaseSuccessDialog({
  open,
  programTitle,
  onStart,
  onClose,
}: ProgramPurchaseSuccessDialogProps) {
  const t = useTranslations("programs.purchase");

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader className="items-center sm:text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" aria-hidden />
          <DialogTitle className="text-xl">{t("successTitle")}</DialogTitle>
          <DialogDescription>{t("successDesc", { title: programTitle })}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-center">
          <Button autoFocus onClick={onStart} className="bg-[#32A88D] text-white hover:bg-[#2a8a7a]">
            {t("startWatching")}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t("later")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
