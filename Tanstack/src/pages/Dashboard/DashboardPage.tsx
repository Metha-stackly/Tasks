import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsQueries } from '../../queries/analyticsQueries';
import { StatCard } from '../../components/dashboard/StatCard';
import { UserStatistics } from '../../components/dashboard/UserStatistics';
import { TenantStatistics } from '../../components/dashboard/TenantStatistics';
import { ErrorState } from '../../components/common/ErrorState';
import { Loader } from '../../components/common/Loader';
import {
  Users,
  UserCheck,
  Building2,
  DollarSign,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  // 1. Independent Query: Overview (transformed via `select` in analyticsQueries.overview)
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    error: overviewError,
    refetch: refetchOverview,
    dataUpdatedAt,
  } = useQuery(analyticsQueries.overview());

  // 2. Independent Query: User Statistics
  const {
    data: userStats,
    isLoading: isUserStatsLoading,
    isFetching: isUserStatsFetching,
    error: userStatsError,
    refetch: refetchUserStats,
  } = useQuery(analyticsQueries.userStats());

  // 3. Independent Query: Tenant Statistics
  const {
    data: tenantStats,
    isLoading: isTenantStatsLoading,
    isFetching: isTenantStatsFetching,
    error: tenantStatsError,
    refetch: refetchTenantStats,
  } = useQuery(analyticsQueries.tenantStats());

  // 4. Independent Query: Recent Activity
  const {
    data: recentActivity,
    isLoading: isActivityLoading,
    isFetching: isActivityFetching,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery(analyticsQueries.recentActivity());

  // Master Refresh Handler: refetches all independent dashboard queries
  const handleRefreshAll = () => {
    refetchOverview();
    refetchUserStats();
    refetchTenantStats();
    refetchActivity();
  };

  const isAnyFetching =
    isOverviewFetching || isUserStatsFetching || isTenantStatsFetching || isActivityFetching;

  // Format updated timestamp
  const updatedTimeString = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return (
    <div className="space-y-6">
      {/* Header bar matching spec */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Enterprise operational overview & health telemetry</span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              Last updated: {updatedTimeString}
            </span>
          </p>
        </div>

        {/* Global Refresh Button */}
        <div className="flex items-center gap-3">
          {isAnyFetching && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Background Syncing...
            </span>
          )}

          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isAnyFetching}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isAnyFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Global Error Notice if overview query fails */}
      {overviewError && (
        <ErrorState
          title="Failed to Load Dashboard Overview"
          message={overviewError.message}
          onRetry={refetchOverview}
          isRetrying={isOverviewFetching}
        />
      )}

      {/* Primary 4 Stat Cards: [ Total Users ] [ Active Users ] [ Tenants ] [ Revenue ] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={overview?.totalUsers ?? '—'}
          subtext={`${overview?.inactiveUsers ?? 0} Inactive / Suspended`}
          trend={overview?.activeUserGrowthRate ?? 12}
          icon={<Users className="w-5 h-5" />}
          isLoading={isOverviewLoading}
          isFetching={isOverviewFetching}
        />

        <StatCard
          title="Active Users"
          value={overview?.activeUsers ?? '—'}
          subtext="Currently authenticated sessions"
          trend={8.4}
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          isLoading={isOverviewLoading}
          isFetching={isOverviewFetching}
        />

        <StatCard
          title="Tenants"
          value={overview?.totalTenants ?? '—'}
          subtext={`${overview?.activeTenants ?? 0} Active organizations`}
          trend={15.2}
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          isLoading={isOverviewLoading}
          isFetching={isOverviewFetching}
        />

        <StatCard
          title="Revenue"
          value={overview?.totalRevenueFormatted ?? '—'}
          subtext="Monthly recurring run-rate"
          trend={overview?.revenueGrowthRate ?? 23.4}
          icon={<DollarSign className="w-5 h-5 text-amber-600" />}
          isLoading={isOverviewLoading}
          isFetching={isOverviewFetching}
        />
      </div>

      {/* Two-column Statistics Section: User Statistics & Tenant Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userStatsError ? (
          <ErrorState
            title="User Metrics Error"
            message={userStatsError.message}
            onRetry={refetchUserStats}
            isRetrying={isUserStatsFetching}
          />
        ) : (
          <UserStatistics
            data={userStats}
            isLoading={isUserStatsLoading}
            isFetching={isUserStatsFetching}
          />
        )}

        {tenantStatsError ? (
          <ErrorState
            title="Tenant Metrics Error"
            message={tenantStatsError.message}
            onRetry={refetchTenantStats}
            isRetrying={isTenantStatsFetching}
          />
        ) : (
          <TenantStatistics
            data={tenantStats}
            isLoading={isTenantStatsLoading}
            isFetching={isTenantStatsFetching}
          />
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          </div>
          {isActivityFetching && (
            <span className="text-2xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Updating
            </span>
          )}
        </div>

        {isActivityLoading ? (
          <div className="py-8 flex justify-center">
            <Loader text="Loading live event telemetry..." />
          </div>
        ) : activityError ? (
          <ErrorState
            title="Activity Feed Error"
            message={activityError.message}
            onRetry={refetchActivity}
            isRetrying={isActivityFetching}
          />
        ) : !recentActivity || recentActivity.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No recent activities logged.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === 'Success'
                        ? 'bg-emerald-50 text-emerald-600'
                        : item.status === 'Failed'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {item.status === 'Success' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : item.status === 'Failed' ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">{item.action}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600">{item.target}</span>
                    <p className="text-2xs text-slate-400 mt-0.5">By {item.actor}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-slate-400 text-2xs">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
