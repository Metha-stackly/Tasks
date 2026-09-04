import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { auditLogQueries } from '../../queries/auditLogQueries';
import { userQueries } from '../../queries/userQueries';
import { tenantQueries } from '../../queries/tenantQueries';
import { AuditLogDetails } from '../../components/auditLogs/AuditLogDetails';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { ArrowLeft } from 'lucide-react';

export const AuditLogDetailsPage: React.FC = () => {
  const { auditLogId = '' } = useParams<{ auditLogId: string }>();
  const navigate = useNavigate();

  // 1. Primary Audit Log Query: queryKey ["auditLog", auditLogId]
  const {
    data: auditLog,
    isLoading: isLogLoading,
    isFetching: isLogFetching,
    error: logError,
    refetch: refetchLog,
  } = useQuery(auditLogQueries.detail(auditLogId));

  // 2. Dependent Query: Related User Query
  // Depends on auditLog.userId, enabled: !!auditLog?.userId
  const {
    data: relatedUser,
    isLoading: isUserLoading,
  } = useQuery({
    ...userQueries.detail(auditLog?.userId || ''),
    enabled: !!auditLog?.userId,
  });

  // 3. Dependent Query: Related Tenant Query
  // Depends on auditLog.tenantId, enabled: !!auditLog?.tenantId
  const {
    data: relatedTenant,
    isLoading: isTenantLoading,
  } = useQuery({
    ...tenantQueries.detail(auditLog?.tenantId || ''),
    enabled: !!auditLog?.tenantId,
  });

  if (isLogLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader text="Fetching audit event details..." size="lg" />
      </div>
    );
  }

  if (logError || !auditLog) {
    return (
      <ErrorState
        title="Audit Log Event Not Found"
        message={logError ? logError.message : `No audit record found for ID: ${auditLogId}`}
        onRetry={refetchLog}
        isRetrying={isLogFetching}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => navigate('/audit-logs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Audit Logs
        </button>

        <div className="flex items-center gap-2">
          {isLogFetching && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
              Syncing
            </span>
          )}
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {auditLog.id}
          </span>
        </div>
      </div>

      {/* Audit Log Details Component with dependent queries */}
      <AuditLogDetails
        auditLog={auditLog}
        relatedUser={relatedUser}
        isUserLoading={isUserLoading}
        relatedTenant={relatedTenant}
        isTenantLoading={isTenantLoading}
      />
    </div>
  );
};
