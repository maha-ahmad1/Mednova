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

const DEFAULT_LOCALIZED_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

/**
 * Locale-aware date formatter used to keep dates consistent across pages
 * (e.g. the consultations list and the consultation details page).
 */
export function formatLocalizedDate(
  isoDate: string | undefined | null,
  locale: string,
  options: Intl.DateTimeFormatOptions = DEFAULT_LOCALIZED_DATE_OPTIONS,
  fallback = "—"
): string {
  if (!isoDate) return fallback;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale, {
    numberingSystem: "latn",
    ...options,
  }).format(date);
}
