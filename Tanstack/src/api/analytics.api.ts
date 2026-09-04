import type {
  DashboardOverviewRaw,
  UserStatisticsData,
  TenantStatisticsData,
  RecentActivityItem
} from '../types/analytics.types';
import { getStoredUsers } from './users.api';
import { getStoredTenants } from './tenants.api';

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Request aborted', 'AbortError'));
    }
    const timer = setTimeout(() => {
      resolve();
    }, ms);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Request aborted', 'AbortError'));
    });
  });
}

export const analyticsApi = {
  // Returns raw dashboard data with additional extraneous server fields
  // so `select` in TanStack Query transforms it to the DashboardOverview model
  async fetchOverviewRaw(signal?: AbortSignal): Promise<DashboardOverviewRaw> {
    await delay(350, signal);
    const users = getStoredUsers();
    const tenants = getStoredTenants();

    const activeUsers = users.filter(u => u.status === 'Active').length;
    const inactiveUsers = users.filter(u => u.status === 'Inactive').length;
    const suspendedUsers = users.filter(u => u.status === 'Suspended').length;

    const activeTenants = tenants.filter(t => t.status === 'Active').length;
    const inactiveTenants = tenants.filter(t => t.status === 'Inactive').length;

    const totalMRR = tenants.reduce((acc, curr) => acc + (curr.mrr || 0), 0);

    return {
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      totalTenants: tenants.length,
      activeTenants,
      inactiveTenants,
      totalRevenue: totalMRR,
      currency: 'USD',
      monthlyRecurringRevenue: totalMRR,
      annualRunRate: totalMRR * 12,
      userGrowthRate: 14.8,
      tenantGrowthRate: 8.2,
      revenueGrowthRate: 23.4,
      serverHealth: 'Optimal',
      uptimeSeconds: 849200,
      lastCalculatedAt: new Date().toISOString(),
    };
  },

  async fetchUserStatistics(signal?: AbortSignal): Promise<UserStatisticsData> {
    await delay(400, signal);
    const users = getStoredUsers();
    const total = users.length;
    const active = users.filter(u => u.status === 'Active').length;
    const inactive = users.filter(u => u.status === 'Inactive').length;
    const suspended = users.filter(u => u.status === 'Suspended').length;

    const roleMap: Record<string, number> = {};
    users.forEach(u => {
      roleMap[u.role] = (roleMap[u.role] || 0) + 1;
    });

    const byRole = Object.entries(roleMap).map(([role, count]) => ({
      role,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    return {
      total,
      active,
      inactive,
      suspended,
      byRole,
      recentSignupsCount: 3,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
    };
  },

  async fetchTenantStatistics(signal?: AbortSignal): Promise<TenantStatisticsData> {
    await delay(350, signal);
    const tenants = getStoredTenants();
    const total = tenants.length;
    const active = tenants.filter(t => t.status === 'Active').length;
    const inactive = tenants.filter(t => t.status === 'Inactive').length;

    const planMap: Record<string, { count: number; revenue: number }> = {};
    tenants.forEach(t => {
      if (!planMap[t.plan]) {
        planMap[t.plan] = { count: 0, revenue: 0 };
      }
      planMap[t.plan].count += 1;
      planMap[t.plan].revenue += t.mrr;
    });

    const byPlan = Object.entries(planMap).map(([plan, data]) => ({
      plan,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      revenue: data.revenue,
    }));

    const totalUsersInTenants = tenants.reduce((sum, t) => sum + (t.userCount || 0), 0);
    const avgUsers = total > 0 ? Math.round(totalUsersInTenants / total) : 0;
    const totalMRR = tenants.reduce((sum, t) => sum + (t.mrr || 0), 0);

    return {
      total,
      active,
      inactive,
      byPlan,
      avgUsersPerTenant: avgUsers,
      totalMRR,
    };
  },

  async fetchRecentActivities(signal?: AbortSignal): Promise<RecentActivityItem[]> {
    await delay(300, signal);
    return [
      {
        id: 'rec-1',
        type: 'user',
        action: 'User Status Updated',
        actor: 'Admin (System)',
        target: 'David Vance -> Active',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        status: 'Success',
      },
      {
        id: 'rec-2',
        type: 'tenant',
        action: 'Tenant Plan Upgraded',
        actor: 'Johnathan Archer',
        target: 'OmniVanguard Logistics -> Enterprise',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'Success',
      },
      {
        id: 'rec-3',
        type: 'system',
        action: 'Automated Snapshot Backup',
        actor: 'Cron Runner',
        target: 'Database Cluster-01',
        timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
        status: 'Success',
      },
      {
        id: 'rec-4',
        type: 'security',
        action: 'Failed Login Challenge',
        actor: 'Unknown IP (104.28.14.9)',
        target: 'Elena Rostova (Account Locked)',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        status: 'Failed',
      },
      {
        id: 'rec-5',
        type: 'tenant',
        action: 'New Tenant Provisioned',
        actor: 'Super Admin',
        target: 'Quantum Softworks (Pro Plan)',
        timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
        status: 'Success',
      },
    ];
  },
};
