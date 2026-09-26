import type { Notification } from "@/store/notificationStore";
import type { ConsultationEvent } from "@/services/consultations/consultationFactory";
import type { MeasurementOutcome } from "@/features/measurements/utils/mapSessionOutcome";
import type {
  MeasurementEndedEventConsultant,
  MeasurementEndedEventPatient,
} from "@/features/measurements/types";

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

// `body` is our own translated copy for {outcome, role} — never the backend's
// raw `event.message`, which is hardcoded English and not fit for a bilingual app.
export const createMeasurementNotification = (
  event: MeasurementEndedEventPatient | MeasurementEndedEventConsultant,
  outcome: MeasurementOutcome,
  body: string,
): Notification => {
  const mapped: Notification = {
    id: `measurement_${event.measurement_id}_${outcome.key}`,
    type: `measurement_${outcome.key}` as Notification["type"],
    title: body,
    message: body,
    read: false,
    createdAt: event.completed_at,
    source: "pusher",
    data: {
      consultation_id: event.consultation_id,
      consultation_type: event.consultation_type,
      measurement_id: event.measurement_id,
      exercise_type: event.exercise_type,
      status: event.status,
      end_reason: event.end_reason,
      needs_elevated_attention: outcome.needsElevatedAttention,
    },
  };
  console.log("🧪 [TRACE][Notifications][Pusher Factory][createMeasurementNotification]", {
    timestamp: new Date().toISOString(),
    rawEvent: event,
    mappedNotification: mapped,
  });
  return mapped;
};

export const createAccountStatusNotification = (
  event: {
    status: string;
    reason?: string;
    message?: string;
  },
  title: string,
  message: string,
): Notification => {
  const normalizedReason = event.reason?.trim() || "no-reason";
  const mapped: Notification = {
    id: `account_${event.status}_${normalizedReason.slice(0, 64)}`,
    type: event.status === "approved" ? "account_approved" : "account_rejected",
    title,
    message,
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
