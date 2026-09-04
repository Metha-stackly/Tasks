import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Tenant, TenantFilters as ITenantFilters } from '../../types/tenant.types';
import { tenantQueries } from '../../queries/tenantQueries';
import { TenantTable } from '../../components/tenants/TenantTable';
import { TenantFilters } from '../../components/tenants/TenantFilters';
import { TenantForm } from '../../components/tenants/TenantForm';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { Building2, Plus, RefreshCw } from 'lucide-react';

export const TenantsPage: React.FC = () => {
  // Query filter state represented in query key:
  // ["tenants", { search, plan, status, page }]
  const [filters, setFilters] = useState<ITenantFilters>({
    search: '',
    plan: 'All',
    status: 'All',
    page: 1,
    limit: 5,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null);

  // TanStack Query: list query with placeholderData: keepPreviousData
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(tenantQueries.list(filters));

  const handleEditTenant = (tenant: Tenant) => {
    setTenantToEdit(tenant);
    setIsFormOpen(true);
  };

  const handleCreateTenant = () => {
    setTenantToEdit(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Tenant Management
            {isFetching && (
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                Updating...
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage multi-tenant organizations, plan subscriptions, and user quotas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Refetch Tenants"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCreateTenant}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Tenant
          </button>
        </div>
      </div>

      {/* Filters */}
      <TenantFilters filters={filters} onFilterChange={setFilters} />

      {/* State Renderers */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading tenant organizations..." size="lg" />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Tenants"
          message={error.message}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No tenants found"
          description="No tenant records match your active search filters."
          actionLabel="Create Tenant"
          onAction={handleCreateTenant}
          icon={<Building2 className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div>
          <TenantTable
            tenants={data.data}
            filters={filters}
            onEditTenant={handleEditTenant}
            isFetching={isFetching}
          />

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalRecords={data.total}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </div>
      )}

      {/* Create / Edit Tenant Form Modal */}
      <TenantForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setTenantToEdit(null);
        }}
        tenantToEdit={tenantToEdit}
      />
    </div>
  );
};
