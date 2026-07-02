import type { Notification } from '../types';

export type NotificationAction =
  | { kind: 'external'; href: string }
  | { kind: 'internal'; href: string }
  | { kind: 'none' };

export const resolveNotificationAction = (notification: Notification): NotificationAction => {
  const data = notification.data as Record<string, unknown>;

  if (notification.type === 'consultation_active') {
    const videoRoomLink = typeof data.video_room_link === 'string' ? data.video_room_link : undefined;
    if (videoRoomLink) return { kind: 'external', href: videoRoomLink };
  }

  const consultationId = typeof data.consultation_id === 'number' ? data.consultation_id : undefined;
  if (consultationId !== undefined) {
    return { kind: 'internal', href: `/consultations/${consultationId}` };
  }

  return { kind: 'none' };
};
