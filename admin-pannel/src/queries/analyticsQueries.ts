import { queryOptions } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';
import { activityApi } from '../api/activity.api';
import { DashboardRawAnalytics, DashboardStats } from '../types/analytics.types';
import { queryKeys } from './queryKeys';

// Dashboard Statistics with select() transformation (Page 7)
export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: ({ signal }) => analyticsApi.getRawDashboardAnalytics(signal),
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
    // Using select to provide only the required transformed information (Page 7)
    select: (data: DashboardRawAnalytics): DashboardStats => {
      return {
        totalUsers: data.metrics.totalUsersCount,
        activeUsers: data.metrics.activeUsersCount,
        inactiveUsers: data.metrics.inactiveUsersCount,
        suspendedUsers: data.metrics.suspendedUsersCount,
        totalTenants: data.metrics.totalTenantsCount,
        activeTenants: data.metrics.activeTenantsCount,
        revenue: data.metrics.monthlyRecurringRevenue,
        growthRate: data.metrics.growthRatePercent,
      };
    },
  });

// User Statistics Query
export const userStatisticsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.userStats(),
    queryFn: ({ signal }) => analyticsApi.getUserStatistics(signal),
    staleTime: 1000 * 60 * 4,
    retry: 2,
  });

// Tenant Statistics Query
export const tenantStatisticsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.tenantStats(),
    queryFn: ({ signal }) => analyticsApi.getTenantStatistics(signal),
    staleTime: 1000 * 60 * 4,
    retry: 2,
  });

// Recent Global Activity Query
export const recentActivitiesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.recentActivity(),
    queryFn: ({ signal }) => activityApi.getRecentActivities(6, signal),
    staleTime: 1000 * 30, // 30 seconds for live activities
    refetchInterval: 1000 * 60, // background poll every 60s
  });
