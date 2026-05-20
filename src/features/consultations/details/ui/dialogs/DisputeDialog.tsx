"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { handleBackendFormError } from "@/lib/backendFormErrors";
import { useOpenDispute } from "@/features/consultations/details/hooks/useOpenDispute";

interface DisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultationType: "video" | "chat";
  queryId: string;
}

const MIN_REASON_CHARS = 20;

const disputeSchema = z.object({
  reason: z.string().min(MIN_REASON_CHARS),
});

type DisputeFormValues = z.infer<typeof disputeSchema>;

export default function DisputeDialog({
  open,
  onOpenChange,
  consultationType,
  queryId,
}: DisputeDialogProps) {
  const t = useTranslations("consultations.details.dispute");
  const { mutateAsync, isPending } = useOpenDispute();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<DisputeFormValues>({ resolver: zodResolver(disputeSchema) });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: DisputeFormValues) => {
    try {
      await mutateAsync({ consultationType, queryId, reason: values.reason });
      toast.success(t("toast.success"));
      handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error(t("toast.alreadyExists"));
          return;
        }
        handleBackendFormError(error, (fieldErrors) => {
          if (fieldErrors.reason_dispute) {
            setError("reason", { message: fieldErrors.reason_dispute });
          }
        });
      } else {
        toast.error(t("toast.error"));
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isPending) return;
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dispute-reason">{t("dialog.reasonLabel")}</Label>
            <Textarea
              id="dispute-reason"
              placeholder={t("dialog.reasonPlaceholder")}
              className="min-h-[120px] resize-none"
              disabled={isPending}
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">
                {t("dialog.minChars", { count: MIN_REASON_CHARS })}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleClose}
            >
              {t("dialog.cancel")}
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.submitting")}
                </>
              ) : (
                t("dialog.submit")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
