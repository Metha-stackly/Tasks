export type UserStatus = 'Active' | 'Inactive' | 'Suspended';
export type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'User' | 'Viewer';

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  status: UserStatus;
  avatar: string;
  address: string;
  company: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  tenantId?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  tenantId: string;
  status: UserStatus;
  address?: string;
  company?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
