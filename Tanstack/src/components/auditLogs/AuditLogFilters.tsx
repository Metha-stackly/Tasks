import React from 'react';
import type { AuditLogFilters as IAuditLogFilters, AuditAction, AuditStatus } from '../../types/auditLog.types';
import type { User } from '../../types/user.types';
import type { Tenant } from '../../types/tenant.types';
import { SearchInput } from '../common/SearchInput';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '../../queries/userQueries';
import { tenantQueries } from '../../queries/tenantQueries';
import { Filter, RotateCcw } from 'lucide-react';

interface AuditLogFiltersProps {
  filters: IAuditLogFilters;
  onFilterChange: (filters: IAuditLogFilters) => void;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({ filters, onFilterChange }) => {
  const { data: usersData } = useQuery(userQueries.list({ page: 1, limit: 100 }));
  const { data: tenantsData } = useQuery(tenantQueries.list({ page: 1, limit: 100 }));

  const actions: (AuditAction | 'All')[] = [
    'All',
    'Login',
    'Logout',
    'Create User',
    'Update User',
    'Delete User',
    'Change User Status',
    'Create Tenant',
    'Update Tenant',
    'Delete Tenant',
    'Change Tenant Status',
  ];

  const statuses: (AuditStatus | 'All')[] = ['All', 'Success', 'Failed'];

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search, page: 1 });
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, userId: e.target.value, page: 1 });
  };

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, tenantId: e.target.value, page: 1 });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, action: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value, page: 1 });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, startDate: e.target.value, page: 1 });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, endDate: e.target.value, page: 1 });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      userId: 'All',
      tenantId: 'All',
      action: 'All',
      status: 'All',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  const isFiltered = Boolean(
    filters.search ||
    (filters.userId && filters.userId !== 'All') ||
    (filters.tenantId && filters.tenantId !== 'All') ||
    (filters.action && filters.action !== 'All') ||
    (filters.status && filters.status !== 'All') ||
    filters.startDate ||
    filters.endDate
  );

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-5">
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="w-full">
          <SearchInput
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search audit events by user, action, tenant, or resource..."
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filter:
          </div>

          {/* User Select */}
          <select
            value={filters.userId || 'All'}
            onChange={handleUserChange}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer max-w-[150px]"
          >
            <option value="All">All Users</option>
            {usersData?.data.map((u: User) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Tenant Select */}
          <select
            value={filters.tenantId || 'All'}
            onChange={handleTenantChange}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer max-w-[150px]"
          >
            <option value="All">All Tenants</option>
            {tenantsData?.data.map((t: Tenant) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Action Select */}
          <select
            value={filters.action || 'All'}
            onChange={handleActionChange}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="All">All Actions</option>
            {actions.filter(a => a !== 'All').map(a => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={filters.status || 'All'}
            onChange={handleStatusChange}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {statuses.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Date range */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>From:</span>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={handleStartDateChange}
              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            />
            <span>To:</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={handleEndDateChange}
              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            />
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-auto"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
