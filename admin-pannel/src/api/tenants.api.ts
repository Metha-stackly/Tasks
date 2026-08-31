import {
  Tenant,
  TenantFilters,
  CreateTenantInput,
  UpdateTenantInput,
  TenantStatus,
} from '../types/tenant.types';
import { User, PaginatedResponse } from '../types/user.types';
import { mockTenants, mockUsers, delay } from './mockData';

export const tenantsApi = {
  // Get all tenants with search, status, plan, pagination
  getTenants: async (
    filters: TenantFilters = {},
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Tenant>> => {
    await delay(300, signal);

    let filtered = [...mockTenants];

    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.contactEmail.toLowerCase().includes(searchLower) ||
          t.id.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.plan) {
      filtered = filtered.filter((t) => t.plan === filters.plan);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 5;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  },

  // Get tenant by ID
  getTenantById: async (tenantId: string, signal?: AbortSignal): Promise<Tenant> => {
    await delay(250, signal);
    const tenant = mockTenants.find((t) => t.id === tenantId);
    if (!tenant) {
      throw new Error(`Tenant with ID "${tenantId}" not found`);
    }
    return { ...tenant };
  },

  // Get users belonging to a tenant (Dependent Query)
  getTenantUsers: async (tenantId: string, signal?: AbortSignal): Promise<User[]> => {
    await delay(300, signal);
    const users = mockUsers.filter((u) => u.tenantId === tenantId);
    return users.map((u) => ({ ...u }));
  },

  // Create Tenant
  createTenant: async (input: CreateTenantInput): Promise<Tenant> => {
    await delay(400);

    if (!input.name || !input.contactEmail) {
      throw new Error('Tenant name and contact email are required.');
    }

    const planRevenueMap = {
      Starter: 2400,
      Professional: 6500,
      Enterprise: 15000,
    };

    const newTenant: Tenant = {
      id: `ten-${Date.now()}`,
      name: input.name,
      plan: input.plan,
      status: input.status,
      userCount: 0,
      createdAt: new Date().toISOString(),
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone || '+1 (555) 000-0000',
      address: input.address || 'Corporate Headquarters',
      monthlyRevenue: planRevenueMap[input.plan] || 3000,
      storageUsedGb: 10,
    };

    mockTenants.unshift(newTenant);
    return { ...newTenant };
  },

  // Update Tenant
  updateTenant: async (input: UpdateTenantInput): Promise<Tenant> => {
    await delay(350);

    const index = mockTenants.findIndex((t) => t.id === input.id);
    if (index === -1) {
      throw new Error(`Tenant with ID "${input.id}" not found`);
    }

    const updated: Tenant = {
      ...mockTenants[index],
      ...input,
    };

    mockTenants[index] = updated;
    return { ...updated };
  },

  // Optimistic Tenant Status update
  updateTenantStatus: async (tenantId: string, status: TenantStatus): Promise<Tenant> => {
    await delay(450);

    const index = mockTenants.findIndex((t) => t.id === tenantId);
    if (index === -1) {
      throw new Error(`Tenant with ID "${tenantId}" not found`);
    }

    mockTenants[index] = {
      ...mockTenants[index],
      status,
    };

    return { ...mockTenants[index] };
  },

  // Delete Tenant
  deleteTenant: async (tenantId: string): Promise<{ success: boolean; id: string }> => {
    await delay(400);

    const index = mockTenants.findIndex((t) => t.id === tenantId);
    if (index === -1) {
      throw new Error(`Tenant with ID "${tenantId}" not found`);
    }

    mockTenants.splice(index, 1);
    return { success: true, id: tenantId };
  },
};
