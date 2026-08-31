import { UserFilters } from '../types/user.types';
import { TenantFilters } from '../types/tenant.types';

export const queryKeys = {
  // Users Query Keys
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters = {}) => ['users', filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (userId: string) => ['user', userId] as const,
    activities: () => [...queryKeys.users.all, 'activity'] as const,
    activity: (userId: string) => ['userActivity', userId] as const,
  },

  // Tenants Query Keys
  tenants: {
    all: ['tenants'] as const,
    lists: () => [...queryKeys.tenants.all, 'list'] as const,
    list: (filters: TenantFilters = {}) => ['tenants', filters] as const,
    details: () => [...queryKeys.tenants.all, 'detail'] as const,
    detail: (tenantId: string) => ['tenant', tenantId] as const,
    users: (tenantId: string) => ['tenantUsers', tenantId] as const,
  },

  // Analytics Query Keys
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => ['analytics', 'dashboard'] as const,
    userStats: () => ['analytics', 'userStatistics'] as const,
    tenantStats: () => ['analytics', 'tenantStatistics'] as const,
    recentActivity: () => ['analytics', 'recentActivity'] as const,
  },
};
