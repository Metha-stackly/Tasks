export type UserRole = 'Admin' | 'User' | 'Manager' | 'Super Admin';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  tenantId: string;
  tenantName: string;
  address: string;
  company: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  tenantId?: string;
  page: number;
  limit?: number;
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'tenantName'>;
export type UpdateUserInput = Partial<CreateUserInput>;

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, string>;
}
