"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import {
  listenToKawaderEvents,
  type KawaderRealtimeContext,
} from "@/features/kawader/utils/kawader-realtime";
import type { KawaderTranslator } from "@/features/kawader/utils/kawader-notification";
import { getEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { subscribeConsultationEvents } from "@/services/echo/subscribeConsultationEvents";
import { subscribeAccountEvents } from "@/services/echo/subscribeAccountEvents";
import { subscribeSystemEvents } from "@/services/echo/subscribeSystemEvents";
import { subscribeMeasurementEvents } from "@/services/echo/subscribeMeasurementEvents";
import { subscribeProgramReviewEvents } from "@/services/echo/subscribeProgramReviewEvents";
import { useEventDeduplicator } from "@/hooks/useEventDeduplicator";

export const useEchoNotifications = (): void => {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const t = useTranslations("accountStatus");
  const tRoot = useTranslations();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const tKawader = useTranslations("kawader");
  const localeRouter = useLocaleRouter();

  // Read by the Kawader listener on every event, so the main effect below does not
  // need locale/translator/router as dependencies (it would re-subscribe on each change).
  const kawaderContextRef = useRef<KawaderRealtimeContext | null>(null);
  useEffect(() => {
    kawaderContextRef.current = {
      role: "patient",
      queryClient,
      locale,
      t: tKawader as unknown as KawaderTranslator,
      userId: session?.user?.id,
      navigate: (href) => localeRouter.push(href),
    };
  }, [queryClient, locale, tKawader, localeRouter, session?.user?.id]);

  const addRequest = useConsultationStore((state) => state.addRequest);
  const updateRequest = useConsultationStore((state) => state.updateRequest);
  const requests = useConsultationStore((state) => state.requests);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const clearNotifications = useNotificationStore((state) => state.clearNotifications);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const requestsRef = useRef(requests);
  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const echoRef = useRef<ReturnType<typeof getEcho> | null>(null);
  const subscribedRef = useRef(false);
  const channelNameRef = useRef<string>("");
  const dedupScope = session?.user?.id && (session.user.type_account || session.role)
    ? `${session.user.id}:${session.user.type_account || session.role}`
    : "anonymous";
  const deduplicator = useEventDeduplicator(dedupScope);
  const lastIdentityRef = useRef<string | null>(null);
  const instanceIdRef = useRef<string>(
    `echo-hook-${Math.random().toString(36).slice(2, 10)}`
  );

  useEffect(() => {
    const instanceId = instanceIdRef.current;

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session?.accessToken || !session?.user?.id) {
      lastIdentityRef.current = null;
      clearNotifications();
      deduplicator.clear();
      return;
    }

    const userId = session.user.id;
    const role = session.user.type_account || session.role;
    const identityKey = `${userId}:${role}`;

    if (lastIdentityRef.current && lastIdentityRef.current !== identityKey) {
      clearNotifications();
      deduplicator.clear();
    }
    lastIdentityRef.current = identityKey;

    let channelName = "";
    if (role === "patient") {
      channelName = `patient.${userId}`;
    } else if (role === "therapist" || role === "rehabilitation_center") {
      channelName = `consultant.${userId}`;
    } else if (role === "admin") {
      return;
    } else {
      console.error("❌ نوع حساب غير معروف:", role);
      return;
    }

    if (echoRef.current && channelNameRef.current) {
      echoRef.current.leave(channelNameRef.current);
      subscribedRef.current = false;
    }

    const echo = getEcho(session.accessToken);
    echoRef.current = echo;
    channelNameRef.current = channelName;

    const channel = echo.private(channelName);
    const accountChannel = echo.private(`customer.${userId}`);
    const publicChannel = echo.channel("notifications");

    subscribeConsultationEvents({
      channel,
      requestsRef,
      addRequest,
      updateRequest,
      addNotification,
      setSubscribed: (value) => {
        subscribedRef.current = value;
      },
      channelName,
      deduplicator,
    });

    subscribeAccountEvents({
      accountChannel,
      userId,
      addNotification,
      updateSession: update,
      sessionUser: session?.user,
      t,
      instanceId,
    });

    subscribeSystemEvents({
      publicChannel,
      addNotification,
    });

    subscribeMeasurementEvents({
      channel,
      role: role as "patient" | "therapist" | "rehabilitation_center",
      queryClient,
      addNotification,
      t: tRoot,
    });

    if (role === "therapist" || role === "rehabilitation_center") {
      subscribeProgramReviewEvents({
        channel,
        queryClient,
        addNotification,
      });
    }

    // Kawader events arrive on the patient's customer.{id} channel (same object as above).
    const stopKawaderListener =
      role === "patient"
        ? listenToKawaderEvents(accountChannel, () => kawaderContextRef.current)
        : undefined;

    return () => {
      stopKawaderListener?.();
      if (echoRef.current && channelNameRef.current) {
        echoRef.current.leave(channelNameRef.current);
        echoRef.current.leave("notifications");
        echoRef.current.leave(`customer.${userId}`);
        subscribedRef.current = false;
      }
    };
  }, [
    session,
    addRequest,
    updateRequest,
    addNotification,
    clearNotifications,
    dedupScope,
    router,
    status,
    update,
    deduplicator,
    t,
    tRoot,
    queryClient,
  ]);
};
