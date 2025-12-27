import { Notification, NotificationType, ApiNotification, ApiResponse, NotificationsPageResult } from '../types';


export const mapApiTypeToNotificationType = (type: string): NotificationType => {
  const typeMap: Record<string, NotificationType> = {
    'MESSAGE': 'message',
    'COMMENT': 'comment',
    'LIKE': 'like',
    'FOLLOW': 'follow',
    'SYSTEM': 'system',
    'ALERT': 'alert',
  };
  
  return typeMap[type.toUpperCase()] || 'system';
};

export const getNotificationTitle = (type: string): string => {
  const titleMap: Record<string, string> = {
    'MESSAGE': 'رسالة جديدة',
    'COMMENT': 'تعليق جديد',
    'LIKE': 'إعجاب جديد',
    'FOLLOW': 'متابعة جديدة',
    'SYSTEM': 'إشعار نظام',
    'ALERT': 'تنبيه',
  };
  
  return titleMap[type.toUpperCase()] || 'إشعار ';
};

export const mapApiNotificationToNotification = (
  apiNotif: ApiNotification
): Notification => ({
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
});

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