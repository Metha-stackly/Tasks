import {
  User,
  UserFilters,
  CreateUserInput,
  UpdateUserInput,
  UserStatus,
  PaginatedResponse,
} from '../types/user.types';
import { mockUsers, mockTenants, delay } from './mockData';

export const usersApi = {
  // Fetch users with search, role, status, tenant filter, pagination, and cancellation support
  getUsers: async (
    filters: UserFilters = {},
    signal?: AbortSignal
  ): Promise<PaginatedResponse<User>> => {
    // Simulate server response time
    await delay(350, signal);

    let filtered = [...mockUsers];

    // Server-side search on name, email, company
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.company.toLowerCase().includes(searchLower) ||
          u.tenantName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role) {
      filtered = filtered.filter((u) => u.role === filters.role);
    }

    if (filters.status) {
      filtered = filtered.filter((u) => u.status === filters.status);
    }

    if (filters.tenantId) {
      filtered = filtered.filter((u) => u.tenantId === filters.tenantId);
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

  // Get user by ID with cancellation support
  getUserById: async (userId: string, signal?: AbortSignal): Promise<User> => {
    await delay(250, signal);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      throw new Error(`User with ID "${userId}" not found`);
    }
    return { ...user };
  },

  // Create User
  createUser: async (input: CreateUserInput): Promise<User> => {
    await delay(400);

    if (!input.firstName || !input.lastName || !input.email) {
      throw new Error('First name, last name, and email are required.');
    }

    const tenant = mockTenants.find((t) => t.id === input.tenantId);
    const tenantName = tenant ? tenant.name : 'Unknown Tenant';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: `${input.firstName} ${input.lastName}`,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || '+1 (555) 000-0000',
      role: input.role,
      tenantId: input.tenantId,
      tenantName: tenantName,
      status: input.status,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      address: input.address || '123 Main Street, Suite 100',
      company: input.company || tenantName,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    mockUsers.unshift(newUser);

    // Update tenant count
    if (tenant) {
      tenant.userCount += 1;
    }

    return { ...newUser };
  },

  // Edit User
  updateUser: async (input: UpdateUserInput): Promise<User> => {
    await delay(350);

    const index = mockUsers.findIndex((u) => u.id === input.id);
    if (index === -1) {
      throw new Error(`User with ID "${input.id}" not found`);
    }

    const existing = mockUsers[index];
    const tenant = input.tenantId
      ? mockTenants.find((t) => t.id === input.tenantId)
      : undefined;

    const updated: User = {
      ...existing,
      ...input,
      name:
        input.firstName || input.lastName
          ? `${input.firstName ?? existing.firstName} ${input.lastName ?? existing.lastName}`
          : existing.name,
      tenantName: tenant ? tenant.name : existing.tenantName,
    };

    mockUsers[index] = updated;
    return { ...updated };
  },

  // Update Status (Optimistic Update)
  updateUserStatus: async (userId: string, status: UserStatus): Promise<User> => {
    await delay(500);

    // Simulate occasional error for demonstration rollback if needed
    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID "${userId}" not found`);
    }

    mockUsers[index] = {
      ...mockUsers[index],
      status,
    };

    return { ...mockUsers[index] };
  },

  // Delete User
  deleteUser: async (userId: string): Promise<{ success: boolean; id: string }> => {
    await delay(400);

    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID "${userId}" not found`);
    }

    const deletedUser = mockUsers[index];
    mockUsers.splice(index, 1);

    // Decrement tenant count
    const tenant = mockTenants.find((t) => t.id === deletedUser.tenantId);
    if (tenant && tenant.userCount > 0) {
      tenant.userCount -= 1;
    }

    return { success: true, id: userId };
  },
};
