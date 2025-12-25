// import { useQuery, useMutation } from '@tanstack/react-query';
// import { useAxiosInstance } from '@/lib/axios/axiosInstance';
// import { useNotificationStore, Notification } from '@/store/notificationStore';
// import { useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// // ===== API Notification Shape =====
// interface ApiNotification {
//   id: number;
//   type: string;
//   title: string;
//   message: string;
//   data: {
//     consultation_id: number;
//     [key: string]: any;
//   };
//   read: boolean;
//   created_at: string;
// }

// export const useNotifications = () => {
//   const { data: session } = useSession();
//   const axiosInstance = useAxiosInstance();

//   const {
//     notifications,
//     unreadCount,
//     syncWithApiNotifications,
//     markAsRead,
//     markAllAsRead,
//   } = useNotificationStore();

//   const userId = session?.user?.id;

//   // ===============================
//   // Fetch Notifications (API)
//   // ===============================
//   const { data: apiNotifications, isLoading } = useQuery({
//     queryKey: ['notifications', userId],
//     enabled: !!userId,

//     queryFn: async (): Promise<Notification[]> => {
//       const response = await axiosInstance.get<{
//         success: boolean;
//         data: ApiNotification[];
//       }>('/api/notification');

//       return response.data.data.map(
//         (notif): Notification => ({
//           id: notif.id,
//           type: notif.type as Notification['type'],
//           title: notif.title,
//           message: notif.message,
//           data: notif.data,
//           read: notif.read,
//           createdAt: notif.created_at,
//           source: 'api',
//         })
//       );
//     },

//     // 🔒 مهم جدًا لمنع الريكوستات الزائدة
//     staleTime: 1000 * 60, // 1 دقيقة
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     retry: 1,
//   });

//   // ===============================
//   // Sync API → Store (مرة ذكية)
//   // ===============================
//   useEffect(() => {
//     if (!apiNotifications || apiNotifications.length === 0) return;
//     syncWithApiNotifications(apiNotifications);
//   }, [apiNotifications?.length]); // 👈 يمنع loop

//   // ===============================
//   // Mark single notification as read
//   // ===============================
//   const markAsReadMutation = useMutation({
//     mutationFn: async (notificationId: number) => {
//       await axiosInstance.post('/api/notification/mark-as-read', {
//         notification_id: notificationId,
//       });
//     },
//   });

//   // ===============================
//   // Mark all notifications as read
//   // ===============================
//   const markAllAsReadMutation = useMutation({
//     mutationFn: async () => {
//       await axiosInstance.post('/api/notification/mark-as-read');
//     },
//   });

//   // ===============================
//   // Handlers (Optimistic)
//   // ===============================
//   const handleMarkAsRead = (notificationId: number) => {
//     const notification = notifications.find((n) => n.id === notificationId);
//     if (!notification || notification.read) return;

//     // ✅ optimistic update
//     markAsRead(notificationId);

//     if (notification.source === 'api') {
//       markAsReadMutation.mutate(notificationId);
//     }
//   };

//   const handleMarkAllAsRead = () => {
//     // ✅ optimistic update
//     markAllAsRead();

//     markAllAsReadMutation.mutate();
//   };

//   return {
//     notifications,
//     unreadCount,
//     isLoading,
//     handleMarkAsRead,
//     handleMarkAllAsRead,
//     isMarkingAsRead: markAsReadMutation.isPending,
//     isMarkingAllAsRead: markAllAsReadMutation.isPending,
//   };
// };



// import { useQuery, useMutation } from '@tanstack/react-query';
// import { useAxiosInstance } from '@/lib/axios/axiosInstance';
// import { useNotificationStore, Notification } from '@/store/notificationStore';
// import { useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// // ===== API Notification Shape =====
// interface ApiNotification {
//   id: number;
//   type: string;
//   title: string;
//   message: string;
//   data: {
//     consultation_id: number;
//     [key: string]: any;
//   };
//   read: boolean;
//   created_at: string;
// }

// export const useNotifications = () => {
//   const { data: session } = useSession();
//   const axiosInstance = useAxiosInstance();

//   const {
//     notifications,
//     unreadCount,
//     syncWithApiNotifications,
//     markAsRead,
//     markAllAsRead,
//   } = useNotificationStore();

//   const userId = session?.user?.id;

//   // ===============================
//   // Fetch Notifications (API)
//   // ===============================
//   const { data: apiNotifications, isLoading } = useQuery({
//     queryKey: ['notifications', userId],
//     enabled: !!userId,

