import { queryOptions } from '@tanstack/react-query';
import { analyticsKeys } from './queryKeys';
import { analyticsApi } from '../api/analytics.api';
import type { DashboardOverview, DashboardOverviewRaw } from '../types/analytics.types';

export const analyticsQueries = {
  // Uses `select` to transform raw server response into clean DashboardOverview model
  overview: () =>
    queryOptions({
      queryKey: analyticsKeys.overview(),
      queryFn: ({ signal }) => analyticsApi.fetchOverviewRaw(signal),
      select: (raw: DashboardOverviewRaw): DashboardOverview => ({
        totalUsers: raw.totalUsers,
        activeUsers: raw.activeUsers,
        inactiveUsers: raw.inactiveUsers,
        totalTenants: raw.totalTenants,
        activeTenants: raw.activeTenants,
        totalRevenueFormatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: raw.currency || 'USD',
          maximumFractionDigits: 0,
        }).format(raw.totalRevenue),
        revenueGrowthRate: raw.revenueGrowthRate,
        activeUserGrowthRate: raw.userGrowthRate,
      }),
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    }),

  userStats: () =>
    queryOptions({
      queryKey: analyticsKeys.userStats(),
      queryFn: ({ signal }) => analyticsApi.fetchUserStatistics(signal),
      staleTime: 1000 * 60,
    }),

  tenantStats: () =>
    queryOptions({
      queryKey: analyticsKeys.tenantStats(),
      queryFn: ({ signal }) => analyticsApi.fetchTenantStatistics(signal),
      staleTime: 1000 * 60,
    }),

  recentActivity: () =>
    queryOptions({
      queryKey: analyticsKeys.recentActivity(),
      queryFn: ({ signal }) => analyticsApi.fetchRecentActivities(signal),
      staleTime: 1000 * 30,
    }),
};
