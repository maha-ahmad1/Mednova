"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { FormPhoneInput } from "@/shared/ui/forms";
import { ARAB_COUNTRY_CODES } from "@/utils/phone";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";

// Flag + code only: the shared list's labels are Arabic country names, which would show
// up untranslated in the English UI.
const COUNTRY_CODES = ARAB_COUNTRY_CODES.map(({ code, flag }) => ({
  code,
  flag,
  label: `${flag} ${code}`,
}));

export function PhoneField() {
  const t = useTranslations("kawader");
  const isRtl = useLocale() === "ar";
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<KawaderRequestFormValues>();

  // The country code lives in its own form field; the schema and the payload combine it
  // with the number into `patient_phone`.
  const countryCode = watch("phone_country_code");

  // The label is rendered here (not through `label`) because FormPhoneInput hard-codes
  // dir="rtl" on its label, which misaligns it in English.
  return (
    <div className="space-y-2">
      <Label>{t("phone.label")}</Label>
      <Controller
        control={control}
        name="phone_number"
        render={({ field }) => (
          <FormPhoneInput
            {...field}
            aria-label={t("phone.label")}
            placeholder={t("phone.placeholder")}
            inputMode="tel"
            autoComplete="tel-national"
            countryCodes={COUNTRY_CODES}
            countryCodeValue={countryCode}
            onCountryCodeChange={(code) => setValue("phone_country_code", code, { shouldDirty: true })}
            rtl={isRtl}
            error={errors.phone_number?.message}
          />
        )}
      />
    </div>
  );
}
