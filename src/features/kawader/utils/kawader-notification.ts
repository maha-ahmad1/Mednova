import { KAWADER_NOTIFICATION_PREFIX } from "./kawader-constants";

/** Minimal translator for the `kawader` namespace (keys are looked up dynamically). */
export interface KawaderTranslator {
  (key: string, values?: Record<string, string | number>): string;
  has: (key: string) => boolean;
}

const normalize = (type: string): string => type.trim().toLowerCase();

export const isKawaderNotificationType = (type: string): boolean =>
  normalize(type).startsWith(KAWADER_NOTIFICATION_PREFIX);

/** Kawader rows meant for admins (`kawader_..._admin`); patients must never see these. */
export const isKawaderAdminNotificationType = (type: string): boolean =>
  isKawaderNotificationType(type) && normalize(type).endsWith("_admin");

export const getKawaderRequestId = (data: unknown): number | undefined => {
  const raw = (data as Record<string, unknown> | null | undefined)?.kawader_request_id;
  const id = typeof raw === "string" ? Number(raw) : raw;
  return typeof id === "number" && Number.isFinite(id) ? id : undefined;
};

interface KawaderTextInput {
  referenceCode?: string;
  requestId?: number;
  /** The notification `type` (stored) = `event_type` (broadcast). */
  eventType?: string;
  /**
   * Backend `data.message`. Written in the patient's account locale at send time (always
   * Arabic for admins), so it is only a fallback for a `kawader_*` type we have no wording for.
   */
  message?: unknown;
}

/**
 * Localized one-liner built from the event type, in the current UI language.
 * Unknown `kawader_*` type -> `data.message`; anything else -> generic "request updated".
 */
export function buildKawaderText(t: KawaderTranslator, input: KawaderTextInput): string {
  const code = input.referenceCode || (input.requestId !== undefined ? `#${input.requestId}` : "");
  const values = { reference_code: code };
  const type = input.eventType ? normalize(input.eventType) : "";

  const key = `realtime.events.${type}`;
  if (/^[a-z_]+$/.test(type) && t.has(key)) return t(key, values);

  if (isKawaderNotificationType(type) && typeof input.message === "string" && input.message.trim()) {
    return input.message;
  }
  return t("realtime.updated", values);
}
