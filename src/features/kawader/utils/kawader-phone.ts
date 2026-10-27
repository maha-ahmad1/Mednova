// Phone normalization and per-country rules are shared: see `@/utils/phoneRules`.
// Only the Kawader-specific constants stay here.

export const DEFAULT_COUNTRY_CODE = "+968";

/** Backend rule for the combined number (digits after the "+"); used for countries without a rule. */
export const PHONE_MIN_DIGITS = 8;
export const PHONE_MAX_DIGITS = 15;
