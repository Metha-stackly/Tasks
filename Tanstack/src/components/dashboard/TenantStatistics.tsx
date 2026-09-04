import React from 'react';
import type { TenantStatisticsData } from '../../types/analytics.types';
import { Loader } from '../common/Loader';
import { Building2, CheckCircle2, DollarSign } from 'lucide-react';

interface TenantStatisticsProps {
  data?: TenantStatisticsData;
  isLoading: boolean;
  isFetching?: boolean;
}

export const TenantStatistics: React.FC<TenantStatisticsProps> = ({
  data,
  isLoading,
  isFetching,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-72 flex items-center justify-center">
        <Loader text="Loading tenant metrics..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-72 flex items-center justify-center text-slate-400">
        No tenant metrics available
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Tenant Statistics
            {isFetching && (
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Syncing
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Subscription tier distribution and health</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
            ~{data.avgUsersPerTenant} users / tenant
          </span>
        </div>
      </div>

      {/* Breakdown Badges */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Total
          </div>
          <p className="text-lg font-bold text-slate-900">{data.total}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Active
          </div>
          <p className="text-lg font-bold text-slate-900">{data.active}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            Total MRR
          </div>
          <p className="text-lg font-bold text-slate-900">${data.totalMRR.toLocaleString()}</p>
        </div>
      </div>

      {/* Tier distribution */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Tenants by Subscription Plan
        </h4>
        <div className="space-y-3">
          {data.byPlan.map(item => (
            <div key={item.plan} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  item.plan === 'Enterprise' ? 'bg-purple-500' : item.plan === 'Pro' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <span className="text-xs font-semibold text-slate-800">{item.plan}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500 font-medium">{item.count} tenants</span>
                <span className="font-bold text-slate-900">${item.revenue.toLocaleString()}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
