"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { FormSelect } from "@/shared/ui/forms";
import type { KawaderArea } from "../../../types/kawader";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";

interface AreaSelectProps {
  areas: KawaderArea[];
}

export function AreaSelect({ areas }: AreaSelectProps) {
  const t = useTranslations("kawader");
  const isRtl = useLocale() === "ar";
  const { control, formState } = useFormContext<KawaderRequestFormValues>();

  return (
    <Controller
      control={control}
      name="service_area"
      render={({ field }) => (
        <FormSelect
          ref={field.ref}
          label={t("area.label")}
          placeholder={t("area.placeholder")}
          options={areas.map((area) => ({ value: area.key, label: area.name }))}
          value={field.value}
          onValueChange={field.onChange}
          rtl={isRtl}
          error={formState.errors.service_area?.message}
        />
      )}
    />
  );
}
