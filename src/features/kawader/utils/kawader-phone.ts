export const DEFAULT_COUNTRY_CODE = "+968";
export const PHONE_MIN_DIGITS = 8;
export const PHONE_MAX_DIGITS = 15;

const ARABIC_INDIC_ZERO = 0x0660;
const EXTENDED_ARABIC_INDIC_ZERO = 0x06f0;

/** Turns Arabic-Indic and Persian digits into 0-9, so they validate and send correctly. */
export const normalizeDigits = (value: string): string =>
  value.replace(/[٠-٩۰-۹]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= EXTENDED_ARABIC_INDIC_ZERO ? EXTENDED_ARABIC_INDIC_ZERO : ARABIC_INDIC_ZERO;
    return String(code - base);
  });

const digitsOnly = (value: string): string => normalizeDigits(value).replace(/\D/g, "");

/** True when the user typed the country code into the number field ("+968..." or "00968..."). */
export const hasEmbeddedCountryCode = (local: string): boolean =>
  /^\s*(\+|00)/.test(normalizeDigits(local));

/**
 * Combines the selected country code and the local number into "+<digits>".
 * Leading zeros of the local part (trunk prefix) are dropped. Returns "" for an empty number.
 */
export const buildKawaderPhone = (countryCode: string, local: string): string => {
  const localDigits = digitsOnly(local).replace(/^0+/, "");
  if (!localDigits) return "";
  return `+${digitsOnly(countryCode)}${localDigits}`;
};
