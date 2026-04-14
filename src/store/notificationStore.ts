// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export interface Notification {
//   id: number;
//   type: 'consultation_requested' | 'consultation_updated' | 'consultation_accepted' | 'consultation_cancelled' | 'consultation_active' | 'consultation_completed';
//   title: string;
//   message: string;
//   data: {
//     consultation_id: number;
//     patient_id?: number;
//     patient_name?: string;
//     consultant_id?: number;
//     consultant_name?: string;
//     consultant_type?: string;
//     consultation_type?: 'chat' | 'video';
//     status?: string;
//     video_room_link?: string;
//     updated_at?: string;
//   };
//   read: boolean;
//   createdAt: string;
//   source: 'pusher' | 'api';
// }

// interface NotificationStore {
//   notifications: Notification[];
//   unreadCount: number;
//   lastSyncTime: string | null;
  
//   // وظائف الـ Pusher
//   addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'source'>) => void;
//   markAsRead: (id: number) => void;
//   markAllAsRead: () => void;
//   removeNotification: (id: number) => void;
//   clearNotifications: () => void;
//   getNotifications: () => Notification[];
  
//   // وظائف التزامن
//   syncWithApiNotifications: (apiNotifications: Notification[]) => void;
//   updateLastSyncTime: () => void;
// }

// export const useNotificationStore = create<NotificationStore>()(
//   persist(
//     (set, get) => ({
//       notifications: [],
//       unreadCount: 0,
//       lastSyncTime: null,

//       addNotification: (notificationData) => {
//         const id = Date.now();
//         const newNotification: Notification = {
//           ...notificationData,
//           id,
//           read: false,
//           createdAt: new Date().toISOString(),
//           source: 'pusher',
//         };

//         set((state) => ({
//           notifications: [newNotification, ...state.notifications],
//           unreadCount: state.unreadCount + 1,
//         }));
//       },

//       markAsRead: (id) => {
//         set((state) => ({
//           notifications: state.notifications.map((notif) =>
//             notif.id === id ? { ...notif, read: true } : notif
//           ),
//           unreadCount: Math.max(0, state.unreadCount - 1),
//         }));
//       },

//       markAllAsRead: () => {
//         set((state) => ({
//           notifications: state.notifications.map((notif) => ({
//             ...notif,
//             read: true,
//           })),
//           unreadCount: 0,
//         }));
//       },

//       removeNotification: (id) => {
//         set((state) => {
//           const notificationToRemove = state.notifications.find(n => n.id === id);
//           return {
//             notifications: state.notifications.filter((notif) => notif.id !== id),
//             unreadCount: notificationToRemove && !notificationToRemove.read 
//               ? Math.max(0, state.unreadCount - 1)
//               : state.unreadCount,
//           };
//         });
//       },

//       clearNotifications: () => {
//         set({ notifications: [], unreadCount: 0, lastSyncTime: null });
//       },

//       getNotifications: () => {
//         return get().notifications;
//       },

//       syncWithApiNotifications: (apiNotifications: Notification[]) => {
//         set((state) => {
//           // فلترة إشعارات Pusher القديمة (أكثر من 24 ساعة)
//           const now = new Date();
//           const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
          
//           const recentPusherNotifications = state.notifications
//             .filter(n => n.source === 'pusher')
//             .filter(n => new Date(n.createdAt) > oneDayAgo);
          
//           // إنشاء Map للإشعارات من الـ API للبحث السريع
//           const apiNotificationMap = new Map(
//             apiNotifications.map(n => [n.id, n])
//           );
          
//           // دمج الإشعارات
//           const allNotifications = [
//             ...apiNotifications,
//             ...recentPusherNotifications.filter(pusherNotif => 
//               !apiNotificationMap.has(pusherNotif.id)
//             )
//           ]
//             .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
//           // حساب غير المقروء
//           const newUnreadCount = allNotifications.filter(n => !n.read).length;
          
//           return {
//             notifications: allNotifications,
//             unreadCount: newUnreadCount,
//             lastSyncTime: new Date().toISOString(),
//           };
//         });
//       },

//       updateLastSyncTime: () => {
//         set({ lastSyncTime: new Date().toISOString() });
//       },
//     }),
//     {
//       name: 'notifications-storage',
//       partialize: (state) => ({
//         notifications: state.notifications.filter(n => n.source === 'pusher'), // تخزين Pusher فقط
//         unreadCount: state.unreadCount,
//         lastSyncTime: state.lastSyncTime,
//       }),
//     }
//   )
// );



// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export interface Notification {
//   id: string; // تم تغيير من number إلى string
//   type: 'consultation_requested' | 'consultation_updated' | 'consultation_accepted' | 'consultation_cancelled' | 'consultation_active' | 'consultation_completed';
//   title: string;
//   message: string;
//   data: {
//     consultation_id: number;
//     patient_id?: number;
//     patient_name?: string;
//     consultant_id?: number;
//     consultant_name?: string;
//     consultant_type?: string;
//     consultation_type?: 'chat' | 'video';
//     status?: string;
//     video_room_link?: string;
//     updated_at?: string;
//   };
//   read: boolean;
//   createdAt: string;
//   source: 'pusher' | 'api';
// }

