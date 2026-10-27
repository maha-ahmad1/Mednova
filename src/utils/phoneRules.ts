import { ARAB_COUNTRY_CODES } from "./phone";

/** Dial codes known to the shared country list (`ARAB_COUNTRY_CODES`). */
export type PhoneDialCode = (typeof ARAB_COUNTRY_CODES)[number]["code"];

export interface PhoneRule {
  /** Allowed lengths of the local number (no dial code, no leading 0). */
  lengths: readonly number[];
  /** Allowed first digits of a mobile number; omitted = any. */
  starts?: readonly string[];
}

// Keyed by dial code only: names and flags stay in `ARAB_COUNTRY_CODES`. Typed as a full
// Record, so adding a country there without a rule here is a compile error.
export const PHONE_RULES: Record<PhoneDialCode, PhoneRule> = {
  "+968": { lengths: [8], starts: ["7", "9"] },
  "+966": { lengths: [9], starts: ["5"] },
  "+971": { lengths: [9], starts: ["5"] },
  "+965": { lengths: [8], starts: ["5", "6", "9"] },
  "+974": { lengths: [8], starts: ["3", "5", "6", "7"] },
  "+973": { lengths: [8], starts: ["3", "6"] },
  "+962": { lengths: [9], starts: ["7"] },
  "+20": { lengths: [10], starts: ["1"] },
  "+970": { lengths: [9], starts: ["5"] },
  "+964": { lengths: [10], starts: ["7"] },
  "+961": { lengths: [7, 8] },
  "+967": { lengths: [9], starts: ["7"] },
  "+963": { lengths: [9], starts: ["9"] },
  "+249": { lengths: [9] },
  "+218": { lengths: [9], starts: ["9"] },
  "+216": { lengths: [8] },
  "+213": { lengths: [9], starts: ["5", "6", "7"] },
  "+212": { lengths: [9], starts: ["6", "7"] },
};

export const getPhoneRule = (dialCode: string): PhoneRule | undefined =>
  (PHONE_RULES as Record<string, PhoneRule | undefined>)[dialCode];

const ARABIC_INDIC_ZERO = 0x0660;
const EXTENDED_ARABIC_INDIC_ZERO = 0x06f0;

/** Turns Arabic-Indic and Persian digits into 0-9, so they validate and send correctly. */
export const normalizeDigits = (value: string): string =>
  value.replace(/[٠-٩۰-۹]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= EXTENDED_ARABIC_INDIC_ZERO ? EXTENDED_ARABIC_INDIC_ZERO : ARABIC_INDIC_ZERO;
    return String(code - base);
  });

export const digitsOnly = (value: string): string => normalizeDigits(value).replace(/\D/g, "");

/** True when the user typed the country code into the number field ("+968..." or "00968..."). */
export const hasEmbeddedCountryCode = (local: string): boolean =>
  /^\s*(\+|00)/.test(normalizeDigits(local));

/** Local digits as validated and sent: Latin digits only, spaces/dashes gone, one leading 0 dropped. */
export const toLocalDigits = (local: string): string => digitsOnly(local).replace(/^0/, "");

/** "+<dial code digits><local digits>", or "" for an empty number. */
export const buildInternationalPhone = (dialCode: string, local: string): string => {
  const localDigits = toLocalDigits(local);
  if (!localDigits) return "";
  return `+${digitsOnly(dialCode)}${localDigits}`;
};

/** Longest local number the country allows; `undefined` when it has no rule. */
export const getMaxLocalLength = (dialCode: string): number | undefined => {
  const rule = getPhoneRule(dialCode);
  return rule ? Math.max(...rule.lengths) : undefined;
};

export type PhoneCheck =
  | { ok: true }
  | { ok: false; reason: "length" | "prefix"; rule: PhoneRule };

/** Checks a local number against the country's rule. Countries without a rule are not checked here. */
export const checkLocalPhone = (dialCode: string, local: string): PhoneCheck => {
  const rule = getPhoneRule(dialCode);
  if (!rule) return { ok: true };

  const digits = toLocalDigits(local);
  if (!rule.lengths.includes(digits.length)) return { ok: false, reason: "length", rule };
  if (rule.starts && !rule.starts.some((start) => digits.startsWith(start))) {
    return { ok: false, reason: "prefix", rule };
  }
  return { ok: true };
};

/** "9XXXXXXX"-style example for the placeholder; `undefined` when the country has no rule. */
export const getPhoneExample = (dialCode: string): string | undefined => {
  const rule = getPhoneRule(dialCode);
  if (!rule) return undefined;
  const length = Math.max(...rule.lengths);
  const first = rule.starts?.[rule.starts.length - 1] ?? "";
  return `${first}${"X".repeat(length - first.length)}`;
};

const REGIONAL_INDICATOR_A = 0x1f1e6;

/** ISO 3166 alpha-2 code read from a flag emoji (two regional indicators), so no names are duplicated. */
const regionFromFlag = (flag: string): string | undefined => {
  const points = Array.from(flag, (char) => char.codePointAt(0) ?? 0);
  if (points.length !== 2 || points.some((p) => p < REGIONAL_INDICATOR_A || p > REGIONAL_INDICATOR_A + 25)) {
    return undefined;
  }
  return points.map((p) => String.fromCharCode(65 + p - REGIONAL_INDICATOR_A)).join("");
};

/** Country name in the UI language (from the flag in the shared list); `undefined` if unavailable. */
export const getPhoneCountryName = (dialCode: string, locale: string): string | undefined => {
  const entry = ARAB_COUNTRY_CODES.find((country) => country.code === dialCode);
  const region = entry ? regionFromFlag(entry.flag) : undefined;
  if (!region) return undefined;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(region);
  } catch {
    return undefined;
  }
};

/** "7 or 9" / "5, 6, or 9" in the UI language. */
export const formatDisjunction = (items: readonly (string | number)[], locale: string): string => {
  const values = items.map(String);
  try {
    return new Intl.ListFormat([locale], { style: "long", type: "disjunction" }).format(values);
  } catch {
    return values.join(", ");
  }
};
