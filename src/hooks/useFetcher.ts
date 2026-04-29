import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useAxiosInstance } from '@/lib/axios/axiosInstance';

export const useFetcher = < T,
  P extends Record<string, unknown> = Record<string, never>>(  
  key: QueryKey,
  endpoint: string | null,
  options?: {
    staleTime?: number;
    enabled?: boolean;
    params?: P;
    refetchOnWindowFocus?: boolean;
  }
) => {
  const axiosInstance = useAxiosInstance();

  return useQuery<T | null, Error>({
    queryKey: options?.params ? [...key, options.params] : key,
    queryFn: async () => {
      if (!endpoint) return null;
      const response = await axiosInstance.get<{ success: boolean; data: T }>(
        endpoint,
        { params: options?.params }
      );
      return response.data.data;
    },
    enabled: !!endpoint && (options?.enabled ?? true),
    staleTime: 1000 * 60 * (options?.staleTime || 5),
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });
};