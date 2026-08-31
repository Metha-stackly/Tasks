import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tenantStatisticsQueryOptions } from '../../queries/analyticsQueries';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import { Building2, HardDrive, Award } from 'lucide-react';

export const TenantStatistics: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery(
    tenantStatisticsQueryOptions()
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs min-h-[220px] flex items-center justify-center">
        <Loader message="Loading tenant statistics..." size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Error loading tenant statistics'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
      {isFetching && (
        <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
          Updating...
        </span>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="w-5 h-5 text-[#f59e0b]" />
        <h3 className="text-base font-bold text-slate-900">Tenant Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg Users / Tenant</p>
            <p className="text-lg font-bold text-slate-800">{data.avgUsersPerTenant}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Storage Used</p>
            <p className="text-lg font-bold text-slate-800">{data.storageCapacityUsedPercent}%</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Top Tenants by User Count</span>
        </h4>
        <div className="space-y-2">
          {data.topTenantsByUsers.map((tenant) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100/80 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span className="text-xs font-semibold text-slate-800">{tenant.name}</span>
                <span className="text-[11px] px-2 py-0.5 bg-white text-slate-600 rounded border border-slate-200">
                  {tenant.plan}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-700">{tenant.users} users</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
