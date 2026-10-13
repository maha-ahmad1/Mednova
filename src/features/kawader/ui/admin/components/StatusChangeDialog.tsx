"use client";

import { useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { useChangeKawaderRequestStatus } from "../../../hooks/useChangeKawaderRequestStatus";
import type { ChangeKawaderStatusPayload, KawaderTargetStatus } from "../../../types/kawader";
import { isKawaderBusinessRuleError } from "../../../utils/kawader-errors";

const REASON_MIN = 3;
const REASON_MAX = 500;
const NOTE_MAX = 500;

type KawaderT = (key: string, values?: Record<string, string | number>) => string;

interface StatusChangeFormValues {
  reason: string;
  admin_note: string;
}

const needsReason = (status: KawaderTargetStatus | null) =>
  status === "rejected" || status === "cancelled";

const createSchema = (t: KawaderT, reasonRequired: boolean) =>
  z
    .object({ reason: z.string(), admin_note: z.string() })
    .superRefine((values, ctx) => {
      const reason = values.reason.trim();
      if (reasonRequired) {
        if (!reason) {
          ctx.addIssue({ code: "custom", path: ["reason"], message: t("validation.required") });
        } else if (reason.length < REASON_MIN || reason.length > REASON_MAX) {
          ctx.addIssue({
            code: "custom",
            path: ["reason"],
            message: t("validation.lengthRange", { min: REASON_MIN, max: REASON_MAX }),
          });
        }
      }
      if (values.admin_note.trim().length > NOTE_MAX) {
        ctx.addIssue({
          code: "custom",
          path: ["admin_note"],
          message: t("validation.notesMax", { max: NOTE_MAX }),
        });
      }
    });

const buildPayload = (
  status: KawaderTargetStatus,
  values: StatusChangeFormValues,
): ChangeKawaderStatusPayload => {
  const adminNote = values.admin_note.trim() || undefined;

  if (status === "rejected" || status === "cancelled") {
    return { status, reason: values.reason.trim(), admin_note: adminNote };
  }
  return { status, admin_note: adminNote };
};

interface StatusChangeDialogProps {
  requestId: number;
  /** The status being applied; `null` keeps the dialog closed. */
  status: KawaderTargetStatus | null;
  onOpenChange: (open: boolean) => void;
  /** The backend refused the move (the request changed meanwhile): reload the real state. */
  onStale: () => void;
}

export function StatusChangeDialog({ requestId, status, onOpenChange, onStale }: StatusChangeDialogProps) {
  const t = useTranslations("kawader");
  const td = useTranslations("kawader.admin.statusDialog");
  const open = status !== null;
  const reasonRequired = needsReason(status);

  const schema = useMemo(() => createSchema(t, reasonRequired), [t, reasonRequired]);
  const form = useForm<StatusChangeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "", admin_note: "" },
  });
  const { register, handleSubmit, reset, setError, watch, formState } = form;

  useEffect(() => {
    if (open) reset({ reason: "", admin_note: "" });
  }, [open, status, reset]);

  const { changeStatus, isLoading } = useChangeKawaderRequestStatus({
    onValidationError: (errors) => {
      Object.entries(errors).forEach(([field, message], index) => {
        if (field === "reason" || field === "admin_note") {
          setError(field, { type: "server", message }, { shouldFocus: index === 0 });
        } else {
          toast.error(message);
        }
      });
    },
  });

  // A ref guards the handler itself: `disabled` alone leaves a render-cycle window for a
  // second submit.
  const submittingRef = useRef(false);

  const submit = handleSubmit(async (values) => {
    if (!status || submittingRef.current || isLoading) return;
    submittingRef.current = true;

    try {
      await changeStatus({ id: requestId, payload: buildPayload(status, values) });
      onOpenChange(false);
    } catch (error) {
      // The hook already toasted. A business-rule 422 means the request is no longer in a
      // state that allows this move: close and reload so the buttons show the real state.
      if (isKawaderBusinessRuleError(error)) {
        onOpenChange(false);
        onStale();
      }
    } finally {
      submittingRef.current = false;
    }
  });

  const handleOpenChange = (next: boolean) => {
    if (isLoading) return;
    onOpenChange(next);
  };

  const reasonLength = watch("reason").length;
  const noteLength = watch("admin_note").length;
  const { errors } = formState;
  // `status` is `null` while closed; keep the last labels from flashing empty.
  const key = status ?? "confirmed";

  return (
    <ConfirmationModal
      open={open}
      title={td(`title.${key}`)}
      description={td(`description.${key}`)}
      confirmLabel={td(`confirm.${key}`)}
      cancelLabel={td("dismiss")}
      confirmingLabel={td("confirming")}
      confirmVariant={reasonRequired ? "destructive" : "default"}
      isConfirming={isLoading}
      onConfirm={() => void submit()}
      onOpenChange={handleOpenChange}
    >
      <form
        noValidate
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        {reasonRequired ? (
          <div className="space-y-2">
            <Label htmlFor="kawader-status-reason">{td("reasonLabel")}</Label>
            <Textarea
              id="kawader-status-reason"
              rows={3}
              maxLength={REASON_MAX}
              placeholder={td("reasonPlaceholder")}
              aria-invalid={!!errors.reason}
              disabled={isLoading}
              {...register("reason")}
            />
            <div className="flex items-start justify-between gap-3 text-xs">
              <p className="text-muted-foreground">{td("reasonHelp")}</p>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {td("counter", { count: reasonLength, max: REASON_MAX })}
              </span>
            </div>
            {errors.reason?.message ? (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="kawader-status-note">{td("noteLabel")}</Label>
          <Textarea
            id="kawader-status-note"
            rows={2}
            maxLength={NOTE_MAX}
            placeholder={td("notePlaceholder")}
            aria-invalid={!!errors.admin_note}
            disabled={isLoading}
            {...register("admin_note")}
          />
          <div className="flex items-start justify-between gap-3 text-xs">
            <p className="text-muted-foreground">{td("noteHelp")}</p>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {td("counter", { count: noteLength, max: NOTE_MAX })}
            </span>
          </div>
          {errors.admin_note?.message ? (
            <p className="text-sm text-destructive">{errors.admin_note.message}</p>
          ) : null}
        </div>
      </form>
    </ConfirmationModal>
  );
}
