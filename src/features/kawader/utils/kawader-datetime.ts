const FALLBACK_TIMEZONE = "Asia/Muscat";

const pad = (value: number) => String(value).padStart(2, "0");

/** "YYYY-MM-DD HH:mm" in the browser's local time — the format P2 expects for `preferred_at`. */
export function toApiLocalDateTime(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** IANA timezone of the user's browser, e.g. "Asia/Muscat". */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIMEZONE;
  } catch {
    return FALLBACK_TIMEZONE;
  }
}

// Latin digits (0-9) in Arabic too, like `formatLocalizedDate` and the money/phone/reference
// values on these screens. A bare "ar" falls back to the browser's default numbering system.
const toIntlLocale = (locale: string) => (locale === "ar" ? "ar-u-nu-latn" : locale);

/** Formats a UTC ISO string in the active locale and the user's timezone. Returns "" if invalid. */
export function formatKawaderDate(
  iso: string | null | undefined,
  locale: string,
  timeZone: string = getUserTimezone(),
): string {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(date);
}
