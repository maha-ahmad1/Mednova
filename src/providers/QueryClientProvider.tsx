'use client';  

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5-minute stale time — matches useFetcher's default.
      // Reduces redundant background refetches for components that use
      // useQuery directly without an explicit staleTime.
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>  
      {children}
    </QueryClientProvider>
  );
}