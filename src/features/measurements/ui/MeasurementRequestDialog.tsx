"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Loader2, Activity } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormSelect } from "@/shared/ui/forms/components/FormSelect";
import { FormInput } from "@/shared/ui/forms/components/FormInput";
import { handleBackendFormError } from "@/lib/backendFormErrors";
import type { ConsultationRequest } from "@/types/consultation";
import { useRequestMeasurement } from "../hooks/useRequestMeasurement";
import { resolveApiMessage } from "../utils/resolveApiMessage";
import { EXERCISE_TYPES } from "../utils/exerciseTypes";
import type { AffectedSide, RequestMeasurementPayload } from "../types";

const DURATION_OPTIONS = ["60", "120", "300", "custom"] as const;

const measurementFormSchema = z
  .object({
    exercise_type: z.string().min(1).max(100),
    affected_side: z.enum(["left", "right", "both"]),
    target_rom: z.number().min(1).max(360),
    target_reps: z.number().int().min(1).max(100),
    duration_option: z.enum(DURATION_OPTIONS),
    custom_duration_minutes: z.number().min(1).max(60).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.duration_option === "custom" &&
      (data.custom_duration_minutes === undefined ||
        Number.isNaN(data.custom_duration_minutes))
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["custom_duration_minutes"],
        message: "required",
      });
    }
  });

type MeasurementFormValues = z.infer<typeof measurementFormSchema>;

// Backend field errors use the payload's own field names, which don't map 1:1 to
// the form's UI-only fields (duration is split into duration_option/custom_duration_minutes).
const FIELD_MAP: Partial<Record<string, keyof MeasurementFormValues>> = {
  exercise_type: "exercise_type",
  affected_side: "affected_side",
  target_rom: "target_rom",
  target_reps: "target_reps",
  duration_seconds: "custom_duration_minutes",
};

const computeDurationSeconds = (values: MeasurementFormValues): number => {
  if (values.duration_option === "custom") {
    const minutes = values.custom_duration_minutes ?? 0;
    return Math.min(3600, Math.max(30, Math.round(minutes * 60)));
  }
  return Number(values.duration_option);
};

interface MeasurementRequestDialogProps {
  request: ConsultationRequest;
}

export default function MeasurementRequestDialog({
  request,
}: MeasurementRequestDialogProps) {
  const t = useTranslations();
  const locale = useLocale();
  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";
  const [open, setOpen] = useState(false);

  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: {
      exercise_type: "",
      duration_option: "60",
    },
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const mutation = useRequestMeasurement(request.type, request.id, () => {
    form.reset({ exercise_type: "", duration_option: "60" });
    setOpen(false);
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return;
    if (!nextOpen) {
      form.reset({ exercise_type: "", duration_option: "60" });
    }
    setOpen(nextOpen);
  };

  const onSubmit = form.handleSubmit((values) => {
    const payload: RequestMeasurementPayload = {
      exercise_type: values.exercise_type,
      affected_side: values.affected_side,
      target_rom: values.target_rom,
      target_reps: values.target_reps,
      duration_seconds: computeDurationSeconds(values),
    };

    mutation.mutate(payload, {
      onError: (error) => {
        if (!axios.isAxiosError(error)) {
          toast.error(t("measurements.apiMessages.ERROR_OCCURRED"));
          return;
        }

        const status = error.response?.status;
        if (status === 404 || (status !== undefined && status >= 500)) {
          const message = error.response?.data?.message ?? "";
          toast.error(resolveApiMessage(message, t));
          return;
        }

        handleBackendFormError(error, (fieldErrors) => {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            const mappedField = FIELD_MAP[field];
            if (mappedField) {
              form.setError(mappedField, { message });
            }
          });
        });
      },
    });
  });

  const affectedSideOptions: { value: AffectedSide; label: string }[] = [
    { value: "left", label: t("measurements.affectedSideOptions.left") },
    { value: "right", label: t("measurements.affectedSideOptions.right") },
    { value: "both", label: t("measurements.affectedSideOptions.both") },
  ];

  const durationOptions: {
    value: (typeof DURATION_OPTIONS)[number];
    label: string;
  }[] = [
    { value: "60", label: t("measurements.durationOptions.oneMin") },
    { value: "120", label: t("measurements.durationOptions.twoMin") },
    { value: "300", label: t("measurements.durationOptions.fiveMin") },
    { value: "custom", label: t("measurements.durationOptions.custom") },
  ];

  const affectedSide = watch("affected_side");
  const durationOption = watch("duration_option");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className=" cursor-pointer  border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          {t("measurements.triggerButton")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg" dir={dir}>
        <DialogHeader>
          <DialogTitle>{t("measurements.dialogTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormSelect
            label={t("measurements.exerciseTypeLabel")}
            placeholder={t("measurements.exerciseTypePlaceholder")}
            rtl={dir === "rtl"}
            disabled={mutation.isPending}
            value={watch("exercise_type")}
            onValueChange={(value) => setValue("exercise_type", value)}
            options={EXERCISE_TYPES.map((exerciseType) => ({
              value: exerciseType.value,
              label: t(`measurements.exerciseTypes.${exerciseType.labelKey}`),
            }))}
            error={
              errors.exercise_type
                ? t("measurements.errors.exerciseTypeRequired")
                : undefined
            }
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              {t("measurements.affectedSideLabel")}
            </span>
            <div className="flex flex-wrap gap-2">
              {affectedSideOptions.map((option) => (
                <Button
                className=" cursor-pointer "
                  key={option.value}
                  type="button"
                  size="sm"
                  disabled={mutation.isPending}
                  variant={
                    affectedSide === option.value ? "default" : "outline"
                  }
                  onClick={() => setValue("affected_side", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            {errors.affected_side && (
              <p className="text-sm text-destructive">
                {t("measurements.errors.affectedSideRequired")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="number"
              label={t("measurements.targetRomLabel")}
              rtl={dir === "rtl"}
              disabled={mutation.isPending}
              error={
                errors.target_rom
                  ? t("measurements.errors.targetRomRange")
                  : undefined
              }
              {...form.register("target_rom", { valueAsNumber: true })}
            />
            <FormInput
              type="number"
              label={t("measurements.targetRepsLabel")}
              rtl={dir === "rtl"}
              disabled={mutation.isPending}
              error={
                errors.target_reps
                  ? t("measurements.errors.targetRepsRange")
                  : undefined
              }
              {...form.register("target_reps", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              {t("measurements.durationLabel")}
            </span>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((option) => (
                <Button
                className=" cursor-pointer "
                  key={option.value}
                  type="button"
                  size="sm"
                  disabled={mutation.isPending}
                  variant={
                    durationOption === option.value ? "default" : "outline"
                  }
                  onClick={() => setValue("duration_option", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {durationOption === "custom" && (
              <FormInput
                type="number"
                label={t("measurements.customDurationLabel")}
                rtl={dir === "rtl"}
                disabled={mutation.isPending}
                error={
                  errors.custom_duration_minutes
                    ? t("measurements.errors.customDurationRequired")
                    : undefined
                }
                {...form.register("custom_duration_minutes", {
                  valueAsNumber: true,
                })}
              />
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {t("measurements.guidance")}
          </p>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => handleOpenChange(false)}
              className="flex-1  cursor-pointer "
            >
              {t("measurements.cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1  cursor-pointer " 
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  {t("measurements.submitting")}
                </>
              ) : (
                t("measurements.submitButton")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
