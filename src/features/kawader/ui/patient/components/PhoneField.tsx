"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { FormPhoneInput } from "@/shared/ui/forms";
import { ARAB_COUNTRY_CODES } from "@/utils/phone";
import {
  formatDisjunction,
  getMaxLocalLength,
  getPhoneExample,
  getPhoneRule,
  hasEmbeddedCountryCode,
  normalizeDigits,
} from "@/utils/phoneRules";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";
import { PHONE_MAX_DIGITS } from "../../../utils/kawader-phone";

// Flag + code only: the shared list's labels are Arabic country names, which would show
// up untranslated in the English UI.
const COUNTRY_CODES = ARAB_COUNTRY_CODES.map(({ code, flag }) => ({
  code,
  flag,
  label: `${flag} ${code}`,
}));

// Enough room for "+" / "00" plus a full number, so the schema can reject a typed country code.
const EMBEDDED_CODE_MAX_LENGTH = 20;

export function PhoneField() {
  const t = useTranslations("kawader");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const messageId = useId();
  const {
    control,
    setValue,
    trigger,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext<KawaderRequestFormValues>();

  // The country code lives in its own form field; the schema and the payload combine it
  // with the number into `patient_phone`.
  const countryCode = watch("phone_country_code");
  const rule = getPhoneRule(countryCode);
  const maxLength = getMaxLocalLength(countryCode);
  const error = errors.phone_number?.message;

  // Typing is limited to the country's longest number (one more when it starts with the
  // trunk "0", which is dropped later). A typed "+" / "00" is kept so the schema can reject it.
  const sanitize = (raw: string): string => {
    const value = normalizeDigits(raw);
    if (hasEmbeddedCountryCode(value)) return value.slice(0, EMBEDDED_CODE_MAX_LENGTH);
    const digits = value.replace(/\D/g, "");
    const limit = maxLength ?? PHONE_MAX_DIGITS;
    return digits.slice(0, digits.startsWith("0") ? limit + 1 : limit);
  };

  const handleCountryChange = (code: string) => {
    setValue("phone_country_code", code, { shouldDirty: true });
    // A number that was fine for the old country may not be for the new one.
    if (touchedFields.phone_number || isSubmitted) void trigger("phone_number");
  };

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
            onChange={(event) => field.onChange(sanitize(event.target.value))}
            aria-label={t("phone.label")}
            aria-invalid={!!error}
            aria-describedby={messageId}
            placeholder={getPhoneExample(countryCode) ?? t("phone.placeholder")}
            inputMode="numeric"
            autoComplete="tel-national"
            countryCodes={COUNTRY_CODES}
            countryCodeValue={countryCode}
            onCountryCodeChange={handleCountryChange}
            rtl={isRtl}
            ltrNumber
          />
        )}
      />
      {/* Rendered here (not through FormPhoneInput's `error`) so the text follows the page direction. */}
      <div id={messageId} className="space-y-1">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {rule ? (
          <p className="text-xs text-muted-foreground">
            {t("phone.hint", { count: formatDisjunction(rule.lengths, locale) })}
          </p>
        ) : null}
      </div>
    </div>
  );
}
