import { KAWADER_NOTIFICATION_PREFIX, KAWADER_STATUSES } from "./kawader-constants";
import type { KawaderStatus } from "../types/kawader";

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

const isKnownStatus = (value: unknown): value is KawaderStatus =>
  typeof value === "string" && (KAWADER_STATUSES as readonly string[]).includes(value);

interface KawaderTextInput {
  role: "patient" | "admin";
  referenceCode?: string;
  requestId?: number;
  status?: string;
  eventType?: string;
}

/**
 * Localized one-liner from reference code + status (+ event type when known).
 * Unknown event types or statuses fall back to a generic "request updated".
 */
export function buildKawaderText(t: KawaderTranslator, input: KawaderTextInput): string {
  const code = input.referenceCode || (input.requestId !== undefined ? `#${input.requestId}` : "");
  const values = { code };

  const keys: string[] = [];
  if (input.eventType && /^[a-z_]+$/.test(input.eventType)) {
    keys.push(`realtime.events.${input.eventType}`);
  }
  if (isKnownStatus(input.status)) {
    keys.push(`realtime.${input.role}.${input.status}`);
  }

  const key = keys.find((candidate) => t.has(candidate));
  return t(key ?? "realtime.updated", values);
}
