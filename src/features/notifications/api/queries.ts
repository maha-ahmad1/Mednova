import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useAxiosInstance } from '@/lib/axios/axiosInstance';
import {
  Notification,
  NotificationsPageResult,
  ApiResponse,
  ApiNotification,
} from '../types';
import {
  NOTIFICATION_ENDPOINTS,
  NOTIFICATION_LIMITS,
  STALE_TIMES,
} from '../constants';
import { mapApiResponseToNotificationsPage } from './mapper';
import { useFetcher } from '@/hooks/useFetcher';



export const fetchNotifications = async (
  axiosInstance: ReturnType<typeof useAxiosInstance>,
  params?: { limit?: number; cursor?: string | null }
): Promise<Notification[]> => {
  const response = await axiosInstance.get<ApiResponse<{
    notification: ApiNotification[];
  }>>(NOTIFICATION_ENDPOINTS.LIST, { params });

  return response.data.data.notification.map((notif) => ({
    id: `api_${notif.id}`,
    type: notif.type.toLowerCase() as Notification['type'],
    title: 'إشعار ', 
    message: (() => {
      const maybeMessage = (notif.data as Record<string, unknown> | undefined)?.message;
      if (typeof maybeMessage === 'string') return maybeMessage;
      if (maybeMessage == null) return 'بدون رسالة';
      return String(maybeMessage);
    })(),
    data: notif.data || {},
    read: !!notif.read_at,
    createdAt: notif.created_at || String(notif.id),
    source: 'api' as const,
  }));
};

export const fetchNotificationsPage = async (
  axiosInstance: ReturnType<typeof useAxiosInstance>,
  params?: { limit?: number; cursor?: string | null }
): Promise<NotificationsPageResult> => {
  const response = await axiosInstance.get<ApiResponse<{
    notification: ApiNotification[];
    next_cursor?: string;
  }>>(NOTIFICATION_ENDPOINTS.LIST, { params });

  return mapApiResponseToNotificationsPage(response.data);
};


export const useNotificationsDropdownQuery = (
  userId: string | undefined,
  options?: { enabled?: boolean }
) => {
  const axiosInstance = useAxiosInstance();

  return useQuery<Notification[], Error>({
    queryKey: ['notifications', 'dropdown', userId],
    queryFn: () => fetchNotifications(axiosInstance, { limit: NOTIFICATION_LIMITS.DROPDOWN }),
    enabled: !!userId && (options?.enabled ?? true),
    staleTime: STALE_TIMES.DROPDOWN,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useNotificationsInfiniteQuery = (
  userId: string | undefined,
  options?: { enabled?: boolean }
) => {
  const axiosInstance = useAxiosInstance();

  return useInfiniteQuery<NotificationsPageResult, Error>({
    queryKey: ['notifications', 'page', userId],
    queryFn: async ({ pageParam = null }) => {
      const params = { 
        limit: NOTIFICATION_LIMITS.PAGE,
        cursor: pageParam as string | null,  
      };
      return fetchNotificationsPage(axiosInstance, params);
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor || undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!userId && (options?.enabled ?? true),
    staleTime: STALE_TIMES.PAGE,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};


export const useNotificationsFetcher = (
  userId: string | undefined,
  params?: { limit?: number }
) => {
  return useFetcher<Notification[], { limit: number }>(
    ['notifications', userId],
    userId ? NOTIFICATION_ENDPOINTS.LIST : null,
    {
      enabled: !!userId,
      params: { limit: params?.limit || NOTIFICATION_LIMITS.DROPDOWN },
      staleTime: STALE_TIMES.DROPDOWN,
    }
  );
};