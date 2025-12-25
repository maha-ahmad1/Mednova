import { useMutation } from '@tanstack/react-query';
import { useAxiosInstance } from '@/lib/axios/axiosInstance';
import { useNotificationStore } from '@/store/notificationStore';
import { NOTIFICATION_ENDPOINTS } from '../constants';


export const useMarkAsReadMutation = () => {
  const axiosInstance = useAxiosInstance();
  const { markAsRead: markAsReadInStore } = useNotificationStore();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const originalId = Number(notificationId.replace('api_', ''));
      await axiosInstance.get(NOTIFICATION_ENDPOINTS.MARK_AS_READ, {
        params: { notification_id: originalId },
      });
      return notificationId;
    },
    onSuccess: (notificationId: string) => {
      markAsReadInStore(notificationId);
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const axiosInstance = useAxiosInstance();
  const { markAllAsRead: markAllAsReadInStore } = useNotificationStore();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.get(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
    },
    onSuccess: () => {
      markAllAsReadInStore();
    },
  });
};

export const useNotificationMutations = () => {
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  return {
    markAsReadMutation,
    markAllAsReadMutation,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};