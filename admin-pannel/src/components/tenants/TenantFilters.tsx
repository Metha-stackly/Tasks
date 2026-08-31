import React, { useEffect, useState } from 'react';
import { TenantFilters as ITenantFilters, TenantPlan, TenantStatus } from '../../types/tenant.types';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, RotateCcw } from 'lucide-react';

interface TenantFiltersProps {
  filters: ITenantFilters;
  onChange: (newFilters: ITenantFilters) => void;
  onReset: () => void;
}

export const TenantFilters: React.FC<TenantFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      onChange({ ...filters, search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const plans: TenantPlan[] = ['Starter', 'Professional', 'Enterprise'];
  const statuses: TenantStatus[] = ['Active', 'Inactive'];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenant name, ID, contact email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Plan Filter */}
        <div>
          <select
            value={filters.plan || ''}
            onChange={(e) =>
              onChange({ ...filters, plan: e.target.value || undefined, page: 1 })
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Plans</option>
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter & Reset */}
        <div className="flex items-center space-x-2">
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value || undefined, page: 1 })
            }
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchInput('');
              onReset();
            }}
            title="Reset Filters"
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
