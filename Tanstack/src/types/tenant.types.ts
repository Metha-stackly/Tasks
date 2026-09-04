import type { PaginationResponse } from './user.types';

export type TenantPlan = 'Starter' | 'Pro' | 'Enterprise';

export type TenantStatus = 'Active' | 'Inactive';

export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  userCount: number;
  maxUsers: number;
  contactEmail: string;
  contactPhone: string;
  domain: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  mrr: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantFilters {
  search?: string;
  plan?: string;
  status?: string;
  page: number;
  limit?: number;
}

export type CreateTenantInput = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>;
export type UpdateTenantInput = Partial<CreateTenantInput>;

export type { PaginationResponse };
