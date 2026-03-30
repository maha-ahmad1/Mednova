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

export const buildConsultationDedupKey = ({
  type,
  consultationId,
  status,
}: {
  type: string;
  consultationId: number | string;
  status: string;
}): string => {
  return `${type}:${consultationId}:${status}`;
};

export const createConsultationNotification = (
  event: ConsultationEvent,
  notificationType: Notification["type"],
  title: string,
): Notification => {
  const consultationId = event.id;
  const status = event.status;
  const dedupeKey = buildConsultationDedupKey({
    type: notificationType,
    consultationId,
    status,
  });

  return {
    id: dedupeKey,
    type: notificationType,
    title,
    message: event.message,
    read: false,
    createdAt: new Date().toISOString(),
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
};

export const createConsultationMessageNotification = (
  event: ConsultationMessageEvent,
): Notification => {
  const msg =
    typeof event.message === "string" && event.message.length > 0
      ? event.message
      : "لديك رسالة جديدة في الاستشارة";

  return {
    id: `message_${event.consultation_id}_${Date.now()}`,
    type: "consultation_message",
    title: "رسالة جديدة",
    message: msg,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: event as Notification["data"],
  };
};

export const createSystemNotification = (
  event: SystemNotificationEvent,
): Notification => {
  return {
    id: `system_${Date.now()}`,
    type: "system",
    title: event.title || "إشعار نظام",
    message: event.message,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: event as Notification["data"],
  };
};

export const createAccountStatusNotification = (event: {
  status: string;
  reason?: string;
  message?: string;
}): Notification => {
  return {
    id: `account_${event.status}_${Date.now()}`,
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
};
