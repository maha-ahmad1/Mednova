"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { getEcho } from "@/lib/echo";
import { KAWADER_ADMIN_CHANNEL } from "../utils/kawader-constants";
import {
  debugKawader,
  listenToKawaderEvents,
  type KawaderRealtimeContext,
} from "../utils/kawader-realtime";
import type { KawaderTranslator } from "../utils/kawader-notification";

/**
 * Admin side of Kawader realtime: one toast + list/detail refresh per event.
 * Mount once inside the control-panel shell. Uses the shared `getEcho` connection.
 */
export function useKawaderAdminRealtime(): void {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations("kawader");
  const router = useRouter();

  const contextRef = useRef<KawaderRealtimeContext | null>(null);
  useEffect(() => {
    contextRef.current = {
      role: "admin",
      queryClient,
      locale,
      t: t as unknown as KawaderTranslator,
      navigate: (href) => router.push(href),
    };
  }, [queryClient, locale, t, router]);

  const token = session?.accessToken;
  const role = session?.user?.type_account || session?.role;

  useEffect(() => {
    if (status !== "authenticated" || !token || role !== "admin") return;

    const echo = getEcho(token);
    if (!echo) return;

    const channel = echo.private(KAWADER_ADMIN_CHANNEL);
    channel.subscribed(() => debugKawader("subscribed", KAWADER_ADMIN_CHANNEL));
    channel.error((error: unknown) => debugKawader("subscription error", error));

    // Only our listener is removed; the channel itself is not left.
    return listenToKawaderEvents(channel, () => contextRef.current);
  }, [status, token, role]);
}
