import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import { userKeys } from './queryKeys';
import { usersApi } from '../api/users.api';
import type { UserFilters } from '../types/user.types';

export const userQueries = {
  list: (filters: UserFilters) =>
    queryOptions({
      queryKey: userKeys.list(filters),
      queryFn: ({ signal }) => usersApi.fetchUsers(filters, signal),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30, // 30s fresh
    }),

  detail: (userId: string) =>
    queryOptions({
      queryKey: userKeys.detail(userId),
      queryFn: ({ signal }) => usersApi.fetchUserById(userId, signal),
      enabled: !!userId,
      staleTime: 1000 * 60 * 2,
    }),

  activity: (userId: string) =>
    queryOptions({
      queryKey: userKeys.activity(userId),
      queryFn: ({ signal }) => usersApi.fetchUserActivity(userId, signal),
      enabled: !!userId,
      staleTime: 1000 * 60 * 1,
    }),
};
