import type { QueryClient } from "@tanstack/react-query";
import type { KawaderRealtimePayload } from "../types/kawader";
import { KAWADER_ECHO_EVENT } from "./kawader-constants";
import { buildKawaderText, type KawaderTranslator } from "./kawader-notification";
import { kawaderKeys } from "./kawader-query-keys";
import { showKawaderToast } from "./kawader-toast";

export interface KawaderRealtimeContext {
  role: "patient" | "admin";
  queryClient: QueryClient;
  locale: string;
  t: KawaderTranslator;
  /** Account id; scopes the bell's query keys. Only needed for patients. */
  userId?: string | number;
  /** Locale-aware navigation (from `@/i18n/navigation`). */
  navigate: (href: string) => void;
}

const isDev = process.env.NODE_ENV === "development";

export const debugKawader = (message: string, details?: unknown): void => {
  if (isDev) console.debug(`[EchoDebug][Kawader] ${message}`, details ?? "");
};

const parsePayload = (raw: unknown): KawaderRealtimePayload | null => {
  const payload = raw as Partial<KawaderRealtimePayload> | null | undefined;
  const id = Number(payload?.kawader_request_id);
  if (!payload || !Number.isFinite(id)) return null;
  return { ...payload, kawader_request_id: id } as KawaderRealtimePayload;
};

/**
 * Single entry point for a `kawader.request.status.changed` event: refreshes the
 * affected queries and shows exactly one toast. The notification code only calls this.
 *
 * No `addNotification` on purpose: Pusher items have no `api_` id, so mark-as-read would
 * send NaN. The bell is refreshed by refetching the API list instead.
 */
export function handleKawaderRealtimeEvent(raw: unknown, ctx: KawaderRealtimeContext): void {
  const payload = parsePayload(raw);
  debugKawader("event received", { role: ctx.role, payload: raw });
  if (!payload) return;

  const { queryClient, locale, role, t, navigate, userId } = ctx;
  const id = payload.kawader_request_id;

  if (role === "patient") {
    queryClient.invalidateQueries({ queryKey: [...kawaderKeys.myRequests(locale), "list"] });
    queryClient.invalidateQueries({ queryKey: kawaderKeys.myRequestDetail(locale, id) });
    // Same keys as the bell (useNotificationsDropdownQuery / useNotificationsInfiniteQuery).
    queryClient.invalidateQueries({ queryKey: ["notifications", "dropdown", userId] });
    queryClient.invalidateQueries({ queryKey: ["notifications", "page", userId] });
  } else {
    queryClient.invalidateQueries({ queryKey: [...kawaderKeys.adminRequests(locale), "list"] });
    queryClient.invalidateQueries({ queryKey: kawaderKeys.adminRequestDetail(locale, id) });
  }

  const href = role === "patient" ? `/profile/kawader/${id}` : `/control-panel/kawader/${id}`;
  const text = buildKawaderText(t, {
    referenceCode: payload.reference_code,
    requestId: id,
    eventType: payload.event_type,
    message: payload.message,
  });

  // Fixed id: if the same event were ever delivered twice, sonner updates the toast
  // instead of stacking a second one.
  showKawaderToast(text, {
    id: `kawader-${id}-${payload.status}-${payload.event_type ?? ""}`,
    duration: 6000,
    referenceCode: payload.reference_code,
    locale,
    action: { label: t("realtime.view"), onClick: () => navigate(href) },
  });
}

interface ListenableChannel {
  listen: (event: string, callback: (payload: unknown) => void) => unknown;
  stopListening: (event: string, callback?: (payload: unknown) => void) => unknown;
}

/**
 * Adds the Kawader listener to an already-subscribed Echo channel and returns a cleanup
 * that removes only that listener (the shared channel stays subscribed).
 * `getContext` is read per event so the listener never goes stale after a re-render.
 */
export function listenToKawaderEvents(
  channel: ListenableChannel,
  getContext: () => KawaderRealtimeContext | null,
): () => void {
  const listener = (payload: unknown) => {
    const ctx = getContext();
    if (ctx) handleKawaderRealtimeEvent(payload, ctx);
  };
  channel.listen(KAWADER_ECHO_EVENT, listener);
  debugKawader("listener attached", KAWADER_ECHO_EVENT);

  return () => {
    channel.stopListening(KAWADER_ECHO_EVENT, listener);
    debugKawader("listener removed", KAWADER_ECHO_EVENT);
  };
}
