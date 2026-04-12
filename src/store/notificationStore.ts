import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  type:
    | "consultation_requested"
    | "consultation_updated"
    | "consultation_accepted"
    | "consultation_cancelled"
    | "consultation_active"
    | "consultation_completed"
    | "message"
    | "comment"
    | "like"
    | "follow"
    | "system"
    | "alert"
    | string;
  title: string;
  message: string;
  data:
    | {
        logical_key?: string;
        consultation_id: number;
        patient_id?: number;
        patient_name?: string;
        consultant_id?: number;
        consultant_name?: string;
        consultant_type?: string;
        consultation_type?: "chat" | "video";
        status?: string;
        video_room_link?: string;
        updated_at?: string;
      }
    | Record<string, unknown>;
  read: boolean;
  createdAt: string;
  source: "pusher" | "api";
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

const getLogicalKey = (notification: Notification): string | undefined => {
  const candidate = (notification.data as Record<string, unknown>)?.logical_key;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : undefined;
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      lastSyncTime: null,

      addNotification: (notification) => {
        set((state) => {
          const exists = state.notifications.some((item) => item.id === notification.id);
          if (exists) {
            console.debug("[dedup] duplicate notification by id ignored", {
              id: notification.id,
            });
            return state;
          }

          return {
            notifications: [notification, ...state.notifications],
            unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
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
          const notificationToRemove = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount:
              notificationToRemove && !notificationToRemove.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
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
            .filter((notification) => notification.source === "pusher")
            .filter((notification) => new Date(notification.createdAt) > oneDayAgo);

          const apiIdSet = new Set(apiNotifications.map((notification) => notification.id));
          const apiLogicalKeySet = new Set(
            apiNotifications.map(getLogicalKey).filter(Boolean) as string[],
          );

          const uniquePusherNotifications = recentPusherNotifications.filter((notification) => {
            if (apiIdSet.has(notification.id)) {
              return false;
            }

            const logicalKey = getLogicalKey(notification);
            if (!logicalKey) {
              return true;
            }

            return !apiIdSet.has(logicalKey) && !apiLogicalKeySet.has(logicalKey);
          });

          const allNotifications = [...apiNotifications, ...uniquePusherNotifications].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          const newUnreadCount = allNotifications.filter((notification) => !notification.read)
            .length;

          return {
            notifications: allNotifications,
            unreadCount: newUnreadCount,
            lastSyncTime: new Date().toISOString(),
          };
        });
      },

      updateLastSyncTime: () => {
        set({ lastSyncTime: new Date().toISOString() });
      },
    }),
    {
      name: "notifications-storage-v2",
      partialize: (state) => ({
        notifications: state.notifications.filter((notification) => notification.source === "pusher"),
        unreadCount: state.notifications.filter(
          (notification) => notification.source === "pusher" && !notification.read,
        ).length,
        lastSyncTime: state.lastSyncTime,
      }),
    },
  ),
);
