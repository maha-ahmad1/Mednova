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

const handleConsultationEvent = (
  event: ConsultationEvent,
  eventType: "requested" | "updated",
  params: Omit<SubscribeConsultationEventsParams, "channel" | "setSubscribed" | "channelName">,
) => {
  const eventKey = `${eventType}_${event.id}_${event.status}`;

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
      params.addRequest(createConsultationRequest(event));
    }

    const notification = createConsultationNotification(
      event,
      "consultation_requested",
      "طلب استشارة جديد",
    );
    params.addNotification(notification);

    toast.info(event.message, {
      duration: 5000,
      position: "top-center",
    });
  } else if (eventType === "updated") {
    if (!existingRequest) {
      console.log("⚠️ طلب غير موجود للتحديث، سيتم إضافه:", event.id);
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
  const baseParams = {
    requestsRef: params.requestsRef,
    addRequest: params.addRequest,
    updateRequest: params.updateRequest,
    addNotification: params.addNotification,
    deduplicator: params.deduplicator,
  };

  params.channel.listen("ConsultationRequestedBroadcast", (event) => {
    handleConsultationEvent(event as ConsultationEvent, "requested", baseParams);
  });

  params.channel.listen("ConsultationUpdatedBroadcast", (event) => {
    handleConsultationEvent(event as ConsultationEvent, "updated", baseParams);
  });

  params.channel.listen("ConsultationMessageBroadcast", (event) => {
    console.log("💬 رسالة جديدة في الاستشارة:", event);
    const notification = createConsultationMessageNotification(
      event as ConsultationMessageEvent,
    );
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
