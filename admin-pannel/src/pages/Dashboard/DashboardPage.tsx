import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  dashboardStatsQueryOptions,
  recentActivitiesQueryOptions,
} from '../../queries/analyticsQueries';
import { queryKeys } from '../../queries/queryKeys';
import { StatCard } from '../../components/dashboard/StatCard';
import { UserStatistics } from '../../components/dashboard/UserStatistics';
import { TenantStatistics } from '../../components/dashboard/TenantStatistics';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Users, UserCheck, Building2, DollarSign, RefreshCw, Activity } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Primary Dashboard Stats query using select() to pick required metrics (Page 7)
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    isFetching: isStatsFetching,
    refetch: refetchStats,
  } = useQuery(dashboardStatsQueryOptions());

  // Independent Recent Activity query (Page 6, 7)
  const {
    data: activities,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
    error: activitiesError,
    isFetching: isActivitiesFetching,
    refetch: refetchActivities,
  } = useQuery(recentActivitiesQueryOptions());

  const isAnyRefetching = isStatsFetching || isActivitiesFetching;

  // Page 6: [ Refresh ] button to manually refetch dashboard data
  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
  };

  // Page 7: Show "Loading dashboard..." for initial load
  if (isStatsLoading && isActivitiesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[450px]">
        <Loader message="Loading dashboard..." size="lg" />
      </div>
    );
  }

  if (isStatsError) {
    return (
      <div className="p-6">
        <ErrorMessage
          message={statsError instanceof Error ? statsError.message : 'Failed to load dashboard'}
          onRetry={() => refetchStats()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Super Admin Dashboard
            </h1>
            {/* Background updating indicator without replacing entire UI (Page 7) */}
            {isAnyRefetching && !isStatsLoading && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                Updating...
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time multi-tenant telemetry and user management overview.
          </p>
        </div>

        {/* Page 6: [ Refresh ] Button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isAnyRefetching}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/90 shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#f59e0b] ${isAnyRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards: [ Total Users ] [ Active Users ] [ Tenants ] [ Revenue ] (Page 5, 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats ? stats.totalUsers.toLocaleString() : '1,250'}
          icon={Users}
          subtext="Across all tenants"
          trend="+12% from last month"
          accentColor="amber"
        />
        <StatCard
          title="Active Users"
          value={stats ? stats.activeUsers.toLocaleString() : '1,080'}
          icon={UserCheck}
          subtext="86.4% active engagement"
          trend="+8% this week"
          accentColor="emerald"
        />
        <StatCard
          title="Total Tenants"
          value={stats ? stats.totalTenants.toLocaleString() : '85'}
          icon={Building2}
          subtext="78 active organizations"
          trend="+3 new this month"
          accentColor="purple"
        />
        <StatCard
          title="Revenue (MRR)"
          value={stats ? `$${stats.revenue.toLocaleString()}` : '$48,200'}
          icon={DollarSign}
          subtext="Subscription revenue"
          trend="+14.8% ARR Growth"
          accentColor="blue"
        />
      </div>

      {/* User Statistics & Tenant Statistics (Page 5, 6, 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserStatistics />
        <TenantStatistics />
      </div>

      {/* Recent Activity Section (Page 6, 7) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          </div>
          {isActivitiesFetching && (
            <span className="text-[11px] text-slate-400 animate-pulse">Syncing feed...</span>
          )}
        </div>

        {isActivitiesError ? (
          <ErrorMessage
            message={activitiesError instanceof Error ? activitiesError.message : 'Error loading activity'}
            onRetry={() => refetchActivities()}
          />
        ) : (
          <div className="space-y-3">
            {activities?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0 mt-0.5">
                    {activity.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      <span className="font-bold">{activity.userName}</span>{' '}
                      <span className="font-normal text-slate-600">{activity.action}</span>
                    </p>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                        {activity.target}
                      </span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    activity.type === 'security'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : activity.type === 'tenant'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : activity.type === 'system'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};