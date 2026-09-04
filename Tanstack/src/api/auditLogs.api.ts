import type { AuditLog, AuditLogFilters, PaginationResponse } from '../types/auditLog.types';

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1001',
    timestamp: '2026-03-03T10:30:00Z',
    userId: 'usr-001',
    userName: 'Johnathan Archer',
    userEmail: 'j.archer@acmeglobal.io',
    tenantId: 't-101',
    tenantName: 'Acme Global Corp',
    action: 'Login',
    status: 'Success',
    resource: 'AuthService/SSO',
    previousValue: null,
    newValue: 'Session Token Issued (24h)',
    result: 'User authenticated via Google SAML 2.0',
    errorDetails: null,
    ipAddress: '192.168.1.45',
  },
  {
    id: 'log-1002',
    timestamp: '2026-03-03T10:25:00Z',
    userId: 'usr-002',
    userName: 'David Vance',
    userEmail: 'david.vance@techflow.dev',
    tenantId: 't-102',
    tenantName: 'TechFlow Systems',
    action: 'Update User',
    status: 'Success',
    resource: 'UserManagement/usr-002',
    previousValue: 'Role: Manager',
    newValue: 'Role: Admin',
    result: 'Promoted user privilege to Admin',
    errorDetails: null,
    ipAddress: '10.0.4.12',
  },
  {
    id: 'log-1003',
    timestamp: '2026-03-03T10:20:00Z',
    userId: 'usr-003',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@acmeglobal.io',
    tenantId: 't-101',
    tenantName: 'Acme Global Corp',
    action: 'Delete User',
    status: 'Failed',
    resource: 'UserManagement/usr-009',
    previousValue: 'Status: Active',
    newValue: null,
    result: 'Operation aborted by foreign key constraint',
    errorDetails: 'ERR_FK_CONSTRAINT: User owns 3 active tenant billing subscriptions',
    ipAddress: '172.16.0.8',
  },
  {
    id: 'log-1004',
    timestamp: '2026-03-03T09:45:00Z',
    userId: 'usr-004',
    userName: 'Michael Chang',
    userEmail: 'm.chang@omnivanguard.com',
    tenantId: 't-103',
    tenantName: 'OmniVanguard Logistics',
    action: 'Update Tenant',
    status: 'Success',
    resource: 'TenantConfig/t-103',
    previousValue: 'Plan: Pro (50 Users Max)',
    newValue: 'Plan: Enterprise (200 Users Max)',
    result: 'Applied subscription upgrade and generated invoice',
    errorDetails: null,
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-1005',
    timestamp: '2026-03-03T09:15:00Z',
    userId: 'usr-005',
    userName: 'Elena Rostova',
    userEmail: 'e.rostova@luminahealth.org',
    tenantId: 't-104',
    tenantName: 'Lumina Health Labs',
    action: 'Change User Status',
    status: 'Failed',
    resource: 'UserSecurity/usr-005',
    previousValue: 'Status: Active',
    newValue: 'Status: Suspended',
    result: 'Account temporarily suspended after 5 failed password attempts',
    errorDetails: 'ERR_AUTH_LOCKED: Maximum brute-force threshold reached',
    ipAddress: '104.28.14.9',
  },
  {
    id: 'log-1006',
    timestamp: '2026-03-02T16:50:00Z',
    userId: 'usr-006',
    userName: 'Marcus Brody',
    userEmail: 'marcus@pinnacle.ai',
    tenantId: 't-105',
    tenantName: 'Pinnacle Analytics',
    action: 'Create Tenant',
    status: 'Success',
    resource: 'TenantProvisioning/t-105',
    previousValue: null,
    newValue: 'Tenant: Pinnacle Analytics [Starter]',
    result: 'Provisioned dedicated tenant sandbox database',
    errorDetails: null,
    ipAddress: '192.168.2.14',
  },
  {
    id: 'log-1007',
    timestamp: '2026-03-02T14:10:00Z',
    userId: 'usr-007',
    userName: 'Clara Oswald',
    userEmail: 'clara.o@starlightmedia.co',
    tenantId: 't-106',
    tenantName: 'Starlight Media Group',
    action: 'Change Tenant Status',
    status: 'Success',
    resource: 'TenantBilling/t-106',
    previousValue: 'Status: Active',
    newValue: 'Status: Inactive',
    result: 'Tenant marked inactive due to overdue payment notice',
    errorDetails: null,
    ipAddress: '192.168.1.20',
  },
  {
    id: 'log-1008',
    timestamp: '2026-03-02T11:05:00Z',
    userId: 'usr-008',
    userName: 'Robert Thorne',
    userEmail: 'r.thorne@nexuscyber.net',
    tenantId: 't-107',
    tenantName: 'Nexus Cyber Security',
    action: 'Create User',
    status: 'Success',
    resource: 'UserManagement/usr-008',
    previousValue: null,
    newValue: 'User: Robert Thorne (Manager)',
    result: 'Invited new security team lead to portal',
    errorDetails: null,
    ipAddress: '10.0.12.88',
  },
];

const AUDIT_STORAGE_KEY = 'superadmin_audit_logs';

export function getStoredAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveStoredAuditLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
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

export const auditLogsApi = {
  async fetchAuditLogs(filters: AuditLogFilters, signal?: AbortSignal): Promise<PaginationResponse<AuditLog>> {
    await delay(350, signal);
    let all = getStoredAuditLogs();

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      all = all.filter(l =>
        l.userName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.tenantName.toLowerCase().includes(q) ||
        l.resource.toLowerCase().includes(q)
      );
    }

    if (filters.userId && filters.userId !== 'All') {
      all = all.filter(l => l.userId === filters.userId);
    }

    if (filters.tenantId && filters.tenantId !== 'All') {
      all = all.filter(l => l.tenantId === filters.tenantId);
    }

    if (filters.action && filters.action !== 'All') {
      all = all.filter(l => l.action === filters.action);
    }

    if (filters.status && filters.status !== 'All') {
      all = all.filter(l => l.status === filters.status);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      all = all.filter(l => new Date(l.timestamp).getTime() >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      all = all.filter(l => new Date(l.timestamp).getTime() <= end);
    }

    const page = Math.max(1, filters.page || 1);
    const limit = filters.limit || 5;
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

  async fetchAuditLogById(id: string, signal?: AbortSignal): Promise<AuditLog> {
    await delay(250, signal);
    const all = getStoredAuditLogs();
    const found = all.find(l => l.id === id);
    if (!found) {
      throw new Error(`Audit log with ID ${id} not found`);
    }
    return found;
  },

  async logEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const all = getStoredAuditLogs();
    const newLog: AuditLog = {
      ...event,
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
    };
    saveStoredAuditLogs([newLog, ...all]);
    return newLog;
  },
};
