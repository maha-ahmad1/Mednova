import { useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotificationStore } from '@/store/notificationStore';
import { useNotificationsDropdownQuery } from '../api/queries';
import { useNotificationMutations } from '../api/mutations';


export const useNotificationsDropdown = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    notifications,
    unreadCount,
    syncWithApiNotifications,
  } = useNotificationStore();

  // Queries
  const { data: apiNotifications, isLoading } = useNotificationsDropdownQuery(
    userId,
    { enabled: !!userId }
  );

  // Mutations
  const { markAsRead, markAllAsRead } = useNotificationMutations();

  // Sync API notifications with store
  useEffect(() => {
    if (!apiNotifications?.length) return;
    syncWithApiNotifications(apiNotifications);
  }, [apiNotifications, syncWithApiNotifications]);

  // Display only first 10 notifications
  const displayNotifications = useMemo(
    () => notifications.slice(0, 10),
    [notifications]
  );

  /* ---------- Handlers ---------- */
  const handleMarkAsRead = (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification || notification.read) return;
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return {
    notifications: displayNotifications,
    unreadCount,
    isLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
};