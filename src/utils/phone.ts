export const ARAB_COUNTRY_CODES = [
  { code: "+968", label: "عُمان", flag: "🇴🇲" },
  { code: "+971", label: "الإمارات", flag: "🇦🇪" },
  { code: "+966", label: "السعودية", flag: "🇸🇦" },
  { code: "+974", label: "قطر", flag: "🇶🇦" },
  { code: "+973", label: "البحرين", flag: "🇧🇭" },
  { code: "+965", label: "الكويت", flag: "🇰🇼" },
  { code: "+967", label: "اليمن", flag: "🇾🇪" },
  { code: "+962", label: "الأردن", flag: "🇯🇴" },
  { code: "+961", label: "لبنان", flag: "🇱🇧" },
  { code: "+963", label: "سوريا", flag: "🇸🇾" },
  { code: "+964", label: "العراق", flag: "🇮🇶" },
  { code: "+970", label: "فلسطين", flag: "🇵🇸" },
  { code: "+20", label: "مصر", flag: "🇪🇬" },
  { code: "+218", label: "ليبيا", flag: "🇱🇾" },
  { code: "+216", label: "تونس", flag: "🇹🇳" },
  { code: "+213", label: "الجزائر", flag: "🇩🇿" },
  { code: "+212", label: "المغرب", flag: "🇲🇦" },
  { code: "+249", label: "السودان", flag: "🇸🇩" },
] as const;

export const DEFAULT_COUNTRY_CODES: string[] = ARAB_COUNTRY_CODES.map((c) => c.code);

export type PhoneParseOptions = {
  defaultCountryCode?: string;
  countryCodes?: readonly string[];
};

export type ParsedPhoneNumber = {
  countryCode: string;
  localNumber: string;
  fullNumber: string;
};

const normalizePhone = (value: string) => value.replace(/\s+/g, "").trim();

export const parsePhoneNumber = (
  raw?: string | null,
  options: PhoneParseOptions = {},
): ParsedPhoneNumber => {
  const defaultCountryCode = options.defaultCountryCode ?? DEFAULT_COUNTRY_CODES[0];
  const countryCodes = options.countryCodes ?? DEFAULT_COUNTRY_CODES;
  const value = raw?.trim() ?? "";

  if (!value) {
    return { countryCode: defaultCountryCode, localNumber: "", fullNumber: "" };
  }

  const normalized = normalizePhone(value);
  if (!normalized.startsWith("+")) {
    return {
      countryCode: defaultCountryCode,
      localNumber: normalized,
      fullNumber: normalized,
    };
  }

  const sortedCodes = [...countryCodes].sort((a, b) => b.length - a.length);
  const matchedCode = sortedCodes.find((code) => normalized.startsWith(code));

  if (matchedCode) {
    return {
      countryCode: matchedCode,
      localNumber: normalized.slice(matchedCode.length),
      fullNumber: normalized,
    };
  }

  return {
    countryCode: defaultCountryCode,
    localNumber: normalized.replace(/^\+/, ""),
    fullNumber: normalized,
  };
};

export const buildFullPhoneNumber = (
  countryCode?: string,
  localNumber?: string,
): string | undefined => {
  const trimmedLocal = (localNumber ?? "").trim();
  if (!trimmedLocal) {
    return undefined;
  }

  const trimmedCountry = (countryCode ?? "").trim();
  return trimmedCountry ? `${trimmedCountry}${trimmedLocal}` : trimmedLocal;
};
