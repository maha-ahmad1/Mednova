import { Notification, NotificationType, ApiNotification, ApiResponse, NotificationsPageResult } from '../types';
import { getNotificationTitleByType } from "../utils/notificationTitles";


const KNOWN_NOTIFICATION_TYPES = new Set<string>([
  'consultation_requested',
  'consultation_accepted',
  'consultation_active',
  'consultation_cancelled',
  'consultation_cancelled_by_consultant',
  'consultation_cancelled_by_patient',
  'consultation_completed',
  'consultation_updated',
  'account_approved',
  'account_rejected',
  'message',
  'comment',
  'like',
  'follow',
  'system',
  'alert',
]);

export const mapApiTypeToNotificationType = (type: string): NotificationType => {
  const normalized = type.trim().toLowerCase();
  return KNOWN_NOTIFICATION_TYPES.has(normalized)
    ? (normalized as NotificationType)
    : 'system';
};

export const getNotificationTitle = (type: string): string => {
  return getNotificationTitleByType(type);
};

export const mapApiNotificationToNotification = (
  apiNotif: ApiNotification
): Notification => {
  const mapped: Notification = {
    id: `api_${apiNotif.id}`,
    type: mapApiTypeToNotificationType(apiNotif.type),
    title: getNotificationTitle(apiNotif.type),
    message: (() => {
      const maybeMessage = (apiNotif.data as Record<string, unknown> | undefined)?.message;
      if (typeof maybeMessage === 'string') return maybeMessage;
      if (maybeMessage == null) return 'بدون رسالة';
      return String(maybeMessage);
    })(),
    data: (apiNotif.data as Record<string, unknown>) || {},
    read: !!apiNotif.read_at,
    createdAt: apiNotif.created_at || String(apiNotif.id),
    source: 'api',
  };

  console.log("🧪 [TRACE][Notifications][API Mapper][api/mapper.mapApiNotificationToNotification]", {
    timestamp: new Date().toISOString(),
    raw: apiNotif,
    mapped,
  });

  return mapped;
};

export const mapApiResponseToNotifications = (
  apiResponse: ApiNotification[]
): Notification[] => {
  return apiResponse.map(mapApiNotificationToNotification);
};

export const mapApiResponseToNotificationsPage = (
  apiResponse: ApiResponse<{
    notification: ApiNotification[];
    next_cursor?: string;
  }>
): NotificationsPageResult => ({
  notifications: mapApiResponseToNotifications(apiResponse.data.notification || []),
  nextCursor: apiResponse.data.next_cursor || null,
});
