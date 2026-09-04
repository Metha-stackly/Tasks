import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AuditLogFilters as IAuditLogFilters } from '../../types/auditLog.types';
import { auditLogQueries } from '../../queries/auditLogQueries';
import { AuditLogTable } from '../../components/auditLogs/AuditLogTable';
import { AuditLogFilters } from '../../components/auditLogs/AuditLogFilters';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  // Query filter state represented in query key:
  // ["auditLogs", { search, userId, tenantId, action, status, startDate, endDate, page }]
  const [filters, setFilters] = useState<IAuditLogFilters>({
    search: '',
    userId: 'All',
    tenantId: 'All',
    action: 'All',
    status: 'All',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 6,
  });

  // TanStack Query: list query with placeholderData: keepPreviousData
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(auditLogQueries.list(filters));

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Audit Logs
            {isFetching && (
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                Updating...
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable security event journal, administrative mutations, and tenant compliance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Refetch Audit Logs"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AuditLogFilters filters={filters} onFilterChange={setFilters} />

      {/* State Renderers */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading audit security log events..." size="lg" />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Audit Logs"
          message={error.message}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No audit events found"
          description="There are no audit events matching your search or date criteria."
          icon={<ShieldAlert className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div>
          {/* Audit Log Table with Row & Button prefetching */}
          <AuditLogTable logs={data.data} isFetching={isFetching} />

          {/* Server-side Pagination */}
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalRecords={data.total}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </div>
      )}
    </div>
  );
};
