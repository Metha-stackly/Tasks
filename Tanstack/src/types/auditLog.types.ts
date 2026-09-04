import type { PaginationResponse } from './user.types';

export type AuditAction =
  | 'Login'
  | 'Logout'
  | 'Create User'
  | 'Update User'
  | 'Delete User'
  | 'Change User Status'
  | 'Create Tenant'
  | 'Update Tenant'
  | 'Delete Tenant'
  | 'Change Tenant Status';

export type AuditStatus = 'Success' | 'Failed';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  tenantId: string;
  tenantName: string;
  action: AuditAction;
  status: AuditStatus;
  resource: string;
  previousValue?: string | null;
  newValue?: string | null;
  result: string;
  errorDetails?: string | null;
  ipAddress: string;
}

export interface AuditLogFilters {
  search?: string;
  userId?: string;
  tenantId?: string;
  action?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit?: number;
}

export type { PaginationResponse };