//     queryFn: async (): Promise<Notification[]> => {
//       const response = await axiosInstance.get<{
//         success: boolean;
//         data: ApiNotification[];
//       }>('/api/notification');

//       return response.data.data.map(
//         (notif): Notification => ({
//           id: `api_${notif.id}`, // 🔧 تحويل إلى string مع بادئة
//           type: notif.type as Notification['type'],
//           title: notif.title,
//           message: notif.message,
//           data: notif.data,
//           read: notif.read,
//           createdAt: notif.created_at,
//           source: 'api',
//         })
//       );
//     },

//     staleTime: 1000 * 60, // 1 دقيقة
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     retry: 1,
//   });

//   // ===============================
//   // Sync API → Store
//   // ===============================
//   useEffect(() => {
//     if (!apiNotifications || apiNotifications.length === 0) return;
//     syncWithApiNotifications(apiNotifications);
//   }, [apiNotifications]); // 🔧 تعديل هنا

//   // ===============================
//   // Mark single notification as read
//   // ===============================
//   const markAsReadMutation = useMutation({
//     mutationFn: async (notificationId: string) => { // 🔧 تغيير إلى string
//       // استخراج الـ ID الأصلي من الـ string
//       const originalId = parseInt(notificationId.replace('api_', ''));
//       await axiosInstance.post('/api/notification/mark-as-read', {
//         notification_id: originalId,
//       });
//     },
//   });

//   // ===============================
//   // Mark all notifications as read
//   // ===============================
//   const markAllAsReadMutation = useMutation({
//     mutationFn: async () => {
//       await axiosInstance.post('/api/notification/mark-as-read');
//     },
//   });

//   // ===============================
//   // Handlers (Optimistic)
//   // ===============================
//   const handleMarkAsRead = (notificationId: string) => { // 🔧 تغيير إلى string
//     const notification = notifications.find((n) => n.id === notificationId);
//     if (!notification || notification.read) return;

//     // ✅ optimistic update
//     markAsRead(notificationId);

//     if (notification.source === 'api') {
//       markAsReadMutation.mutate(notificationId);
//     }
//   };

//   const handleMarkAllAsRead = () => {
//     // ✅ optimistic update
//     markAllAsRead();

//     markAllAsReadMutation.mutate();
//   };

//   return {
//     notifications,
//     unreadCount,
//     isLoading,
//     handleMarkAsRead,
//     handleMarkAllAsRead,
//     isMarkingAsRead: markAsReadMutation.isPending,
//     isMarkingAllAsRead: markAllAsReadMutation.isPending,
//   };
// };




// import {
//   useQuery,
//   useMutation,
//   useInfiniteQuery,
// } from '@tanstack/react-query';
// import { useAxiosInstance } from '@/lib/axios/axiosInstance';
// import { useNotificationStore } from '@/store/notificationStore';
// import { useEffect, useMemo } from 'react';
// import { useSession } from 'next-auth/react';

// /* ======================================================
//    Types
// ====================================================== */
// interface NotificationsPageResult {
//   notifications: Notification[];
//   nextCursor: string | null;
// }

// /* ======================================================
//    Dropdown Notifications (بدون Pagination)
// ====================================================== */
// export const useNotificationsDropdown = () => {
//   const { data: session } = useSession();
//   const axiosInstance = useAxiosInstance();

//   const {
//     notifications,
//     unreadCount,
//     syncWithApiNotifications,
//     markAsRead,
//     markAllAsRead,
//   } = useNotificationStore();

//   const userId = session?.user?.id;

//   const { data: apiNotifications,  isLoading } = useQuery({
//     queryKey: ['notifications', 'dropdown', userId],
//     enabled: !!userId,

//     queryFn: async (): Promise<Notification[]> => {
//       const response = await axiosInstance.get<ApiResponse>(
//         '/api/notification',
//         { params: { limit: 2 } }
//       );

//       return response.data.data.notification.map(
//         (notif): Notification => ({
//           id: `api_${notif.id}`,
//           type: mapApiTypeToNotificationType(notif.type),
//           title: getNotificationTitle(notif.type),
//           message: notif.data.message,
//           data: notif.data,
//           read: !!notif.read_at,
//           createdAt: String(notif.id), // ترتيب ثابت
//           source: 'api',
//         })
//       );
//     },

//     staleTime: 1000 * 60,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });

