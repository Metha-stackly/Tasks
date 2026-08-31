import React, { useEffect, useState } from 'react';
import { UserFilters as IUserFilters, UserRole, UserStatus } from '../../types/user.types';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, RotateCcw } from 'lucide-react';
import { mockTenants } from '../../api/mockData';

interface UserFiltersProps {
  filters: IUserFilters;
  onChange: (newFilters: IUserFilters) => void;
  onReset: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to parent filters
  useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      onChange({ ...filters, search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const roles: UserRole[] = ['Super Admin', 'Admin', 'Manager', 'User', 'Viewer'];
  const statuses: UserStatus[] = ['Active', 'Inactive', 'Suspended'];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Debounced Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={filters.role || ''}
            onChange={(e) =>
              onChange({ ...filters, role: e.target.value || undefined, page: 1 })
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value || undefined, page: 1 })
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Tenant Filter & Reset */}
        <div className="flex items-center space-x-2">
          <select
            value={filters.tenantId || ''}
            onChange={(e) =>
              onChange({ ...filters, tenantId: e.target.value || undefined, page: 1 })
            }
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white text-slate-700 cursor-pointer truncate"
          >
            <option value="">All Tenants</option>
            {mockTenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
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
