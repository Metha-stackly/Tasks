import React from 'react';
import type { UserStatisticsData } from '../../types/analytics.types';
import { Loader } from '../common/Loader';
import { UserCheck, UserX, ShieldAlert } from 'lucide-react';

interface UserStatisticsProps {
  data?: UserStatisticsData;
  isLoading: boolean;
  isFetching?: boolean;
}

export const UserStatistics: React.FC<UserStatisticsProps> = ({
  data,
  isLoading,
  isFetching,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-72 flex items-center justify-center">
        <Loader text="Loading user metrics..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-72 flex items-center justify-center text-slate-400">
        No user metrics available
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            User Statistics
            {isFetching && (
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Syncing
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Distribution across status and administrative roles</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            {data.activePercentage}% Active
          </span>
        </div>
      </div>

      {/* Breakdown Badges */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Active
          </div>
          <p className="text-lg font-bold text-slate-900">{data.active}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <UserX className="w-3.5 h-3.5 text-slate-500" />
            Inactive
          </div>
          <p className="text-lg font-bold text-slate-900">{data.inactive}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            Suspended
          </div>
          <p className="text-lg font-bold text-slate-900">{data.suspended}</p>
        </div>
      </div>

      {/* Role distribution bars */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Distribution by Role
        </h4>
        <div className="space-y-2.5">
          {data.byRole.map(item => (
            <div key={item.role}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{item.role}</span>
                <span className="text-slate-500">{item.count} users ({item.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
