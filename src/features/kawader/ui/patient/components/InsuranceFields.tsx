"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/shared/ui/forms";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";

interface InsuranceFieldsProps {
  /** `insurance_enabled === true` from P1. Anything else hides the fields entirely. */
  enabled: boolean;
}

export function InsuranceFields({ enabled }: InsuranceFieldsProps) {
  const t = useTranslations("kawader");
  const checkboxId = useId();
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<KawaderRequestFormValues>();

  if (!enabled) {
    return (
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t("insurance.notAccepted")}
      </p>
    );
  }

  const hasInsurance = watch("has_insurance");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="has_insurance"
          render={({ field }) => (
            <Checkbox
              id={checkboxId}
              ref={field.ref}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor={checkboxId} className="cursor-pointer">
          {t("insurance.hasInsurance")}
        </Label>
      </div>

      {hasInsurance ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label={t("insurance.company")}
            error={errors.insurance_company?.message}
            {...register("insurance_company")}
          />
          <FormInput
            label={t("insurance.cardNumber")}
            error={errors.insurance_card_number?.message}
            {...register("insurance_card_number")}
          />
        </div>
      ) : null}
    </div>
  );
}
