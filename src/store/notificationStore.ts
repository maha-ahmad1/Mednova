import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type:
    | 'consultation_requested'
    | 'consultation_accepted'
    | 'consultation_active'
    | 'consultation_cancelled'
    | 'consultation_cancelled_by_consultant'
    | 'consultation_cancelled_by_patient'
    | 'consultation_completed'
    | 'consultation_updated'
    | 'consultation_cancelled_by_system'
    | 'consultation_review_window_opened'
    | 'consultation_review_window_expiring_patient'
    | 'consultation_settlement_completed_patient'
    | 'consultation_reminder_for_all'
    | 'account_approved'
    | 'account_rejected'
    | 'message'
    | 'comment'
    | 'like'
    | 'follow'
    | 'system'
    | 'alert'
    | string; // fallback for any other custom types
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
  source: 'pusher' | 'api';
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  lastSyncTime: string | null;
  
  addNotification: (notification: Notification) => void; // 🔧 بسيط: يقبل إشعاراً كاملاً
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  getNotifications: () => Notification[];
  
  syncWithApiNotifications: (apiNotifications: Notification[]) => void;
  updateLastSyncTime: () => void;
}

const normalize = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const getNotificationDedupKey = (notification: Notification): string => {
  const payload = notification.data as Record<string, unknown>;
  const consultationId = payload?.consultation_id;
  const type = normalize(notification.type);
  const message = normalize(notification.message).slice(0, 80);

  if (typeof consultationId === "number") {
    return `consultation:${consultationId}:${type}:${message}`;
  }

  return `generic:${type}:${message}`;
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      lastSyncTime: null,

      // 🔧 أبسط وأوضح: توقع أن يأتي ID فريد من الخارج
      addNotification: (notification) => {
        set((state) => {
          const dedupKey = getNotificationDedupKey(notification);
          const stackTrace = new Error("Notification add source").stack;
          const payload = notification.data as Record<string, unknown>;
          console.debug("[EchoDebug][Store] addNotification-called", {
            timestamp: new Date().toISOString(),
            dedupKey,
            source: notification.source,
            notificationId: notification.id,
            notificationType: notification.type,
            notificationMessage: notification.message,
            consultationId: payload?.consultation_id,
            createdAt: notification.createdAt,
            created_at: payload?.created_at,
            payloadTimestamp: payload?.timestamp,
            rawPayloadSource: payload,
            notification,
            stackTrace,
          });

          const duplicateByFingerprint = state.notifications.some(
            (item) => getNotificationDedupKey(item) === dedupKey
          );
          if (duplicateByFingerprint) {
            console.debug(`[Dedup] DROP ${dedupKey} notification-fingerprint`);
            // TEMP DEBUG - remove after diagnosing sound issue
            console.log("⚠️ [SoundDebug] Dedup detected — dropped by fingerprint, array will NOT change, no sound will fire", {
              dedupKey,
              notificationId: notification.id,
            });
            return state;
          }

          // تأكد من عدم وجود تكرار
          const exists = state.notifications.some(n => n.id === notification.id);
          if (exists) {
            console.debug(`[Dedup] DROP ${notification.id} notification-id`);
            console.warn('⚠️ إشعار مكرر تم تجاهله:', notification.id);
            // TEMP DEBUG - remove after diagnosing sound issue
            console.log("⚠️ [SoundDebug] Dedup detected — dropped by id, array will NOT change, no sound will fire", {
              notificationId: notification.id,
            });
            return state;
          }
          console.debug(`[Dedup] PASS ${dedupKey} notification-new`);
          // TEMP DEBUG - remove after diagnosing sound issue
          console.log("🔔 [SoundDebug] Notification passed dedup — will be added to store", {
            dedupKey,
            notificationId: notification.id,
            source: notification.source,
          });
          
          return {
            notifications: [notification, ...state.notifications],
            unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
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
          const notificationToRemove = state.notifications.find(n => n.id === id);
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: notificationToRemove && !notificationToRemove.read 
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
          // فلترة إشعارات Pusher القديمة (أكثر من 24 ساعة)
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
          
          const recentPusherNotifications = state.notifications
            .filter(n => n.source === 'pusher')
            .filter(n => new Date(n.createdAt) > oneDayAgo);
          
          // استخدام دمج API + Pusher مع dedup fingerprint
          const allNotifications = [
            ...apiNotifications,
            ...recentPusherNotifications
          ];
          
          // 🔧 إزالة التكرارات بالـ fingerprint مع الاحتفاظ بالأحدث
          const notificationMap = new Map<string, Notification>();
          allNotifications.forEach(notif => {
            const dedupKey = getNotificationDedupKey(notif);
            const existing = notificationMap.get(dedupKey);

            if (!existing || new Date(notif.createdAt) > new Date(existing.createdAt)) {
              notificationMap.set(dedupKey, notif);
              console.debug(`[Dedup] PASS ${dedupKey} api-sync-keep`);
            } else {
              console.debug(`[Dedup] DROP ${dedupKey} api-sync-older`);
            }
          });
          
          const uniqueNotifications = Array.from(notificationMap.values())
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          const newUnreadCount = uniqueNotifications.filter(n => !n.read).length;
          
          return {
            notifications: uniqueNotifications,
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
      name: 'notifications-storage',
      partialize: (state) => ({
        notifications: state.notifications.filter(n => n.source === 'pusher'),
        unreadCount: state.unreadCount,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
