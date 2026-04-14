import type { MutableRefObject } from "react";
import { toast } from "sonner";
import type { Notification } from "@/store/notificationStore";
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
  deduplicator: {
    markIfNew: (key: string) => boolean;
    removeAfter: (key: string, delayMs: number) => void;
  };
}

const consultationEventCounters = new Map<string, number>();
const rawPayloadPrinted = new Set<string>();

const incrementConsultationCounter = (channelName: string, eventType: string): number => {
  const counterKey = `${channelName}:${eventType}`;
  const next = (consultationEventCounters.get(counterKey) || 0) + 1;
  consultationEventCounters.set(counterKey, next);
  return next;
};

const handleConsultationEvent = (
  event: ConsultationEvent,
  eventType: "requested" | "updated",
  params: Omit<SubscribeConsultationEventsParams, "channel" | "setSubscribed">,
) => {
  const counter = incrementConsultationCounter(params.channelName, eventType);
  const payload = event as unknown as Record<string, unknown>;
  console.log("🧪 [TRACE][ConsultationEvent] incoming", {
    timestamp: new Date().toISOString(),
    channelName: params.channelName,
    localCounter: counter,
    eventType,
    id: event.id,
    status: event.status,
    type: payload.type ?? event.consultation_type,
    consultation_type: event.consultation_type,
    created_at: event.created_at,
    updated_at: event.updated_at,
    uuid: payload.uuid,
    broadcast_id: payload.broadcast_id,
    event_uuid: payload.event_uuid,
    notification_id: payload.notification_id,
  });

  const rawPayloadKey = `${params.channelName}:${eventType}:${event.id}`;
  if (params.channelName.startsWith("patient.") && !rawPayloadPrinted.has(rawPayloadKey)) {
    rawPayloadPrinted.add(rawPayloadKey);
    console.log("🧪 [TRACE][ConsultationEvent] raw-payload (patient once)", {
      timestamp: new Date().toISOString(),
      channelName: params.channelName,
      eventType,
      localCounter: counter,
      payload: event,
    });
  }

  const eventTimestamp = event.updated_at || event.created_at || "no-ts";
  const eventKey = `consultation:${eventType}:${event.id}:${event.status}:${eventTimestamp}`;
  const debugTimestamp = new Date().toISOString();

  if (!params.deduplicator.markIfNew(eventKey)) {
    return;
  }

  console.log(`📨 استقبال حدث ${eventType}:`, {
    id: event.id,
    status: event.status,
    type: event.consultation_type,
    eventType,
  });

  const existingRequest = params.requestsRef.current.find((r) => r.id === event.id);

  if (eventType === "requested") {
    if (existingRequest) {
      console.log("📝 تحديث طلب موجود:", event.id);
      params.updateRequest(event.id, {
        status: event.status,
        updated_at: event.updated_at || new Date().toISOString(),
        video_room_link: event.video_room_link || existingRequest.video_room_link,
      });
    } else {
      console.log("➕ إضافة طلب جديد:", event.id);
      console.log("🔥 [TRACE] addRequest CALLED FROM EVENT", {
        event,
        timestamp: new Date().toISOString()
      });
      console.trace("CALL STACK");
      params.addRequest(createConsultationRequest(event));
    }

    const notification = createConsultationNotification(
      event,
      "consultation_requested",
      "طلب استشارة جديد",
    );
    console.debug("[EchoDebug][Consultation] addNotification", {
      timestamp: debugTimestamp,
      eventType,
      consultationId: event.id,
      userId: event.patient_id,
      eventKey,
      notificationId: notification.id,
    });
    params.addNotification(notification);

    toast.info(event.message, {
      duration: 5000,
      position: "top-center",
    });
  } else if (eventType === "updated") {
    if (!existingRequest) {
      console.log("⚠️ طلب غير موجود للتحديث، سيتم إضافه:", event.id);
      console.log("🔥 [TRACE] addRequest CALLED FROM EVENT", {
        event,
        timestamp: new Date().toISOString()
      });
      console.trace("CALL STACK");
      params.addRequest(createConsultationRequest(event));
    } else {
      console.log("🔄 تحديث طلب موجود:", event.id);
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

    const notification = createConsultationNotification(event, notificationType, title);
    console.debug("[EchoDebug][Consultation] addNotification", {
      timestamp: debugTimestamp,
      eventType,
      consultationId: event.id,
      userId: event.patient_id,
      eventKey,
      notificationId: notification.id,
    });
    params.addNotification(notification);

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
  console.debug("[EchoDebug][Consultation] attach-listener", {
    timestamp: new Date().toISOString(),
    eventType: "ConsultationRequestedBroadcast",
    channelName: params.channelName,
  });
  const baseParams = {
    requestsRef: params.requestsRef,
    addRequest: params.addRequest,
    updateRequest: params.updateRequest,
    addNotification: params.addNotification,
    deduplicator: params.deduplicator,
    channelName: params.channelName,
  };

  params.channel.listen("ConsultationRequestedBroadcast", (event) => {
    handleConsultationEvent(event as ConsultationEvent, "requested", baseParams);
  });

  console.debug("[EchoDebug][Consultation] attach-listener", {
    timestamp: new Date().toISOString(),
    eventType: "ConsultationUpdatedBroadcast",
    channelName: params.channelName,
  });
  params.channel.listen("ConsultationUpdatedBroadcast", (event) => {
    handleConsultationEvent(event as ConsultationEvent, "updated", baseParams);
  });

  console.debug("[EchoDebug][Consultation] attach-listener", {
    timestamp: new Date().toISOString(),
    eventType: "ConsultationMessageBroadcast",
    channelName: params.channelName,
  });
  params.channel.listen("ConsultationMessageBroadcast", (event) => {
    console.log("💬 رسالة جديدة في الاستشارة:", event);
    const notification = createConsultationMessageNotification(
      event as ConsultationMessageEvent,
    );
    const messageEvent = event as ConsultationMessageEvent;
    console.debug("[EchoDebug][Consultation] addNotification", {
      timestamp: new Date().toISOString(),
      eventType: "message",
      consultationId: messageEvent.consultation_id,
      userId: messageEvent.sender_id,
      notificationId: notification.id,
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
