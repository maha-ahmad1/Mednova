import { useQuery, QueryKey } from '@tanstack/react-query';
import { useAxiosInstance } from '@/lib/axios/axiosInstance';

export const useFetcher = <T>(
  key: QueryKey,
  endpoint: string,
  staleTime?: number,
) => {
  const axiosInstance = useAxiosInstance();

  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const response = await axiosInstance.get<{ success: boolean; data: T }>(endpoint);
      return response.data.data;
    },
    staleTime: 1000 * 60 * (staleTime || 5),
  });
};
