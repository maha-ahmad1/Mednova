import { useQuery, QueryKey } from '@tanstack/react-query';
import { useAxiosInstance } from '@/lib/axios/axiosInstance';

export const useFetcher = <T>(
  key: QueryKey,
  endpoint: string | null,
  staleTime?: number,
) => {
  const axiosInstance = useAxiosInstance();

  return useQuery<T | null, Error>({
    queryKey: key,
    queryFn: async () => {
      if (!endpoint) return null;
      const response = await axiosInstance.get<{ success: boolean; data: T }>(endpoint);
      return response.data.data;
    },
    enabled: !!endpoint,
    staleTime: 1000 * 60 * (staleTime || 5),
  });
};
