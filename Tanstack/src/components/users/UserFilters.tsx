import React from 'react';
import type { UserFilters as IUserFilters, UserRole, UserStatus } from '../../types/user.types';
import type { Tenant } from '../../types/tenant.types';
import { SearchInput } from '../common/SearchInput';
import { useQuery } from '@tanstack/react-query';
import { tenantQueries } from '../../queries/tenantQueries';
import { Filter, RotateCcw } from 'lucide-react';

interface UserFiltersProps {
  filters: IUserFilters;
  onFilterChange: (filters: IUserFilters) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange }) => {
  // Fetch tenant list for tenant filter dropdown
  const { data: tenantData } = useQuery(tenantQueries.list({ page: 1, limit: 100 }));

  const roles: (UserRole | 'All')[] = ['All', 'Admin', 'User', 'Manager', 'Super Admin'];
  const statuses: (UserStatus | 'All')[] = ['All', 'Active', 'Inactive', 'Suspended'];

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search,
      page: 1, // Reset to page 1 on search change
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      role: e.target.value,
      page: 1,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      status: e.target.value,
      page: 1,
    });
  };

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      tenantId: e.target.value,
      page: 1,
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      role: 'All',
      status: 'All',
      tenantId: 'All',
      page: 1,
    });
  };

  const isFiltered = Boolean(
    filters.search ||
    (filters.role && filters.role !== 'All') ||
    (filters.status && filters.status !== 'All') ||
    (filters.tenantId && filters.tenantId !== 'All')
  );

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with debounce */}
        <div className="flex-1 min-w-[240px]">
          <SearchInput
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search by name, email, company, or tenant..."
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters:
          </div>

          {/* Role Filter */}
          <select
            value={filters.role || 'All'}
            onChange={handleRoleChange}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="All">All Roles</option>
            {roles.filter(r => r !== 'All').map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || 'All'}
            onChange={handleStatusChange}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {statuses.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Tenant Filter */}
          <select
            value={filters.tenantId || 'All'}
            onChange={handleTenantChange}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer max-w-[170px]"
          >
            <option value="All">All Tenants</option>
            {tenantData?.data.map((tenant: Tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
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