//   // مزامنة إشعارات API مع Store
//   useEffect(() => {
//     if (!apiNotifications?.length) return;
//     syncWithApiNotifications(apiNotifications);
//   }, [apiNotifications, syncWithApiNotifications]);

//   /* ---------- Mutations ---------- */
//   const markAsReadMutation = useMutation({
//     mutationFn: async (notificationId: string) => {
//       const originalId = Number(notificationId.replace('api_', ''));
//       await axiosInstance.get('/api/notification/mark-as-read');
//     }
//   });

//   const markAllAsReadMutation = useMutation({
//     mutationFn: async () => {
//     await axiosInstance.get('/api/notification/mark-as-read');
//     }
//   });

//   /* ---------- Handlers ---------- */
//   const handleMarkAsRead = (notificationId: string) => {
//     const notification = notifications.find((n) => n.id === notificationId);
//     if (!notification || notification.read) return;

//     markAsRead(notificationId);
//     markAsReadMutation.mutate(notificationId);
//   };

//   const handleMarkAllAsRead = () => {
//     markAllAsRead();
//     markAllAsReadMutation.mutate();
//   };

//   const displayNotifications = useMemo(
//     () => notifications.slice(0, 10),
//     [notifications]
//   );

//   return {
//     notifications: displayNotifications,
//     unreadCount,
//     isLoading,
//     handleMarkAsRead,
//     handleMarkAllAsRead,
//   };
// };

// /* ======================================================
//    Full Notifications Page (Cursor Pagination)
// ====================================================== */
// export const useNotifications = () => {
//   const { data: session } = useSession();
//   const axiosInstance = useAxiosInstance();

//   const {
//     notifications: storeNotifications,
//     markAsRead,
//     markAllAsRead,
//   } = useNotificationStore();

//   const userId = session?.user?.id;
//   const limit = 2;

//   // 🔧 FIX: إضافة type annotation للـ queryFn
//   const {
//     data,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ['notifications', 'page', userId],
//     enabled: !!userId,

//     // 🔧 FIX: تأكد من أن الـ queryFn ترجع النوع الصحيح
//     queryFn: async ({ pageParam = null }): Promise<NotificationsPageResult> => {
//       const params: Record<string, any> = { limit };

//       if (pageParam) {
//         params.cursor = pageParam;
//       }

//       const response = await axiosInstance.get<ApiResponse>(
//         '/api/notification',
//         { params }
//       );

//       console.log('API CALL', {
//         pageParam,
//         nextCursor: response.data.data?.next_cursor,
//         hasData: !!response.data.data?.notification,
//       });

//       return {
//         notifications: response.data.data?.notification?.map(
//           (notif): Notification => ({
//             id: `api_${notif.id}`,
//             type: mapApiTypeToNotificationType(notif.type),
//             title: getNotificationTitle(notif.type),
//             message: notif.data?.message || 'بدون رسالة',
//             data: notif.data || {},
//             read: !!notif.read_at,
//             createdAt: notif.created_at || String(notif.id),
//             source: 'api',
//           })
//         ) || [], // 🔧 FIX: إرجاع array فارغ إذا لم توجد بيانات
//         nextCursor: response.data.data?.next_cursor || null,
//       };
//     },

//    getNextPageParam: (lastPage, allPages) => {
//   console.log('🔍 getNextPageParam - التحقق:', {
//     lastPageExists: !!lastPage,
//     notificationsInLastPage: lastPage?.notifications?.length || 0,
//     nextCursor: lastPage?.nextCursor,
//     nextCursorType: typeof lastPage?.nextCursor,
//     nextCursorLength: lastPage?.nextCursor?.length,
    
//     allPagesCount: allPages?.length || 0,
//     allCursors: allPages?.map(p => ({
//       cursor: p.nextCursor?.substring(0, 30) + '...',
//       count: p.notifications?.length || 0
//     })),
//   });

//   // 🔧 الحل: تبسيط المنطق
//   if (!lastPage?.nextCursor) {
//     console.log('❌ لا يوجد nextCursor');
//     return undefined;
//   }

//   if (lastPage?.notifications?.length === 0) {
//     console.log('❌ الصفحة الأخيرة فارغة');
//     return undefined;
//   }

//   // 🔧 إزالة التحقق من التكرار (مشكوك فيه)
//   // const usedCursors = allPages?.map(p => p.nextCursor).filter(Boolean) || [];
//   // if (usedCursors.includes(lastPage.nextCursor)) {
//   //   console.log('❌ Cursor مستخدم مسبقاً');
//   //   return undefined;
//   // }

