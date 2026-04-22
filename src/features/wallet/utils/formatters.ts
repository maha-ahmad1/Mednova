const ARABIC_LOCALE = "ar-OM";

const toNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null || value === "") return 0;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatAmount = (value: number | string | undefined, currency = "OMR"): string => {
  const amount = toNumber(value);

  return `${new Intl.NumberFormat(ARABIC_LOCALE, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)} ${currency}`;
};

export const formatSignedAmount = (raw: string): string => {
  const sign = raw.startsWith("-") ? "-" : "+";
  const amount = raw.replace(/[+-]/g, "");
  return `${sign}${amount}`;
};

export const formatDateTime = (isoDate: string): string => {
  if (!isoDate) return "-";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(ARABIC_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
