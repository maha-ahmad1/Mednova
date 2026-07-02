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
  const { markAsRead, markAllAsRead } = useNotificationMutations();

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
    markAllAsRead();
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