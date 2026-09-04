import type { Tenant, TenantFilters, CreateTenantInput, UpdateTenantInput, TenantStatus, PaginationResponse } from '../types/tenant.types';
import type { User } from '../types/user.types';

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-101',
    name: 'Acme Global Corp',
    plan: 'Enterprise',
    status: 'Active',
    userCount: 38,
    maxUsers: 100,
    contactEmail: 'operations@acmeglobal.io',
    contactPhone: '+1 (555) 234-5678',
    domain: 'acmeglobal.io',
    subscriptionStart: '2025-01-15',
    subscriptionEnd: '2027-01-15',
    mrr: 4800,
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 't-102',
    name: 'TechFlow Systems',
    plan: 'Pro',
    status: 'Active',
    userCount: 16,
    maxUsers: 50,
    contactEmail: 'admin@techflow.dev',
    contactPhone: '+1 (555) 345-6789',
    domain: 'techflow.dev',
    subscriptionStart: '2025-03-01',
    subscriptionEnd: '2026-03-01',
    mrr: 1200,
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-01-20T11:15:00Z',
  },
  {
    id: 't-103',
    name: 'OmniVanguard Logistics',
    plan: 'Enterprise',
    status: 'Active',
    userCount: 64,
    maxUsers: 200,
    contactEmail: 'devops@omnivanguard.com',
    contactPhone: '+1 (555) 456-7890',
    domain: 'omnivanguard.com',
    subscriptionStart: '2024-11-20',
    subscriptionEnd: '2026-11-20',
    mrr: 7500,
    createdAt: '2024-11-20T08:00:00Z',
    updatedAt: '2026-02-18T16:45:00Z',
  },
  {
    id: 't-104',
    name: 'Lumina Health Labs',
    plan: 'Pro',
    status: 'Inactive',
    userCount: 9,
    maxUsers: 30,
    contactEmail: 'compliance@luminahealth.org',
    contactPhone: '+1 (555) 567-8901',
    domain: 'luminahealth.org',
    subscriptionStart: '2025-06-10',
    subscriptionEnd: '2026-06-10',
    mrr: 950,
    createdAt: '2025-06-10T12:00:00Z',
    updatedAt: '2026-02-01T09:20:00Z',
  },
  {
    id: 't-105',
    name: 'Pinnacle Analytics',
    plan: 'Starter',
    status: 'Active',
    userCount: 4,
    maxUsers: 10,
    contactEmail: 'founders@pinnacle.ai',
    contactPhone: '+1 (555) 678-9012',
    domain: 'pinnacle.ai',
    subscriptionStart: '2025-09-01',
    subscriptionEnd: '2026-09-01',
    mrr: 299,
    createdAt: '2025-09-01T15:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 't-106',
    name: 'Starlight Media Group',
    plan: 'Starter',
    status: 'Inactive',
    userCount: 2,
    maxUsers: 10,
    contactEmail: 'contact@starlightmedia.co',
    contactPhone: '+1 (555) 789-0123',
    domain: 'starlightmedia.co',
    subscriptionStart: '2025-10-15',
    subscriptionEnd: '2026-10-15',
    mrr: 299,
    createdAt: '2025-10-15T11:30:00Z',
    updatedAt: '2026-02-14T13:10:00Z',
  },
  {
    id: 't-107',
    name: 'Nexus Cyber Security',
    plan: 'Enterprise',
    status: 'Active',
    userCount: 25,
    maxUsers: 100,
    contactEmail: 'security@nexuscyber.net',
    contactPhone: '+1 (555) 890-1234',
    domain: 'nexuscyber.net',
    subscriptionStart: '2025-02-01',
    subscriptionEnd: '2027-02-01',
    mrr: 5200,
    createdAt: '2025-02-01T14:20:00Z',
    updatedAt: '2026-02-28T18:00:00Z',
  },
  {
    id: 't-108',
    name: 'Quantum Softworks',
    plan: 'Pro',
    status: 'Active',
    userCount: 12,
    maxUsers: 50,
    contactEmail: 'hello@quantumsoft.io',
    contactPhone: '+1 (555) 901-2345',
    domain: 'quantumsoft.io',
    subscriptionStart: '2025-05-18',
    subscriptionEnd: '2026-05-18',
    mrr: 1450,
    createdAt: '2025-05-18T09:15:00Z',
    updatedAt: '2026-02-22T15:40:00Z',
  }
];

const TENANTS_STORAGE_KEY = 'superadmin_tenants';

export function getStoredTenants(): Tenant[] {
  try {
    const raw = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(INITIAL_TENANTS));
      return INITIAL_TENANTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TENANTS;
  }
}

export function saveStoredTenants(tenants: Tenant[]): void {
  try {
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
  } catch {
    // ignore
  }
}

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

export const tenantsApi = {
  async fetchTenants(filters: TenantFilters, signal?: AbortSignal): Promise<PaginationResponse<Tenant>> {
    await delay(300, signal);
    let all = getStoredTenants();

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      all = all.filter(t => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q));
    }

    if (filters.plan && filters.plan !== 'All') {
      all = all.filter(t => t.plan === filters.plan);
    }

    if (filters.status && filters.status !== 'All') {
      all = all.filter(t => t.status === filters.status);
    }

    const page = Math.max(1, filters.page || 1);
    const limit = filters.limit || 4;
    const total = all.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async fetchTenantById(tenantId: string, signal?: AbortSignal): Promise<Tenant> {
    await delay(250, signal);
    const all = getStoredTenants();
    const found = all.find(t => t.id === tenantId);
    if (!found) {
      throw new Error(`Tenant with ID ${tenantId} not found`);
    }
    return found;
  },

  async fetchTenantUsers(tenantId: string, signal?: AbortSignal): Promise<User[]> {
    await delay(350, signal);
    try {
      const usersRaw = localStorage.getItem('superadmin_users');
      if (usersRaw) {
        const users: User[] = JSON.parse(usersRaw);
        return users.filter(u => u.tenantId === tenantId);
      }
    } catch {
      // fallback
    }
    return [];
  },

  async createTenant(input: CreateTenantInput): Promise<Tenant> {
    await delay(400);
    const all = getStoredTenants();
    const newTenant: Tenant = {
      ...input,
      id: `t-${Date.now().toString().slice(-4)}`,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTenant, ...all];
    saveStoredTenants(updated);
    return newTenant;
  },

  async updateTenant(id: string, input: UpdateTenantInput): Promise<Tenant> {
    await delay(350);
    const all = getStoredTenants();
    const index = all.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tenant with ID ${id} not found`);
    }
    const updatedTenant: Tenant = {
      ...all[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updatedTenant;
    saveStoredTenants(all);
    return updatedTenant;
  },

  async updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant> {
    await delay(300);
    const all = getStoredTenants();
    const index = all.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tenant with ID ${id} not found`);
    }
    const updatedTenant: Tenant = {
      ...all[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updatedTenant;
    saveStoredTenants(all);
    return updatedTenant;
  },

  async deleteTenant(id: string): Promise<{ success: boolean; id: string }> {
    await delay(350);
    const all = getStoredTenants();
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length === all.length) {
      throw new Error(`Tenant with ID ${id} not found`);
    }
    saveStoredTenants(filtered);
    return { success: true, id };
  },
};
