import type { MutableRefObject } from "react";
import { toast } from "sonner";
import type { Notification } from "@/store/notificationStore";
import { useNotificationStore } from "@/store/notificationStore";
import {
  createConsultationMessageNotification,
  createConsultationNotification,
  type ConsultationMessageEvent,
} from "@/utils/notificationFactory";
import {
  createConsultationRequest,
  type ConsultationEvent,
} from "@/services/consultations/consultationFactory";
import type { ConsultationRequest } from "@/types/consultation";

interface SubscribeConsultationEventsParams {
  channel: {
    listen: (event: string, callback: (payload: unknown) => void) => void;
    subscribed: (callback: () => void) => void;
    error: (callback: (error: unknown) => void) => void;
  };
  requestsRef: MutableRefObject<ConsultationRequest[]>;
  addRequest: (request: ConsultationRequest) => void;
  updateRequest: (id: number, payload: Partial<ConsultationRequest>) => void;
  addNotification: (notification: Notification) => void;
  setSubscribed: (value: boolean) => void;
  channelName: string;
  userId: number | string;
  role: string;
  deduplicator: {
    markIfNew: (key: string, ttlMs?: number) => boolean;
    removeAfter: (key: string, delayMs: number) => void;
  };
  channelSource: Notification["source"];
  channelLabel: "patient" | "consultant";
}

type EventGuardResult = {
  shouldProcess: boolean;
  eventKey: string;
  reason: string;
};

const buildNotificationKey = (notification: Notification): string => {
  const consultationId = (notification.data as { consultation_id?: number })?.consultation_id;
  return consultationId != null
    ? `${notification.type}_${consultationId}`
    : `${notification.type}_${notification.id}`;
};

const hasExistingNotification = (notification: Notification): boolean => {
  const candidateKey = buildNotificationKey(notification);
  return useNotificationStore
    .getState()
    .notifications.some((existing) => buildNotificationKey(existing) === candidateKey);
};

const evaluateEventGuard = (
  params: Omit<SubscribeConsultationEventsParams, "channel" | "setSubscribed" | "channelName">,
  event: ConsultationEvent,
  eventType: "requested" | "updated",
  notification: Notification,
): EventGuardResult => {
  const eventKey = `${params.userId}_${params.role}_${params.channelLabel}_${eventType}_${event.id}_${event.status}`;

  const isNewEvent = params.deduplicator.markIfNew(eventKey);
  if (!isNewEvent) {
    return {
      shouldProcess: false,
      eventKey,
      reason: "deduplicator(memory+storage)",
    };
  }

  const existingRequest = params.requestsRef.current.find((r) => r.id === event.id);
  const hasNotification = hasExistingNotification(notification);

  if (existingRequest && existingRequest.status === event.status && hasNotification) {
    return {
      shouldProcess: false,
      eventKey,
      reason: "request+notification already in store",
    };
  }

  return {
    shouldProcess: true,
    eventKey,
    reason: "new event",
  };
};

