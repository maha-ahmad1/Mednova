const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export function formatDate(
  isoDate: string | undefined | null,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
  fallback = "قبل لحظات"
): string {
  if (!isoDate) return fallback;
  return new Date(isoDate).toLocaleDateString(
    locale ?? "ar-OM",
    options ?? DEFAULT_DATE_OPTIONS
  );
}

export function formatShortDate(isoDate: string | undefined | null): string {
  return formatDate(isoDate, { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function formatFullDate(isoDate: string | undefined | null): string {
  return formatDate(isoDate, { year: "numeric", month: "long", day: "numeric" });
}
