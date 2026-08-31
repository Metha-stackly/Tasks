import {
  DashboardRawAnalytics,
  UserStatisticsData,
  TenantStatisticsData,
} from '../types/analytics.types';
import { delay } from './mockData';

export const analyticsApi = {
  // Raw API response demonstrating the select() requirement (Page 7)
  getRawDashboardAnalytics: async (signal?: AbortSignal): Promise<DashboardRawAnalytics> => {
    await delay(350, signal);

    return {
      systemHealth: {
        status: 'healthy',
        uptime: '99.98%',
        serverLoad: 24.6,
      },
      metrics: {
        totalUsersCount: 1250,
        activeUsersCount: 1080,
        inactiveUsersCount: 145,
        suspendedUsersCount: 25,
        totalTenantsCount: 85,
        activeTenantsCount: 78,
        monthlyRecurringRevenue: 48200,
        annualRunRate: 578400,
        growthRatePercent: 14.8,
      },
      charts: {
        userGrowth: [
          { month: 'Jan', users: 820, active: 750 },
          { month: 'Feb', users: 930, active: 840 },
          { month: 'Mar', users: 1040, active: 950 },
          { month: 'Apr', users: 1120, active: 1010 },
          { month: 'May', users: 1190, active: 1040 },
          { month: 'Jun', users: 1250, active: 1080 },
        ],
        revenueGrowth: [
          { month: 'Jan', amount: 32000 },
          { month: 'Feb', amount: 36500 },
          { month: 'Mar', amount: 40200 },
          { month: 'Apr', amount: 43100 },
          { month: 'May', amount: 45800 },
          { month: 'Jun', amount: 48200 },
        ],
        tenantDistribution: [
          { plan: 'Enterprise', count: 28 },
          { plan: 'Professional', count: 37 },
          { plan: 'Starter', count: 20 },
        ],
      },
    };
  },

  getUserStatistics: async (signal?: AbortSignal): Promise<UserStatisticsData> => {
    await delay(300, signal);

    return {
      roleBreakdown: [
        { role: 'Super Admin', count: 12, percentage: 1 },
        { role: 'Admin', count: 148, percentage: 12 },
        { role: 'Manager', count: 290, percentage: 23 },
        { role: 'User', count: 680, percentage: 54 },
        { role: 'Viewer', count: 120, percentage: 10 },
      ],
      statusBreakdown: [
        { status: 'Active', count: 1080 },
        { status: 'Inactive', count: 145 },
        { status: 'Suspended', count: 25 },
      ],
      weeklyNewSignups: 42,
      retentionRate: 94.6,
      averageSessionsPerDay: 4.2,
    };
  },

  getTenantStatistics: async (signal?: AbortSignal): Promise<TenantStatisticsData> => {
    await delay(320, signal);

    return {
      planBreakdown: [
        { plan: 'Enterprise (28)', count: 28, revenue: 29400 },
        { plan: 'Professional (37)', count: 37, revenue: 14800 },
        { plan: 'Starter (20)', count: 20, revenue: 4000 },
      ],
      avgUsersPerTenant: 14.7,
      topTenantsByUsers: [
        { id: 'ten-1', name: 'Acme Corporation', users: 420, plan: 'Enterprise' },
        { id: 'ten-2', name: 'Nexus Dynamics', users: 310, plan: 'Enterprise' },
        { id: 'ten-3', name: 'Quantum Labs', users: 180, plan: 'Professional' },
        { id: 'ten-4', name: 'Starlight Retail', users: 125, plan: 'Professional' },
      ],
      storageCapacityUsedPercent: 68.4,
    };
  },
};