const handleConsultationEvent = (
  event: ConsultationEvent,
  eventType: "requested" | "updated",
  params: Omit<SubscribeConsultationEventsParams, "channel" | "setSubscribed" | "channelName">,
) => {
  let notificationType: Notification["type"] =
    eventType === "requested" ? "consultation_requested" : "consultation_updated";
  let title = eventType === "requested" ? "طلب استشارة جديد" : "تحديث حالة الاستشارة";

  if (event.status === "accepted") {
    notificationType = "consultation_accepted";
    title = "تم قبول طلب الاستشارة";
  } else if (event.status === "active") {
    notificationType = "consultation_active";
    title = "تم تفعيل الاستشارة";
  } else if (event.status === "completed") {
    notificationType = "consultation_completed";
    title = "تم إكمال الاستشارة";
  } else if (event.status === "cancelled") {
    notificationType = "consultation_cancelled";
    title = "تم إلغاء الاستشارة";
  }

  const notification = createConsultationNotification(
    event,
    notificationType,
    title,
    params.channelSource,
  );

  console.log("📡 EVENT RECEIVED", {
    channel: params.channelLabel,
    source: params.channelSource,
    userId: params.userId,
    role: params.role,
    eventType,
    consultationId: event?.id,
    status: event?.status,
    rawEvent: event,
  });

  const guard = evaluateEventGuard(params, event, eventType, notification);
  console.log("🧠 DEDUP DECISION", {
    eventKey: guard.eventKey,
    shouldProcess: guard.shouldProcess,
    reason: guard.reason,
  });

  if (!guard.shouldProcess) {
    console.log("⏭️ EVENT SKIPPED", {
      eventKey: guard.eventKey,
      reason: guard.reason,
    });
    return;
  }

  const existingRequest = params.requestsRef.current.find((r) => r.id === event.id);

  if (!existingRequest) {
    console.log("✅ REQUEST PROCESSED (add)", { requestId: event.id });
    params.addRequest(createConsultationRequest(event));
  } else if (event.status !== existingRequest.status || event.video_room_link !== existingRequest.video_room_link) {
    console.log("✅ REQUEST PROCESSED (update)", {
      requestId: event.id,
      fromStatus: existingRequest.status,
      toStatus: event.status,
    });

    params.updateRequest(event.id, {
      status: event.status,
      updated_at: event.updated_at || new Date().toISOString(),
      video_room_link: event.video_room_link || existingRequest.video_room_link,
      type: event.consultation_type || existingRequest.type,
    });
  } else {
    console.log("⏭️ REQUEST MUTATION SKIPPED", {
      requestId: event.id,
      reason: "no meaningful request change",
    });
  }

  if (hasExistingNotification(notification)) {
    console.log("⏭️ NOTIFICATION MUTATION SKIPPED", {
      key: buildNotificationKey(notification),
      reason: "already exists in notification store",
    });
  } else {
    console.log("✅ NOTIFICATION PROCESSED", {
      key: buildNotificationKey(notification),
      source: params.channelSource,
    });
    params.addNotification(notification);
  }

  toast.info(eventType === "requested" ? event.message : title, {
    duration: 5000,
    position: "top-center",
  });

  params.deduplicator.removeAfter(guard.eventKey, 10000);
};

export const subscribeConsultationEvents = (
  params: SubscribeConsultationEventsParams,
): void => {
  const baseParams = {
    requestsRef: params.requestsRef,
    addRequest: params.addRequest,
    updateRequest: params.updateRequest,
    addNotification: params.addNotification,
    deduplicator: params.deduplicator,
    channelSource: params.channelSource,
    channelLabel: params.channelLabel,
    userId: params.userId,
    role: params.role,
  };

  params.channel.listen("ConsultationRequestedBroadcast", (event) => {
    handleConsultationEvent(event as ConsultationEvent, "requested", baseParams);
  });

  params.channel.listen("ConsultationUpdatedBroadcast", (event) => {
    handleConsultationEvent(event as ConsultationEvent, "updated", baseParams);
  });

  params.channel.listen("ConsultationMessageBroadcast", (event) => {
    console.log("📡 EVENT RECEIVED", {
      channel: params.channelLabel,
      source: params.channelSource,
      userId: params.userId,
      role: params.role,
      eventType: "message",
      consultationId: (event as ConsultationMessageEvent)?.consultation_id,
      status: (event as { status?: string })?.status,
      rawEvent: event,
    });

    const notification = createConsultationMessageNotification(
      event as ConsultationMessageEvent,
      params.channelSource,
    );

    if (hasExistingNotification(notification)) {
      console.log("⏭️ NOTIFICATION MUTATION SKIPPED", {
        key: buildNotificationKey(notification),
        reason: "already exists in notification store",
      });
      return;
    }

    console.log("✅ NOTIFICATION PROCESSED", {
      key: buildNotificationKey(notification),
      source: params.channelSource,
    });
    params.addNotification(notification);
  });

  params.channel.subscribed(() => {
    console.log("✅ تم الاشتراك بنجاح في القناة:", params.channelName);
    params.setSubscribed(true);
  });

  params.channel.error((error: unknown) => {
    console.error("❌ خطأ في قناة Pusher:", error);
    params.setSubscribed(false);
  });
};
