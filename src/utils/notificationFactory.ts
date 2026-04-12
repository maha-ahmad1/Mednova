import type { Notification } from "@/store/notificationStore";
import type { ConsultationEvent } from "@/services/consultations/consultationFactory";

export type ConsultationMessageEvent = {
  consultation_id: number;
  message?: string;
  sender_id?: number;
  created_at?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type SystemNotificationEvent = {
  title?: string;
  message: string;
  level?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: unknown;
};

const normalizeCreatedAt = (value?: string): string => {
  const parsed = new Date(value || new Date().toISOString());
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const resolveConsultationNotificationType = (
  event: ConsultationEvent,
  notificationType: Notification["type"],
): Notification["type"] => {
  if (event.status === "accepted") {
    return "consultation_accepted";
  }

  if (event.status === "active") {
    return "consultation_active";
  }

  if (event.status === "completed") {
    return "consultation_completed";
  }

  if (event.status === "cancelled") {
    return "consultation_cancelled";
  }

  return notificationType;
};

export const createConsultationNotification = (
  event: ConsultationEvent,
  notificationType: Notification["type"],
  title: string,
  source: Notification["source"] = "pusher",
): Notification => {
  const resolvedType = resolveConsultationNotificationType(event, notificationType);

  return {
    id: `consultation_${event.id}_${resolvedType}_${Date.now()}`,
    type: resolvedType,
    title,
    message: event.message,
    read: false,
    createdAt: normalizeCreatedAt(event.created_at || event.updated_at),
    source,
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
  source: Notification["source"] = "pusher",
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
    createdAt: normalizeCreatedAt(event.created_at || event.createdAt),
    source,
    data: event as Notification["data"],
  };
};

export const createSystemNotification = (
  event: SystemNotificationEvent,
  source: Notification["source"] = "pusher-system",
): Notification => {
  return {
    id: `system_${Date.now()}`,
    type: "system",
    title: event.title || "إشعار نظام",
    message: event.message,
    read: false,
    createdAt: normalizeCreatedAt(event.created_at || event.createdAt),
    source,
    data: event as Notification["data"],
  };
};

export const createAccountStatusNotification = (
  event: {
    status: string;
    reason?: string;
    message?: string;
    created_at?: string;
    createdAt?: string;
  },
  source: Notification["source"] = "pusher-customer",
): Notification => {
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
    createdAt: normalizeCreatedAt(event.created_at || event.createdAt),
    source,
    data: event,
  };
};
