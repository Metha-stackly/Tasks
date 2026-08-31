import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userStatisticsQueryOptions } from '../../queries/analyticsQueries';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';

export const UserStatistics: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery(
    userStatisticsQueryOptions()
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs min-h-[220px] flex items-center justify-center">
        <Loader message="Loading user statistics..." size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Error loading user statistics'}
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
        <Users className="w-5 h-5 text-amber-600" />
        <h3 className="text-base font-bold text-slate-900">User Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Weekly Signups</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">+{data.weeklyNewSignups}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Retention Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">{data.retentionRate}%</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Avg Sessions/Day</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">{data.averageSessionsPerDay}</p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Role Breakdown
        </h4>
        <div className="space-y-2.5">
          {data.roleBreakdown.map((roleItem) => (
            <div key={roleItem.role} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>{roleItem.role}</span>
                <span>
                  {roleItem.count} users ({roleItem.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0a1128] rounded-full transition-all duration-500"
                  style={{ width: `${roleItem.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
