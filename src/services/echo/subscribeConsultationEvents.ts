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

const handleConsultationEvent = (
  event: ConsultationEvent,
  eventType: "requested" | "updated",
  params: Omit<SubscribeConsultationEventsParams, "channel" | "setSubscribed" | "channelName">,
) => {
  const eventKey = `${params.userId}_${params.role}_${params.channelLabel}_${eventType}_${event.id}_${event.status}`;

  console.log("📡 EVENT RECEIVED", {
    channel: params.channelLabel,
    source: params.channelSource,
    userId: params.userId,
    role: params.role,
    eventType,
    consultationId: event?.id,
    status: event?.status,
    eventKey,
    rawEvent: event,
  });

  const isNewEvent = params.deduplicator.markIfNew(eventKey);
  console.log("🧠 DEDUP DECISION", {
    eventKey,
    isNewEvent,
    action: isNewEvent ? "processed" : "skipped",
  });

  if (!isNewEvent) {
    console.log("⏭️ EVENT SKIPPED (deduplicated)", { eventKey });
    return;
  }

  const existingRequest = params.requestsRef.current.find((r) => r.id === event.id);

  if (eventType === "requested") {
    if (existingRequest) {
      console.log("⏭️ REQUEST ADD SKIPPED (already exists)", {
        requestId: event.id,
        status: existingRequest.status,
      });
      params.updateRequest(event.id, {
        status: event.status,
        updated_at: event.updated_at || new Date().toISOString(),
        video_room_link: event.video_room_link || existingRequest.video_room_link,
      });
    } else {
      console.log("✅ REQUEST ADDED", { requestId: event.id });
      params.addRequest(createConsultationRequest(event));
    }

    const notification = createConsultationNotification(
      event,
      "consultation_requested",
      "طلب استشارة جديد",
      params.channelSource,
    );

    if (hasExistingNotification(notification)) {
      console.log("⏭️ NOTIFICATION ADD SKIPPED (already exists)", {
        key: buildNotificationKey(notification),
        source: params.channelSource,
      });
    } else {
      console.log("✅ NOTIFICATION PROCESSED", {
        key: buildNotificationKey(notification),
        source: params.channelSource,
      });
      params.addNotification(notification);
    }

    toast.info(event.message, {
      duration: 5000,
      position: "top-center",
    });
  } else if (eventType === "updated") {
    if (!existingRequest) {
      console.log("✅ REQUEST ADDED FROM UPDATE", { requestId: event.id });
      params.addRequest(createConsultationRequest(event));
    } else {
      console.log("✅ REQUEST UPDATED", { requestId: event.id, status: event.status });
      params.updateRequest(event.id, {
        status: event.status,
        updated_at: event.updated_at || new Date().toISOString(),
        video_room_link: event.video_room_link || existingRequest.video_room_link,
        type: event.consultation_type || existingRequest.type,
      });
    }

    let notificationType: Notification["type"] = "consultation_updated";
    let title = "تحديث حالة الاستشارة";

    switch (event.status) {
      case "accepted":
        notificationType = "consultation_accepted";
        title = "تم قبول طلب الاستشارة";
        break;
      case "active":
        notificationType = "consultation_active";
        title = "تم تفعيل الاستشارة";
        break;
      case "completed":
        notificationType = "consultation_completed";
        title = "تم إكمال الاستشارة";
        break;
      case "cancelled":
        notificationType = "consultation_cancelled";
        title = "تم إلغاء الاستشارة";
        break;
    }

    const notification = createConsultationNotification(
      event,
      notificationType,
      title,
      params.channelSource,
    );

    if (hasExistingNotification(notification)) {
      console.log("⏭️ NOTIFICATION ADD SKIPPED (already exists)", {
        key: buildNotificationKey(notification),
        source: params.channelSource,
      });
    } else {
      console.log("✅ NOTIFICATION PROCESSED", {
        key: buildNotificationKey(notification),
        source: params.channelSource,
      });
      params.addNotification(notification);
    }

    toast.info(title, {
      duration: 5000,
      position: "top-center",
    });
  }

  params.deduplicator.removeAfter(eventKey, 10000);
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
      console.log("⏭️ NOTIFICATION ADD SKIPPED (already exists)", {
        key: buildNotificationKey(notification),
        source: params.channelSource,
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
