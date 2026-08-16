'use client';

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';

import { AuthProvider } from '@/src/hooks/global/useAuth';

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

/**
 * Browser-wide QueryClient instance.
 *
 * Deliberately module-scoped rather than component state: `Providers` is
 * rendered from `app/[locale]/layout.tsx`, and switching locale changes
 * that dynamic segment, which remounts the layout subtree. Holding the
 * client in `useState` would hand back a fresh, empty cache on every
 * language switch and refetch the entire page's data.
 *
 * Kept per-request on the server so one user's cache can never leak into
 * another's.
 */
let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();

  return browserQueryClient;
}

/**
 * Root provider tree wrapping every page via `app/[locale]/layout.tsx`.
 *
 * Composes `QueryClientProvider` (React Query) and `AuthProvider`
 * (JWT + OAuth context). The `QueryClient` is module-scoped in the
 * browser so the cache survives locale switches, and per-request on
 * the server to prevent cross-user data leaks.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
