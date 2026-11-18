import { routing } from "@/i18n/routing";

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

// Accepts only same-origin internal paths (open-redirect guard) and strips any locale
// prefix, because the router from @/i18n/navigation adds the current locale itself.
export function getSafeRedirect(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;
  return value.replace(LOCALE_PREFIX, "") || "/";
}

export function buildLoginHref(redirectTo: string): string {
  const safe = getSafeRedirect(redirectTo);
  return safe ? `/login?redirect=${encodeURIComponent(safe)}` : "/login";
}
