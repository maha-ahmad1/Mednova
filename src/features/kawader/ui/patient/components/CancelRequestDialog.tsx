"use client";

import { useState } from "react";
import { Ban } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { useCancelKawaderRequest } from "../../../hooks/useCancelKawaderRequest";
import type { KawaderRequest } from "../../../types/kawader";

const REASON_MAX_LENGTH = 500;
const REASON_FIELD_ID = "kawader-cancel-reason";

interface CancelRequestDialogProps {
  request: Pick<KawaderRequest, "id" | "can_cancel">;
}

export function CancelRequestDialog({ request }: CancelRequestDialogProps) {
  const t = useTranslations("kawader");
  const { cancelRequest, isLoading } = useCancelKawaderRequest();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  // The API decides: no button unless `can_cancel` is true.
  if (!request.can_cancel) return null;

  const handleOpenChange = (next: boolean) => {
    if (isLoading) return;
    setOpen(next);
    if (next) setReason("");
  };

  const handleConfirm = async () => {
    try {
      await cancelRequest({ id: request.id, reason: reason.trim() || undefined });
      setOpen(false);
    } catch {
      // The mutation hook already toasted the error (a 422 shows the API message).
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
        onClick={() => handleOpenChange(true)}
      >
        <Ban className="h-4 w-4" aria-hidden />
        {t("cancel.button")}
      </Button>

      <ConfirmationModal
        open={open}
        title={t("cancel.title")}
        description={t("cancel.description")}
        confirmLabel={t("cancel.confirm")}
        cancelLabel={t("cancel.keep")}
        confirmingLabel={t("cancel.confirming")}
        confirmVariant="destructive"
        onConfirm={handleConfirm}
        onOpenChange={handleOpenChange}
        isConfirming={isLoading}
      >
        <div className="space-y-2">
          <Label htmlFor={REASON_FIELD_ID}>{t("cancel.reasonLabel")}</Label>
          <Textarea
            id={REASON_FIELD_ID}
            rows={4}
            maxLength={REASON_MAX_LENGTH}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t("cancel.reasonPlaceholder")}
            disabled={isLoading}
          />
          <p className="text-xs tabular-nums text-muted-foreground">
            {t("cancel.counter", { count: reason.length, max: REASON_MAX_LENGTH })}
          </p>
        </div>
      </ConfirmationModal>
    </>
  );
}
