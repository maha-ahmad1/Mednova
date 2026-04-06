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
  const { data: session, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  const addRequest = useConsultationStore((state) => state.addRequest);
  const updateRequest = useConsultationStore((state) => state.updateRequest);
  const requests = useConsultationStore((state) => state.requests);
  const addNotification = useNotificationStore((state) => state.addNotification);

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
  const deduplicator = useEventDeduplicator();

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) {
      console.log("⏳ انتظار بيانات الجلسة...");
      return;
    }

    const userId = session.user.id;
    const role = session.user.type_account || session.role;

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

    const consultationChannelSource =
      role === "patient"
        ? "pusher-patient"
        : role === "therapist" || role === "rehabilitation_center"
          ? "pusher"
          : "pusher";
    const consultationChannelLabel = role === "patient" ? "patient" : "consultant";

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
      channelSource: consultationChannelSource,
      channelLabel: consultationChannelLabel,
    });

    subscribeAccountEvents({
      accountChannel,
      userId,
      addNotification,
      updateSession: update,
      sessionUser: session?.user,
      router,
    });

    subscribeSystemEvents({
      publicChannel,
      addNotification,
    });

    return () => {
      console.log("🧹 تنظيف Echo (unmount)");
      if (echoRef.current && channelNameRef.current) {
        echoRef.current.leave(channelNameRef.current);
        echoRef.current.leave("notifications");
        echoRef.current.leave(`customer.${userId}`);
        subscribedRef.current = false;
        deduplicator.clear();
      }
    };
  }, [
    session,
    addRequest,
    updateRequest,
    addNotification,
    router,
    update,
    deduplicator,
  ]);
};
