import axios, { type AxiosError } from "axios";
import { toast } from "sonner";
import { handleBackendFormError } from "@/lib/backendFormErrors";

type Translate = (key: string) => string;
type KawaderErrorBody = { message?: string; data?: unknown };
export type KawaderFieldErrors = Record<string, string>;

const firstMessage = (value: unknown): string | undefined => {
  if (typeof value === "string") return value || undefined;
  if (Array.isArray(value)) return value.map(String).find(Boolean);
  return undefined;
};

// The doc promises one string per field, but arrays (Laravel default) are tolerated.
const toFieldErrors = (data: object): KawaderFieldErrors => {
  const fieldErrors: KawaderFieldErrors = {};
  for (const [field, value] of Object.entries(data)) {
    const message = firstMessage(value);
    if (message) fieldErrors[field] = message;
  }
  return fieldErrors;
};

/** A 422 that is a business rule (`data` is `[]` or `{}`), e.g. a transition that is no longer allowed. */
export function isKawaderBusinessRuleError(error: unknown): boolean {
  if (!axios.isAxiosError(error) || error.response?.status !== 422) return false;
  const data = (error.response.data as KawaderErrorBody | undefined)?.data;
  if (Array.isArray(data)) return true;
  return Boolean(data) && typeof data === "object" && Object.keys(toFieldErrors(data as object)).length === 0;
}

/**
 * Kawader-specific error handling. `t` is passed in (not a hook) so this stays a plain
 * function; callers get it from `useTranslations()` and pass it through.
 *
 * - 422 + `data` object with fields  -> `onValidationError(fields)` (no toast); without a callback
 *   it falls back to the global handler, which toasts a summary.
 * - 422 + `data` empty array/object  -> business rule, toast the API `message`.
 * - 429                              -> "too many requests" toast.
 * - anything else                    -> global `handleBackendFormError`.
 */
export function handleKawaderError(
  error: unknown,
  t: Translate,
  onValidationError?: (errors: KawaderFieldErrors) => void,
) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<KawaderErrorBody>;
    const status = axiosError.response?.status;
    const body = axiosError.response?.data;

    if (status === 422 && body) {
      const data = body.data;

      if (data && typeof data === "object" && !Array.isArray(data)) {
        const fieldErrors = toFieldErrors(data);

        if (Object.keys(fieldErrors).length > 0) {
          if (onValidationError) {
            onValidationError(fieldErrors);
            return;
          }
          handleBackendFormError(error as AxiosError<{ message?: string; data?: Record<string, unknown> }>);
          return;
        }
      }

      if ((Array.isArray(data) || (data && typeof data === "object")) && body.message) {
        toast.error(body.message);
        return;
      }
    }

    if (status === 429) {
      toast.error(t("kawader.errors.tooManyRequests"));
      return;
    }
  }

  handleBackendFormError(error as AxiosError<{ message?: string; data?: Record<string, unknown> }>);
}
