import { useCallback } from "react";

export interface PhoneParts {
  countryCode: string;
  localNumber: string;
}

const normalizeLocalNumber = (value?: string | null) =>
  value ? value.replace(/\D+/g, "") : "";

const parsePhoneNumber = (value?: string | null, defaultCountryCode = "+968"): PhoneParts => {
  if (!value) {
    return { countryCode: defaultCountryCode, localNumber: "" };
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^\+(\d{1,4})\s*(.*)$/);
  if (match) {
    return {
      countryCode: `+${match[1]}`,
      localNumber: normalizeLocalNumber(match[2]),
    };
  }

  return {
    countryCode: defaultCountryCode,
    localNumber: normalizeLocalNumber(trimmed),
  };
};

const buildPhoneNumber = (countryCode?: string, localNumber?: string) => {
  const normalizedLocal = normalizeLocalNumber(localNumber);
  if (countryCode && normalizedLocal) {
    return `${countryCode}${normalizedLocal}`;
  }

  return normalizedLocal;
};

export const usePhoneNumber = (defaultCountryCode = "+968") => {
  const splitPhoneNumber = useCallback(
    (value?: string | null) => parsePhoneNumber(value, defaultCountryCode),
    [defaultCountryCode],
  );

  const normalizePhoneInput = useCallback((value?: string | null) => normalizeLocalNumber(value), []);

  const buildFullPhoneNumber = useCallback(
    (countryCode?: string, localNumber?: string) => buildPhoneNumber(countryCode, localNumber),
    [],
  );

  return {
    splitPhoneNumber,
    normalizePhoneInput,
    buildFullPhoneNumber,
  };
};

export type { PhoneParts as PhoneNumberParts };
