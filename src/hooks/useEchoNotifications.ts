"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { getEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { subscribeConsultationEvents } from "@/services/echo/subscribeConsultationEvents";
import { subscribeAccountEvents } from "@/services/echo/subscribeAccountEvents";
import { subscribeSystemEvents } from "@/services/echo/subscribeSystemEvents";
import { useEventDeduplicator } from "@/utils/createEventDeduplicator";

export const useEchoNotifications = (): void => {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

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
    console.debug(`[EchoDebug][${instanceIdRef.current}] session-status-change`, {
      timestamp: new Date().toISOString(),
      status,
      userId: session?.user?.id,
      role: session?.user?.type_account || session?.role,
      hasAccessToken: !!session?.accessToken,
    });
  }, [status, session?.user?.id, session?.user?.type_account, session?.role, session?.accessToken]);

  useEffect(() => {
    const instanceId = instanceIdRef.current;
    console.debug(`[EchoDebug][${instanceIdRef.current}] effect-start`, {
      timestamp: new Date().toISOString(),
      status,
      userId: session?.user?.id,
      role: session?.user?.type_account || session?.role,
      path: pathnameRef.current,
      dedupScope,
    });

    if (status === "loading") {
      console.log("⏳ الجلسة قيد التحميل - تخطي التهيئة مؤقتاً");
      console.debug(`[EchoDebug][${instanceIdRef.current}] effect-end-loading`, {
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (status === "unauthenticated" || !session?.accessToken || !session?.user?.id) {
      console.log("🧹 جلسة غير مصادق عليها - تنظيف الإشعارات");
      lastIdentityRef.current = null;
      clearNotifications();
      deduplicator.clear();
      console.debug(`[EchoDebug][${instanceIdRef.current}] effect-end-unauthenticated`, {
        timestamp: new Date().toISOString(),
      });
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

    console.log("🚀 إعداد Echo للإشعارات:", {
      userId,
      role,
      channelName,
    });

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
    console.log("🧷 [TRACE] Echo subscription ATTACHED", {
      channel: channelName,
      timestamp: new Date().toISOString()
    });
    console.debug(`[EchoDebug][${instanceIdRef.current}] subscribe-channel`, {
      timestamp: new Date().toISOString(),
      userId,
      channelType: "consultation-private",
      channelName,
    });
    console.debug(`[EchoDebug][${instanceIdRef.current}] subscribe-channel`, {
      timestamp: new Date().toISOString(),
      userId,
      channelType: "account-private",
      channelName: `customer.${userId}`,
    });
    console.debug(`[EchoDebug][${instanceIdRef.current}] subscribe-channel`, {
      timestamp: new Date().toISOString(),
      userId,
      channelType: "system-public",
      channelName: "notifications",
    });

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
      router,
      instanceId,
    });

    subscribeSystemEvents({
      publicChannel,
      addNotification,
    });

    return () => {
      console.log("🧹 تنظيف Echo (unmount)");
      console.log("🧹 [TRACE] Echo cleanup executed");
      console.debug(`[EchoDebug][${instanceId}] cleanup-start`, {
        timestamp: new Date().toISOString(),
        userId,
        channelName: channelNameRef.current,
      });
      if (echoRef.current && channelNameRef.current) {
        echoRef.current.leave(channelNameRef.current);
        echoRef.current.leave("notifications");
        echoRef.current.leave(`customer.${userId}`);
        subscribedRef.current = false;
      }
      console.debug(`[EchoDebug][${instanceId}] cleanup-end`, {
        timestamp: new Date().toISOString(),
        userId,
      });
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
  ]);
};
