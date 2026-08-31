export type TenantPlan = 'Starter' | 'Professional' | 'Enterprise';
export type TenantStatus = 'Active' | 'Inactive';

export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  userCount: number;
  createdAt: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  monthlyRevenue: number;
  storageUsedGb: number;
}

export interface TenantFilters {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
}

export interface CreateTenantInput {
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface UpdateTenantInput extends Partial<CreateTenantInput> {
  id: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

