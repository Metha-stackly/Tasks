import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import { tenantKeys } from './queryKeys';
import { tenantsApi } from '../api/tenants.api';
import type { TenantFilters } from '../types/tenant.types';

export const tenantQueries = {
  list: (filters: TenantFilters) =>
    queryOptions({
      queryKey: tenantKeys.list(filters),
      queryFn: ({ signal }) => tenantsApi.fetchTenants(filters, signal),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30,
    }),

  detail: (tenantId: string) =>
    queryOptions({
      queryKey: tenantKeys.detail(tenantId),
      queryFn: ({ signal }) => tenantsApi.fetchTenantById(tenantId, signal),
      enabled: !!tenantId,
      staleTime: 1000 * 60 * 2,
    }),

  users: (tenantId: string) =>
    queryOptions({
      queryKey: tenantKeys.users(tenantId),
      queryFn: ({ signal }) => tenantsApi.fetchTenantUsers(tenantId, signal),
      enabled: !!tenantId,
      staleTime: 1000 * 60 * 1,
    }),
};
