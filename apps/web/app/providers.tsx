'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on every navigation — data stays fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // One retry is enough — 3 retries on a real API adds ~10s of lag on failure
        retry: 1,
        // Don't refetch when user switches tabs — disruptive in a music practice tool
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
