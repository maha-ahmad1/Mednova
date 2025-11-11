import { useQuery } from '@tanstack/react-query';
import { useFetcher } from '@/hooks/useFetcher';
import { ServiceProvider, ProviderType} from '../types/provider';

export const useServiceProviders = (
  type: ProviderType = "all",
  searchParams?: {
    full_name?: string;
    country?: string;
    city?: string;
    specialty?: string;
    limit?: number;
  }
) => {
  const params = new URLSearchParams();
  
 if (type !== "all") {
  params.append('type', type); 
}

  
  if (searchParams?.full_name) {
    params.append('full_name', searchParams.full_name);
  }
  if (searchParams?.country) {
    params.append('country', searchParams.country);
  }
  if (searchParams?.city) {
    params.append('city', searchParams.city);
  }
  if (searchParams?.specialty) {
    params.append('specialty_id', searchParams.specialty);
  }
  if (searchParams?.limit) {
    params.append('limit', searchParams.limit.toString());
  }

  const endpoint = `/api/customer/service-provider/search?${params.toString()}`;

  return useFetcher<ServiceProvider[]>(
    ["serviceProviders", type, JSON.stringify(searchParams)],
    endpoint,
    
  );
};