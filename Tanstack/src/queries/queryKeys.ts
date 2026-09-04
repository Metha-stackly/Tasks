import type { UserFilters } from '../types/user.types';
import type { TenantFilters } from '../types/tenant.types';
import type { AuditLogFilters } from '../types/auditLog.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => ['users', filters] as const,
  details: () => ['user'] as const,
  detail: (userId: string) => ['user', userId] as const,
  activity: (userId: string) => ['userActivity', userId] as const,
};

export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters: TenantFilters) => ['tenants', filters] as const,
  details: () => ['tenant'] as const,
  detail: (tenantId: string) => ['tenant', tenantId] as const,
  users: (tenantId: string) => ['tenantUsers', tenantId] as const,
};

export const auditLogKeys = {
  all: ['auditLogs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (filters: AuditLogFilters) => ['auditLogs', filters] as const,
  details: () => ['auditLog'] as const,
  detail: (auditLogId: string) => ['auditLog', auditLogId] as const,
};

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => ['analytics', 'overview'] as const,
  userStats: () => ['analytics', 'userStats'] as const,
  tenantStats: () => ['analytics', 'tenantStats'] as const,
  recentActivity: () => ['analytics', 'recentActivity'] as const,
};
