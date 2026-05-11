export const DEFAULT_COUNTRY_CODES = ["+968", "+966", "+971", "+965", "+974", "+973"] as const;

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
