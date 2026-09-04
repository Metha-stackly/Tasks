import React from 'react';
import type { TenantFilters as ITenantFilters, TenantPlan, TenantStatus } from '../../types/tenant.types';
import { SearchInput } from '../common/SearchInput';
import { Filter, RotateCcw } from 'lucide-react';

interface TenantFiltersProps {
  filters: ITenantFilters;
  onFilterChange: (filters: ITenantFilters) => void;
}

export const TenantFilters: React.FC<TenantFiltersProps> = ({ filters, onFilterChange }) => {
  const plans: (TenantPlan | 'All')[] = ['All', 'Starter', 'Pro', 'Enterprise'];
  const statuses: (TenantStatus | 'All')[] = ['All', 'Active', 'Inactive'];

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search,
      page: 1,
    });
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      plan: e.target.value,
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

  const handleReset = () => {
    onFilterChange({
      search: '',
      plan: 'All',
      status: 'All',
      page: 1,
    });
  };

  const isFiltered = Boolean(
    filters.search ||
    (filters.plan && filters.plan !== 'All') ||
    (filters.status && filters.status !== 'All')
  );

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          <SearchInput
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search tenant name, ID, or domain..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters:
          </div>

          {/* Plan */}
          <select
            value={filters.plan || 'All'}
            onChange={handlePlanChange}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="All">All Plans</option>
            {plans.filter(p => p !== 'All').map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Status */}
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
