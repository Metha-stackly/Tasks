export interface DashboardOverviewRaw {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
  totalRevenue: number;
  currency: string;
  monthlyRecurringRevenue: number;
  annualRunRate: number;
  userGrowthRate: number;
  tenantGrowthRate: number;
  revenueGrowthRate: number;
  serverHealth: string;
  uptimeSeconds: number;
  lastCalculatedAt: string;
}

export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTenants: number;
  activeTenants: number;
  totalRevenueFormatted: string;
  revenueGrowthRate: number;
  activeUserGrowthRate: number;
}

export interface UserStatisticsData {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: { role: string; count: number; percentage: number }[];
  recentSignupsCount: number;
  activePercentage: number;
}

export interface TenantStatisticsData {
  total: number;
  active: number;
  inactive: number;
  byPlan: { plan: string; count: number; percentage: number; revenue: number }[];
  avgUsersPerTenant: number;
  totalMRR: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'user' | 'tenant' | 'system' | 'security';
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Pending';
}
