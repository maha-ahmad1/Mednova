"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";

export function ConsentField() {
  const t = useTranslations("kawader");
  const checkboxId = useId();
  const {
    control,
    formState: { errors },
  } = useFormContext<KawaderRequestFormValues>();
  const error = errors.consent?.message;

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox
              id={checkboxId}
              ref={field.ref}
              className="mt-0.5"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={!!error}
            />
          )}
        />
        <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-normal leading-6">
          {t("consent.text")}
        </Label>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
