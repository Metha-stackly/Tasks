import type { User, UserFilters, CreateUserInput, UpdateUserInput, UserStatus, UserActivity, PaginationResponse } from '../types/user.types';
import { getStoredTenants } from './tenants.api';

const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Johnathan Archer',
    email: 'j.archer@acmeglobal.io',
    phone: '+1 (555) 123-4567',
    role: 'Super Admin',
    status: 'Active',
    tenantId: 't-101',
    tenantName: 'Acme Global Corp',
    address: '742 Evergreen Terrace, Springfield, OR',
    company: 'Acme Global Corp',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2026-02-15T08:30:00Z',
  },
  {
    id: 'usr-002',
    name: 'David Vance',
    email: 'david.vance@techflow.dev',
    phone: '+1 (555) 234-5678',
    role: 'Admin',
    status: 'Active',
    tenantId: 't-102',
    tenantName: 'TechFlow Systems',
    address: '100 Innovation Way, Suite 400, Austin, TX',
    company: 'TechFlow Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-03-02T11:20:00Z',
    updatedAt: '2026-01-19T14:40:00Z',
  },
  {
    id: 'usr-003',
    name: 'Sarah Jenkins',
    email: 'sarah.j@acmeglobal.io',
    phone: '+1 (555) 345-6789',
    role: 'Manager',
    status: 'Inactive',
    tenantId: 't-101',
    tenantName: 'Acme Global Corp',
    address: '88 Market St, San Francisco, CA',
    company: 'Acme Global Corp',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-02-10T14:00:00Z',
    updatedAt: '2026-02-05T09:15:00Z',
  },
  {
    id: 'usr-004',
    name: 'Michael Chang',
    email: 'm.chang@omnivanguard.com',
    phone: '+1 (555) 456-7890',
    role: 'Admin',
    status: 'Active',
    tenantId: 't-103',
    tenantName: 'OmniVanguard Logistics',
    address: '500 Technology Square, Cambridge, MA',
    company: 'OmniVanguard Logistics',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2024-11-22T13:30:00Z',
    updatedAt: '2026-02-18T17:00:00Z',
  },
  {
    id: 'usr-005',
    name: 'Elena Rostova',
    email: 'e.rostova@luminahealth.org',
    phone: '+1 (555) 567-8901',
    role: 'User',
    status: 'Suspended',
    tenantId: 't-104',
    tenantName: 'Lumina Health Labs',
    address: '12 Medical Center Blvd, Chicago, IL',
    company: 'Lumina Health Labs',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-06-12T09:45:00Z',
    updatedAt: '2026-02-02T16:20:00Z',
  },
  {
    id: 'usr-006',
    name: 'Marcus Brody',
    email: 'marcus@pinnacle.ai',
    phone: '+1 (555) 678-9012',
    role: 'Admin',
    status: 'Active',
    tenantId: 't-105',
    tenantName: 'Pinnacle Analytics',
    address: '220 Silicon Ave, Palo Alto, CA',
    company: 'Pinnacle Analytics',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-09-03T16:10:00Z',
    updatedAt: '2026-01-14T11:00:00Z',
  },
  {
    id: 'usr-007',
    name: 'Clara Oswald',
    email: 'clara.o@starlightmedia.co',
    phone: '+1 (555) 789-0123',
    role: 'User',
    status: 'Inactive',
    tenantId: 't-106',
    tenantName: 'Starlight Media Group',
    address: '77 Sunset Strip, Los Angeles, CA',
    company: 'Starlight Media Group',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-10-18T12:00:00Z',
    updatedAt: '2026-02-10T15:30:00Z',
  },
  {
    id: 'usr-008',
    name: 'Robert Thorne',
    email: 'r.thorne@nexuscyber.net',
    phone: '+1 (555) 890-1234',
    role: 'Manager',
    status: 'Active',
    tenantId: 't-107',
    tenantName: 'Nexus Cyber Security',
    address: '350 Wall Street, New York, NY',
    company: 'Nexus Cyber Security',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-02-05T15:30:00Z',
    updatedAt: '2026-02-27T10:15:00Z',
  },
  {
    id: 'usr-009',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.m@quantumsoft.io',
    phone: '+1 (555) 901-2345',
    role: 'User',
    status: 'Active',
    tenantId: 't-108',
    tenantName: 'Quantum Softworks',
    address: '420 Quantum Way, Seattle, WA',
    company: 'Quantum Softworks',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-05-20T10:00:00Z',
    updatedAt: '2026-02-21T11:45:00Z',
  }
];

