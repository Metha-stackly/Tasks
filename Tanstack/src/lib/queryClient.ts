import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes: data is fresh for 2 mins
      gcTime: 1000 * 60 * 10, // 10 minutes: keep inactive cache for 10 mins before garbage collection
      retry: 2, // retry twice on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // exponential backoff
      refetchOnWindowFocus: false, // prevent unexpected refetches during admin workflows
    },
    mutations: {
      retry: 1,
    },
  },
});
