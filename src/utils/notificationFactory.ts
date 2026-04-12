import type { Notification } from "@/store/notificationStore";
import type { ConsultationEvent } from "@/services/consultations/consultationFactory";

export type ConsultationMessageEvent = {
  id?: number | string;
  consultation_id: number;
  message_id?: number | string;
  message?: string;
  sender_id?: number;
  created_at?: string;
  [key: string]: unknown;
};

export type SystemNotificationEvent = {
  id?: number | string;
  title?: string;
  message: string;
  level?: string;
  [key: string]: unknown;
};

const simpleHash = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export const createConsultationNotification = (
  event: ConsultationEvent,
  notificationType: Notification["type"],
  title: string,
): Notification => {
  const id = `notif_c_${event.id}_${event.status}`;

  return {
    id,
    type: notificationType,
    title,
    message: event.message,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: {
      logical_key: id,
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

  const messageId = event.message_id ?? event.id ?? simpleHash(msg);
  const id = `notif_cm_${event.consultation_id}_${messageId}`;

  return {
    id,
    type: "consultation_message",
    title: "رسالة جديدة",
    message: msg,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: {
      ...event,
      logical_key: id,
    } as Notification["data"],
  };
};

export const createSystemNotification = (
  event: SystemNotificationEvent,
): Notification => {
  const serverId = event.id;
  const id = serverId
    ? `notif_sys_${serverId}`
    : `notif_sys_${simpleHash(`${event.title ?? ""}|${event.message}`)}`;

  return {
    id,
    type: "system",
    title: event.title || "إشعار نظام",
    message: event.message,
    read: false,
    createdAt: new Date().toISOString(),
    source: "pusher",
    data: {
      ...event,
      logical_key: id,
    } as Notification["data"],
  };
};

export const createAccountStatusNotification = (event: {
  user_id?: number | string;
  status: string;
  reason?: string;
  message?: string;
}): Notification => {
  const userId = event.user_id ?? "unknown";
  const id = `notif_acc_${userId}_${event.status}`;

  return {
    id,
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
    data: {
      ...event,
      logical_key: id,
    },
  };
};
