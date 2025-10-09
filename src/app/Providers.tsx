'use client';  

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({  
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  
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