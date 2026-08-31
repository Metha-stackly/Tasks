export interface DashboardRawAnalytics {
  systemHealth: {
    status: 'healthy' | 'warning' | 'degraded';
    uptime: string;
    serverLoad: number;
  };
  metrics: {
    totalUsersCount: number;
    activeUsersCount: number;
    inactiveUsersCount: number;
    suspendedUsersCount: number;
    totalTenantsCount: number;
    activeTenantsCount: number;
    monthlyRecurringRevenue: number;
    annualRunRate: number;
    growthRatePercent: number;
  };
  charts: {
    userGrowth: { month: string; users: number; active: number }[];
    revenueGrowth: { month: string; amount: number }[];
    tenantDistribution: { plan: string; count: number }[];
  };
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  totalTenants: number;
  activeTenants: number;
  revenue: number;
  growthRate: number;
}

export interface UserStatisticsData {
  roleBreakdown: { role: string; count: number; percentage: number }[];
  statusBreakdown: { status: string; count: number }[];
  weeklyNewSignups: number;
  retentionRate: number;
  averageSessionsPerDay: number;
}

export interface TenantStatisticsData {
  planBreakdown: { plan: string; count: number; revenue: number }[];
  avgUsersPerTenant: number;
  topTenantsByUsers: { id: string; name: string; users: number; plan: string }[];
  storageCapacityUsedPercent: number;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'user' | 'tenant' | 'system' | 'security';
}
