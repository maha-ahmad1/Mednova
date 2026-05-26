"use client";

import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useProcessAdminWithdrawal } from "../../hooks/useProcessAdminWithdrawal";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const processSchema = z
  .object({
    action: z.enum(["approve", "reject"] as const),
    transfer_reference: z.string().optional(),
    admin_note: z.string().optional(),
    // File is a browser-only type; we use z.any() and validate in superRefine
    transfer_proof: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === "approve") {
      if (!data.transfer_reference?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رقم مرجع التحويل مطلوب عند الموافقة",
          path: ["transfer_reference"],
        });
      }
      const file = data.transfer_proof as File | null | undefined;
      if (!file || !(file instanceof File) || file.size === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "إثبات التحويل مطلوب عند الموافقة",
          path: ["transfer_proof"],
        });
      }
    }
    if (data.action === "reject") {
      if (!data.admin_note?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يجب إدخال سبب الرفض",
          path: ["admin_note"],
        });
      }
    }
  });

type ProcessFormValues = z.infer<typeof processSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProcessWithdrawalDialogProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProcessWithdrawalDialog({
  id,
  open,
  onOpenChange,
}: ProcessWithdrawalDialogProps) {
  const t = useTranslations("controlPanel.financial.withdrawals");
  const { mutateAsync, isPending } = useProcessAdminWithdrawal(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProcessFormValues>({
    resolver: zodResolver(processSchema),
    defaultValues: { action: "approve" },
  });

  const action = watch("action");
  const proofFile = watch("transfer_proof") as File | null | undefined;

  const handleClose = () => {
    if (isPending) return;
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  };

  const onSubmit = async (values: ProcessFormValues) => {
    await mutateAsync({
      action: values.action,
      admin_note: values.admin_note || undefined,
      transfer_reference: values.transfer_reference || undefined,
      transfer_proof: values.transfer_proof instanceof File ? values.transfer_proof : undefined,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("process.title")}</DialogTitle>
          <DialogDescription>{t("process.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Action selector ────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label>{t("process.actionLabel")}</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("action", "approve", { shouldValidate: false })}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  action === "approve"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-border bg-background text-foreground hover:bg-muted/40",
                )}
              >
                {t("process.approve")}
              </button>
              <button
                type="button"
                onClick={() => setValue("action", "reject", { shouldValidate: false })}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  action === "reject"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-border bg-background text-foreground hover:bg-muted/40",
                )}
              >
                {t("process.reject")}
              </button>
            </div>
          </div>

          {/* ── Approve fields ─────────────────────────────────────────────── */}
          {action === "approve" && (
            <>
              {/* Transfer reference */}
              <div className="space-y-2">
                <Label htmlFor="transfer_reference">
                  {t("process.transferReference")}
                  <span className="text-destructive ms-1">*</span>
                </Label>
                <Input
                  id="transfer_reference"
                  placeholder={t("process.transferReferencePlaceholder")}
                  {...register("transfer_reference")}
                />
                {errors.transfer_reference && (
                  <p className="text-xs text-destructive">{errors.transfer_reference.message}</p>
                )}
              </div>

              {/* Transfer proof file */}
              <div className="space-y-2">
                <Label htmlFor="transfer_proof">
                  {t("process.transferProof")}
                  <span className="text-destructive ms-1">*</span>
                </Label>
                <input
                  id="transfer_proof"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.pdf"
                  className="block w-full text-sm text-muted-foreground
                    file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                    file:text-xs file:font-medium file:bg-muted file:text-foreground
                    hover:file:bg-muted/70 cursor-pointer"
                  onChange={(e) => {
                    setValue("transfer_proof", e.target.files?.[0] ?? null, {
                      shouldValidate: false,
                    });
                  }}
                />
                {proofFile instanceof File && (
                  <p className="text-xs text-muted-foreground">
                    {proofFile.name} ({(proofFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
                {errors.transfer_proof && (
                  <p className="text-xs text-destructive">
                    {errors.transfer_proof.message as string}
                  </p>
                )}
              </div>

              {/* Optional admin note for approve */}
              <div className="space-y-2">
                <Label htmlFor="admin_note_approve">{t("process.adminNote")}</Label>
                <Textarea
                  id="admin_note_approve"
                  placeholder={t("process.adminNotePlaceholder")}
                  rows={3}
                  {...register("admin_note")}
                />
              </div>
            </>
          )}

          {/* ── Reject fields ──────────────────────────────────────────────── */}
          {action === "reject" && (
            <div className="space-y-2">
              <Label htmlFor="admin_note_reject">
                {t("process.adminNote")}
                <span className="text-destructive ms-1">*</span>
              </Label>
              <Textarea
                id="admin_note_reject"
                placeholder={t("process.adminNotePlaceholder")}
                rows={4}
                {...register("admin_note")}
              />
              {errors.admin_note && (
                <p className="text-xs text-destructive">{errors.admin_note.message}</p>
              )}
            </div>
          )}

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <DialogFooter className="flex-row-reverse gap-2 sm:gap-0">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                action === "approve"
                  ? "bg-[#32A88D] hover:bg-[#2a9079] text-white"
                  : "bg-destructive hover:bg-destructive/90 text-white",
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("process.submitting")}
                </>
              ) : (
                t("process.submit")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              {t("process.cancel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
