import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type:
    | 'consultation_requested'
    | 'consultation_updated'
    | 'consultation_accepted'
    | 'consultation_cancelled'
    | 'consultation_active'
    | 'consultation_completed'
    | 'message'
    | 'comment'
    | 'like'
    | 'follow'
    | 'system'
    | 'alert'
    | string;
  title: string;
  message: string;
  data:
    | {
        consultation_id: number;
        patient_id?: number;
        patient_name?: string;
        consultant_id?: number;
        consultant_name?: string;
        consultant_type?: string;
        consultation_type?: 'chat' | 'video';
        status?: string;
        video_room_link?: string;
        updated_at?: string;
      }
    | Record<string, unknown>;
  read: boolean;
  createdAt: string;
  source: 'api' | 'pusher' | 'pusher-patient' | 'pusher-customer' | 'pusher-system' | string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  lastSyncTime: string | null;

  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  getNotifications: () => Notification[];

  syncWithApiNotifications: (apiNotifications: Notification[]) => void;
  updateLastSyncTime: () => void;
}

const normalizeNotificationDate = (value?: string): string => {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
};

const getNotificationKey = (notification: Notification): string => {
  const consultationId = (notification.data as { consultation_id?: number })?.consultation_id;
  return consultationId != null
    ? `${notification.type}_${consultationId}`
    : `${notification.type}_${notification.id}`;
};

const mergeByNotificationKeyKeepingNewest = (
  notifications: Notification[],
): Notification[] => {
  const notificationMap = new Map<string, Notification>();

  notifications.forEach((notification) => {
    const normalizedNotification = {
      ...notification,
      createdAt: normalizeNotificationDate(notification.createdAt),
    };

    const key = getNotificationKey(normalizedNotification);
    const existing = notificationMap.get(key);

    if (!existing) {
      notificationMap.set(key, normalizedNotification);
      return;
    }

    const existingTime = new Date(existing.createdAt).getTime();
    const candidateTime = new Date(normalizedNotification.createdAt).getTime();

    notificationMap.set(
      key,
      candidateTime >= existingTime ? normalizedNotification : existing,
    );
  });

  return Array.from(notificationMap.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      lastSyncTime: null,

      addNotification: (notification) => {
        set((state) => {
          const normalizedNotification = {
            ...notification,
            createdAt: normalizeNotificationDate(notification.createdAt),
          };

          console.log('➕ ADD NOTIFICATION', {
            type: normalizedNotification.type,
            consultationId: (normalizedNotification.data as { consultation_id?: number })?.consultation_id,
            source: normalizedNotification.source,
            id: normalizedNotification.id,
          });

          const incomingKey = getNotificationKey(normalizedNotification);
          const exists = state.notifications.some(
            (n) => getNotificationKey(n) === incomingKey,
          );

          console.log('🔍 CHECK DUPLICATE', {
            key: incomingKey,
            exists,
          });

          const existingIndex = state.notifications.findIndex(
            (n) => getNotificationKey(n) === incomingKey,
          );

          if (existingIndex >= 0) {
            const existing = state.notifications[existingIndex];
            const shouldReplace =
              new Date(normalizedNotification.createdAt).getTime() >=
              new Date(existing.createdAt).getTime();

            if (!shouldReplace) {
              return state;
            }

            const notifications = [...state.notifications];
            notifications[existingIndex] = normalizedNotification;
            notifications.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );

            return {
              notifications,
              unreadCount: notifications.filter((n) => !n.read).length,
            };
          }

          const notifications = [normalizedNotification, ...state.notifications].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notifications = state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif,
          );

          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notifications = state.notifications.filter((notif) => notif.id !== id);
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        });
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0, lastSyncTime: null });
      },

      getNotifications: () => {
        return get().notifications;
      },

      syncWithApiNotifications: (apiNotifications) => {
        set((state) => {
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const recentPusherNotifications = state.notifications
            .filter((n) => String(n.source).startsWith('pusher'))
            .filter((n) => new Date(normalizeNotificationDate(n.createdAt)) > oneDayAgo);

          const mergedNotifications = mergeByNotificationKeyKeepingNewest([
            ...apiNotifications,
            ...recentPusherNotifications,
          ]);

          return {
            notifications: mergedNotifications,
            unreadCount: mergedNotifications.filter((n) => !n.read).length,
            lastSyncTime: new Date().toISOString(),
          };
        });
      },

      updateLastSyncTime: () => {
        set({ lastSyncTime: new Date().toISOString() });
      },
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({
        notifications: state.notifications.filter((n) => String(n.source).startsWith('pusher')),
        unreadCount: state.unreadCount,
        lastSyncTime: state.lastSyncTime,
      }),
    },
  ),
);