// interface NotificationStore {
//   notifications: Notification[];
//   unreadCount: number;
//   lastSyncTime: string | null;
  
//   // وظائف الـ Pusher
//   addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'source'>) => void;
//   markAsRead: (id: string) => void; // تم تغيير من number إلى string
//   markAllAsRead: () => void;
//   removeNotification: (id: string) => void; // تم تغيير من number إلى string
//   clearNotifications: () => void;
//   getNotifications: () => Notification[];
  
//   // وظائف التزامن
//   syncWithApiNotifications: (apiNotifications: Notification[]) => void;
//   updateLastSyncTime: () => void;
// }

// export const useNotificationStore = create<NotificationStore>()(
//   persist(
//     (set, get) => ({
//       notifications: [],
//       unreadCount: 0,
//       lastSyncTime: null,

//       addNotification: (notificationData) => {
//         // إنشاء ID فريد باستخدام timestamp ورقم عشوائي
//         const uniqueId = `pusher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//         const newNotification: Notification = {
//           ...notificationData,
//           id: uniqueId, // استخدام ID فريد
//           read: false,
//           createdAt: new Date().toISOString(),
//           source: 'pusher',
//         };

//         set((state) => ({
//           notifications: [newNotification, ...state.notifications],
//           unreadCount: state.unreadCount + 1,
//         }));
//       },

//       markAsRead: (id) => {
//         set((state) => ({
//           notifications: state.notifications.map((notif) =>
//             notif.id === id ? { ...notif, read: true } : notif
//           ),
//           unreadCount: Math.max(0, state.unreadCount - 1),
//         }));
//       },

//       markAllAsRead: () => {
//         set((state) => ({
//           notifications: state.notifications.map((notif) => ({
//             ...notif,
//             read: true,
//           })),
//           unreadCount: 0,
//         }));
//       },

//       removeNotification: (id) => {
//         set((state) => {
//           const notificationToRemove = state.notifications.find(n => n.id === id);
//           return {
//             notifications: state.notifications.filter((notif) => notif.id !== id),
//             unreadCount: notificationToRemove && !notificationToRemove.read 
//               ? Math.max(0, state.unreadCount - 1)
//               : state.unreadCount,
//           };
//         });
//       },

//       clearNotifications: () => {
//         set({ notifications: [], unreadCount: 0, lastSyncTime: null });
//       },

//       getNotifications: () => {
//         return get().notifications;
//       },

//       syncWithApiNotifications: (apiNotifications: Notification[]) => {
//         set((state) => {
//           // فلترة إشعارات Pusher القديمة (أكثر من 24 ساعة)
//           const now = new Date();
//           const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
          
//           const recentPusherNotifications = state.notifications
//             .filter(n => n.source === 'pusher')
//             .filter(n => new Date(n.createdAt) > oneDayAgo);
          
//           // إنشاء Map للإشعارات من الـ API للبحث السريع
//           const apiNotificationMap = new Map(
//             apiNotifications.map(n => [n.id, n])
//           );
          
//           // دمج الإشعارات
//           const allNotifications = [
//             ...apiNotifications,
//             ...recentPusherNotifications.filter(pusherNotif => 
//               !apiNotificationMap.has(pusherNotif.id)
//             )
//           ]
//             .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
//           // حساب غير المقروء
//           const newUnreadCount = allNotifications.filter(n => !n.read).length;
          
//           return {
//             notifications: allNotifications,
//             unreadCount: newUnreadCount,
//             lastSyncTime: new Date().toISOString(),
//           };
//         });
//       },

//       updateLastSyncTime: () => {
//         set({ lastSyncTime: new Date().toISOString() });
//       },
//     }),
//     {
//       name: 'notifications-storage',
//       partialize: (state) => ({
//         notifications: state.notifications.filter(n => n.source === 'pusher'), // تخزين Pusher فقط
//         unreadCount: state.unreadCount,
//         lastSyncTime: state.lastSyncTime,
//       }),
//     }
//   )
// );


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
          console.debug("[EchoDebug][Store] addNotification-called", {
            timestamp: new Date().toISOString(),
            dedupKey,
            source: notification.source,
            notification,
            stackTrace,
          });

          const duplicateByFingerprint = state.notifications.some(
            (item) => getNotificationDedupKey(item) === dedupKey
          );
          if (duplicateByFingerprint) {
            console.debug(`[Dedup] DROP ${dedupKey} notification-fingerprint`);
            return state;
          }

          // تأكد من عدم وجود تكرار
          const exists = state.notifications.some(n => n.id === notification.id);
          if (exists) {
            console.debug(`[Dedup] DROP ${notification.id} notification-id`);
            console.warn('⚠️ إشعار مكرر تم تجاهله:', notification.id);
            return state;
          }
          console.debug(`[Dedup] PASS ${dedupKey} notification-new`);
          
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