const USERS_STORAGE_KEY = 'superadmin_users';

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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

export const usersApi = {
  async fetchUsers(filters: UserFilters, signal?: AbortSignal): Promise<PaginationResponse<User>> {
    await delay(350, signal);
    let all = getStoredUsers();

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      all = all.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        u.tenantName.toLowerCase().includes(q)
      );
    }

    if (filters.role && filters.role !== 'All') {
      all = all.filter(u => u.role === filters.role);
    }

    if (filters.status && filters.status !== 'All') {
      all = all.filter(u => u.status === filters.status);
    }

    if (filters.tenantId && filters.tenantId !== 'All') {
      all = all.filter(u => u.tenantId === filters.tenantId);
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

  async fetchUserById(userId: string, signal?: AbortSignal): Promise<User> {
    await delay(250, signal);
    const all = getStoredUsers();
    const found = all.find(u => u.id === userId);
    if (!found) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return found;
  },

  async fetchUserActivity(userId: string, signal?: AbortSignal): Promise<UserActivity[]> {
    await delay(300, signal);
    return [
      {
        id: `act-${userId}-1`,
        userId,
        action: 'Authentication',
        description: 'Successfully signed in from authorized IP',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        ipAddress: '192.168.1.45',
      },
      {
        id: `act-${userId}-2`,
        userId,
        action: 'Profile Update',
        description: 'Updated notification preferences and phone number',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        ipAddress: '192.168.1.45',
      },
      {
        id: `act-${userId}-3`,
        userId,
        action: 'Tenant Resource Access',
        description: 'Exported monthly user usage report to CSV',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        ipAddress: '192.168.1.45',
      },
      {
        id: `act-${userId}-4`,
        userId,
        action: 'Security Challenge',
        description: 'Verified Multi-Factor Authentication token',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        ipAddress: '192.168.1.102',
      },
    ];
  },

  async createUser(input: CreateUserInput): Promise<User> {
    await delay(400);
    const all = getStoredUsers();
    const tenants = getStoredTenants();
    const tenant = tenants.find(t => t.id === input.tenantId);

    const newUser: User = {
      ...input,
      id: `usr-${Date.now().toString().slice(-4)}`,
      tenantName: tenant ? tenant.name : 'Unknown Tenant',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newUser, ...all];
    saveStoredUsers(updated);
    return newUser;
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    await delay(350);
    const all = getStoredUsers();
    const index = all.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    const tenants = getStoredTenants();
    const tenant = input.tenantId ? tenants.find(t => t.id === input.tenantId) : null;

    const updatedUser: User = {
      ...all[index],
      ...input,
      tenantName: tenant ? tenant.name : all[index].tenantName,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedUser;
    saveStoredUsers(all);
    return updatedUser;
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    await delay(300);
    const all = getStoredUsers();
    const index = all.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...all[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedUser;
    saveStoredUsers(all);
    return updatedUser;
  },

  async deleteUser(id: string): Promise<{ success: boolean; id: string }> {
    await delay(350);
    const all = getStoredUsers();
    const filtered = all.filter(u => u.id !== id);
    if (filtered.length === all.length) {
      throw new Error(`User with ID ${id} not found`);
    }
    saveStoredUsers(filtered);
    return { success: true, id };
  },
};
