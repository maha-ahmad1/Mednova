"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormInput } from "@/shared/ui/forms";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";
import { MAX_DAYS_AHEAD, MIN_HOURS_BEFORE } from "../../../utils/kawader-constants";
import { getUserTimezone, toApiLocalDateTime } from "../../../utils/kawader-datetime";

const toDateInputValue = (date: Date) => toApiLocalDateTime(date).slice(0, 10);

export function PreferredAtField() {
  const t = useTranslations("kawader");
  const {
    register,
    formState: { errors },
  } = useFormContext<KawaderRequestFormValues>();

  // Bounds for the native date picker; the schema re-checks the exact date + time.
  const [bounds] = useState(() => {
    const now = Date.now();
    return {
      min: toDateInputValue(new Date(now + MIN_HOURS_BEFORE * 3_600_000)),
      max: toDateInputValue(new Date(now + MAX_DAYS_AHEAD * 86_400_000)),
      timezone: getUserTimezone(),
    };
  });

  return (
    <div className="space-y-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          type="date"
          label={t("preferredAt.date")}
          min={bounds.min}
          max={bounds.max}
          error={errors.preferred_date?.message}
          {...register("preferred_date")}
        />
        <FormInput
          type="time"
          label={t("preferredAt.time")}
          error={errors.preferred_time?.message}
          {...register("preferred_time")}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {t("preferredAt.hint", { hours: MIN_HOURS_BEFORE, days: MAX_DAYS_AHEAD })}{" "}
        {t("preferredAt.timezone", { timezone: bounds.timezone })}
      </p>
    </div>
  );
}