//   console.log('✅ إرجاع nextCursor للصفحة التالية');
//   return lastPage.nextCursor;
// },

//     // 🔧 FIX: إضافة initialPageParam بالشكل الصحيح
//     initialPageParam: null as string | null,
    
//     // 🔧 FIX: إضافة هذه الإعدادات
//     retry: 1,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     staleTime: 1000 * 60 * 5, // 5 دقائق
//   });

//   // 🔧 FIX: تحسين console.log للتحقق من البيانات
//   useEffect(() => {
//     if (data) {
//       console.log('📊 useNotifications data:', {
//         hasData: !!data,
//         pages: data.pages?.length || 0,
//         allNotifications: data.pages?.flatMap(p => p.notifications).length || 0,
//         hasNextPage,
//         lastCursor: data.pages?.[data.pages.length - 1]?.nextCursor,
//       });
//     }
//   }, [data, hasNextPage]);

//   /* ---------- Merge API + Pusher ---------- */
//   const allNotifications = useMemo(() => {
//     const apiNotifications =
//       data?.pages.flatMap((page) => page.notifications) ?? [];

//     const map = new Map<string, Notification>();

//     apiNotifications.forEach((n) => map.set(n.id, n));
//     storeNotifications.forEach((n) => {
//       if (!map.has(n.id)) map.set(n.id, n);
//     });

//     return Array.from(map.values()).sort(
//       (a, b) => Number(b.createdAt) - Number(a.createdAt)
//     );
//   }, [data, storeNotifications]);

//   /* ---------- Mutations ---------- */
//   const markAsReadMutation = useMutation({
//     mutationFn: async (notificationId: string) => {
//       const originalId = Number(notificationId.replace('api_', ''));
//       await axiosInstance.get('/api/notification/mark-as-read');
//     },
//   });

//   /* ---------- Handlers ---------- */
//   const handleMarkAsRead = (notificationId: string) => {
//     const notification = allNotifications.find((n) => n.id === notificationId);
//     if (!notification || notification.read) return;

//     markAsRead(notificationId);
//     markAsReadMutation.mutate(notificationId);
//   };

//   const handleMarkAllAsRead = () => {
//     markAllAsRead();
//   };

//   return {
//     notifications: allNotifications,
//     isLoading,
//     hasNextPage,
//     fetchNextPage,
//     isFetchingNextPage,
//     handleMarkAsRead,
//     handleMarkAllAsRead,
//   };
// };





import { useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotificationStore } from '@/store/notificationStore';
import { useNotificationsInfiniteQuery } from '../api/queries';
import { useNotificationMutations } from '../api/mutations';
import { Notification } from '../types';


export const useNotifications = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    notifications: storeNotifications,
    markAsRead: markAsReadInStore,
    markAllAsRead: markAllAsReadInStore,
  } = useNotificationStore();

  // Queries
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationsInfiniteQuery(userId, { enabled: !!userId });

  // Mutations
  const { markAsRead } = useNotificationMutations();

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log('📊 useNotifications data:', {
        hasData: !!data,
        pages: data.pages?.length || 0,
        allNotifications: data.pages?.flatMap(p => p.notifications).length || 0,
        hasNextPage,
        lastCursor: data.pages?.[data.pages.length - 1]?.nextCursor,
      });
    }
  }, [data, hasNextPage]);

  /* ---------- Merge API + Pusher Notifications ---------- */
  const allNotifications = useMemo(() => {
    const apiNotifications = data?.pages.flatMap((page) => page.notifications) ?? [];
    
    const notificationsMap = new Map<string, Notification>();

    // Add API notifications first
    apiNotifications.forEach((notification) => {
      notificationsMap.set(notification.id, notification);
    });

    // Add Pusher notifications (only if not already in API)
    storeNotifications.forEach((notification) => {
      if (!notificationsMap.has(notification.id)) {
        notificationsMap.set(notification.id, notification);
      }
    });

    // Sort by creation date (newest first)
    return Array.from(notificationsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data, storeNotifications]);

  /* ---------- Handlers ---------- */
  const handleMarkAsRead = (notificationId: string) => {
    const notification = allNotifications.find((n) => n.id === notificationId);
    if (!notification || notification.read) return;

    // Update in store
    markAsReadInStore(notificationId);
    // Send to API
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadInStore();
    // Note: We don't call markAllAsRead from mutations here 
    // because it's already called in markAllAsReadInStore via onSuccess
  };

  return {
    notifications: allNotifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
};