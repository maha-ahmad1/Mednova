"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { FormSelect } from "@/shared/ui/forms";
import type { KawaderService } from "../../../types/kawader";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";

interface ServiceSelectProps {
  services: KawaderService[];
  selected?: KawaderService;
  /** Lets the parent rebuild the validation schema for the chosen service. */
  onSelect: (key: string) => void;
}

export function ServiceSelect({ services, selected, onSelect }: ServiceSelectProps) {
  const t = useTranslations("kawader");
  const isRtl = useLocale() === "ar";
  const { control, formState } = useFormContext<KawaderRequestFormValues>();

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name="service_key"
        render={({ field }) => (
          <FormSelect
            ref={field.ref}
            label={t("service.label")}
            placeholder={t("service.placeholder")}
            options={services.map((service) => ({ value: service.key, label: service.name }))}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onSelect(value);
            }}
            rtl={isRtl}
            error={formState.errors.service_key?.message}
          />
        )}
      />
      {selected?.hint ? <p className="text-sm text-muted-foreground">{selected.hint}</p> : null}
    </div>
  );
}
