import type { Notification } from "@/store/notificationStore";
import type { ConsultationEvent } from "@/services/consultations/consultationFactory";

export type ConsultationMessageEvent = {
  consultation_id: number;
  message?: string;
  sender_id?: number;
  created_at?: string;
  [key: string]: unknown;
};

export type SystemNotificationEvent = {
  title?: string;
  message: string;
  level?: string;
  [key: string]: unknown;
};

export const createConsultationNotification = (
  event: ConsultationEvent,
  notificationType: Notification["type"],
  title: string,
): Notification => {
  const eventTimestamp = event.updated_at || event.created_at || "no-ts";
  const serverCreatedAt = event.created_at || event.updated_at || new Date().toISOString();
  const mapped: Notification = {
    id: `consultation_${event.id}_${notificationType}_${event.status}_${eventTimestamp}`,
    type: notificationType,
    title,
    message: event.message,
    read: false,
    createdAt: serverCreatedAt,
    source: "pusher",
    data: {
      consultation_id: event.id,
      patient_id: event.patient_id,
      patient_name: event.patient_name,
      consultant_id: event.consultant_id,
      consultant_name: event.consultant_name,
      consultant_type: event.consultant_type,
      consultation_type: event.consultation_type,
      status: event.status,
      video_room_link: event.video_room_link,
    },
  };
  console.log("🧪 [TRACE][Notifications][Pusher Factory][createConsultationNotification]", {
    timestamp: new Date().toISOString(),
    rawEvent: event,
    mappedNotification: mapped,
  });
  return mapped;
};

export const createConsultationMessageNotification = (
  event: ConsultationMessageEvent,
): Notification => {
  const msg =
    typeof event.message === "string" && event.message.length > 0
      ? event.message
      : "لديك رسالة جديدة في الاستشارة";

  const eventTimestamp = event.created_at || "no-ts";
  const mapped: Notification = {
    id: `message_${event.consultation_id}_${event.sender_id || "unknown"}_${eventTimestamp}`,
    type: "consultation_message",
    title: "رسالة جديدة",
    message: msg,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: event as Notification["data"],
  };
  console.log("🧪 [TRACE][Notifications][Pusher Factory][createConsultationMessageNotification]", {
    timestamp: new Date().toISOString(),
    rawEvent: event,
    mappedNotification: mapped,
  });
  return mapped;
};

export const createSystemNotification = (
  event: SystemNotificationEvent,
): Notification => {
  const normalizedMessage = event.message?.trim() || "no-message";
  const mapped: Notification = {
    id: `system_${normalizedMessage.slice(0, 64)}`,
    type: "system",
    title: event.title || "إشعار نظام",
    message: event.message,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: event as Notification["data"],
  };
  console.log("🧪 [TRACE][Notifications][Pusher Factory][createSystemNotification]", {
    timestamp: new Date().toISOString(),
    rawEvent: event,
    mappedNotification: mapped,
  });
  return mapped;
};

export const createAccountStatusNotification = (event: {
  status: string;
  reason?: string;
  message?: string;
}): Notification => {
  const normalizedReason = event.reason?.trim() || "no-reason";
  const mapped: Notification = {
    id: `account_${event.status}_${normalizedReason.slice(0, 64)}`,
    type: event.status === "approved" ? "account_approved" : "account_rejected",
    title: event.status === "approved" ? "تم قبول حسابك" : "تم رفض حسابك",
    message:
      event.message ||
      (event.status === "approved"
        ? "تهانينا! تم قبول حسابك"
        : "نأسف، لم يتم قبول حسابك"),
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: event,
  };
  console.log("🧪 [TRACE][Notifications][Pusher Factory][createAccountStatusNotification]", {
    timestamp: new Date().toISOString(),
    rawEvent: event,
    mappedNotification: mapped,
  });
  return mapped;
};
