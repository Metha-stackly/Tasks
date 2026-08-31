import {
  queryOptions,
  useMutation,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { activityApi } from '../api/activity.api';
import {
  CreateUserInput,
  PaginatedResponse,
  UpdateUserInput,
  User,
  UserFilters,
  UserStatus,
} from '../types/user.types';
import { queryKeys } from './queryKeys';

// Reusable Query Options with queryOptions() (Page 18, 19)
export const userListQueryOptions = (filters: UserFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.users.list(filters),
    queryFn: ({ signal }) => usersApi.getUsers(filters, signal),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData, // keep previous data while pagination/filtering
  });

export const userDetailsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.users.detail(userId),
    queryFn: ({ signal }) => usersApi.getUserById(userId, signal),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(userId),
  });

// Dependent Query for User Activity (Page 11-12)
export const userActivityQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.users.activity(userId),
    queryFn: ({ signal }) => activityApi.getUserActivities(userId, signal),
    enabled: Boolean(userId), // Only run if userId exists
    staleTime: 1000 * 60 * 3,
  });

// Hook for Multi-User Comparison using useQueries() (Page 15)
export const useCompareUsers = (userIds: string[]) => {
  return useQueries({
    queries: userIds.map((id) => ({
      queryKey: queryKeys.users.detail(id),
      queryFn: ({ signal }: { signal?: AbortSignal }) => usersApi.getUserById(id, signal),
      staleTime: 1000 * 60 * 5,
      enabled: Boolean(id),
    })),
  });
};

// Create User Mutation (Page 12)
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.createUser(input),
    onSuccess: () => {
      // Invalidate all user lists to fetch newly created user
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// Edit User Mutation (Page 13)
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => usersApi.updateUser(input),
    onSuccess: (updatedUser) => {
      // Direct cache manipulation & invalidation (Page 13, 14, 15)
      queryClient.setQueryData<User>(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// Optimistic User Status Update (Page 13, 14)
export const useUpdateUserStatusOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      usersApi.updateUserStatus(userId, status),

    // Flow: onMutate -> Save previous cache -> Update cache optimistically -> Return context
    onMutate: async ({ userId, status }) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      // 2. Snapshot the previous queries data
      const previousUsersLists = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: queryKeys.users.all,
      });

      const previousUserDetail = queryClient.getQueryData<User>(
        queryKeys.users.detail(userId)
      );

      // 3. Optimistically update User List caches
      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: queryKeys.users.all },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((user) =>
              user.id === userId ? { ...user, status } : user
            ),
          };
        }
      );

      // 4. Optimistically update User Detail cache if present
      if (previousUserDetail) {
        queryClient.setQueryData<User>(queryKeys.users.detail(userId), {
          ...previousUserDetail,
          status,
        });
      }

      // Return context with snapshotted values for rollback
      return { previousUsersLists, previousUserDetail, userId };
    },

    // If mutation fails, rollback to snapshot
    onError: (_err, _variables, context) => {
      if (context?.previousUsersLists) {
        context.previousUsersLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousUserDetail && context.userId) {
        queryClient.setQueryData(
          queryKeys.users.detail(context.userId),
          context.previousUserDetail
        );
      }
    },

    // Always refetch / synchronize after error or success
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// Delete User Mutation (Page 13)
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: (_data, deletedUserId) => {
      // Remove deleted item from cache or invalidate
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(deletedUserId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};
