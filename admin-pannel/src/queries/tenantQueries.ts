import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { tenantsApi } from '../api/tenants.api';
import {
  CreateTenantInput,
  PaginatedResponse,
  Tenant,
  TenantFilters,
  TenantStatus,
  UpdateTenantInput,
} from '../types/tenant.types';
import { queryKeys } from './queryKeys';

export const tenantListQueryOptions = (filters: TenantFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.tenants.list(filters),
    queryFn: ({ signal }) => tenantsApi.getTenants(filters, signal),
    staleTime: 1000 * 60 * 3,
    placeholderData: (prev) => prev,
  });

export const tenantDetailsQueryOptions = (tenantId: string) =>
  queryOptions({
    queryKey: queryKeys.tenants.detail(tenantId),
    queryFn: ({ signal }) => tenantsApi.getTenantById(tenantId, signal),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(tenantId),
  });

// Dependent Query: Users belonging to this tenant (Page 17)
export const tenantUsersQueryOptions = (tenantId: string) =>
  queryOptions({
    queryKey: queryKeys.tenants.users(tenantId),
    queryFn: ({ signal }) => tenantsApi.getTenantUsers(tenantId, signal),
    enabled: Boolean(tenantId), // dependent query
    staleTime: 1000 * 60 * 3,
  });

// Create Tenant
export const useCreateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => tenantsApi.createTenant(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// Update Tenant
export const useUpdateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTenantInput) => tenantsApi.updateTenant(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Tenant>(queryKeys.tenants.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// Optimistic Tenant Status Update (Page 18)
export const useUpdateTenantStatusOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, status }: { tenantId: string; status: TenantStatus }) =>
      tenantsApi.updateTenantStatus(tenantId, status),

    onMutate: async ({ tenantId, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tenants.all });

      const previousTenantsLists = queryClient.getQueriesData<PaginatedResponse<Tenant>>({
        queryKey: queryKeys.tenants.all,
      });

      const previousTenantDetail = queryClient.getQueryData<Tenant>(
        queryKeys.tenants.detail(tenantId)
      );

      // Optimistically update list
      queryClient.setQueriesData<PaginatedResponse<Tenant>>(
        { queryKey: queryKeys.tenants.all },
        (old: PaginatedResponse<Tenant> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((t: Tenant) => (t.id === tenantId ? { ...t, status } : t)),
          };
        }
      );

      if (previousTenantDetail) {
        queryClient.setQueryData<Tenant>(queryKeys.tenants.detail(tenantId), {
          ...previousTenantDetail,
          status,
        });
      }

      return { previousTenantsLists, previousTenantDetail, tenantId };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTenantsLists) {
        context.previousTenantsLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousTenantDetail && context.tenantId) {
        queryClient.setQueryData(
          queryKeys.tenants.detail(context.tenantId),
          context.previousTenantDetail
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tenants.detail(variables.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// Delete Tenant
export const useDeleteTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => tenantsApi.deleteTenant(tenantId),
    onSuccess: (_data, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.tenants.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};
