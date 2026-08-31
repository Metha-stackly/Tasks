import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes sensible default
      gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection time (replaces cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry on abort cancellation or 404
        if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('not found'))) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
