import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import { auditLogKeys } from './queryKeys';
import { auditLogsApi } from '../api/auditLogs.api';
import type { AuditLogFilters } from '../types/auditLog.types';

export const auditLogQueries = {
  list: (filters: AuditLogFilters) =>
    queryOptions({
      queryKey: auditLogKeys.list(filters),
      queryFn: ({ signal }) => auditLogsApi.fetchAuditLogs(filters, signal),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30,
    }),

  detail: (auditLogId: string) =>
    queryOptions({
      queryKey: auditLogKeys.detail(auditLogId),
      queryFn: ({ signal }) => auditLogsApi.fetchAuditLogById(auditLogId, signal),
      enabled: !!auditLogId,
      staleTime: 1000 * 60 * 2,
    }),
};
