import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  tenantListQueryOptions,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} from '../../queries/tenantQueries';
import {
  CreateTenantInput,
  Tenant,
  TenantFilters as ITenantFilters,
  UpdateTenantInput,
} from '../../types/tenant.types';
import { TenantFilters } from '../../components/tenants/TenantFilters';
import { TenantTable } from '../../components/tenants/TenantTable';
import { TenantForm } from '../../components/tenants/TenantForm';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { Plus } from 'lucide-react';

export const TenantsPage: React.FC = () => {
  const [filters, setFilters] = useState<ITenantFilters>({
    page: 1,
    limit: 5,
    search: '',
    status: undefined,
    plan: undefined,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);

  // Page 16: Query Key contains { search, status, plan, page, limit }
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery(
    tenantListQueryOptions(filters)
  );

  const createMutation = useCreateTenantMutation();
  const updateMutation = useUpdateTenantMutation();
  const deleteMutation = useDeleteTenantMutation();

  const handleCreateSubmit = async (formData: CreateTenantInput | UpdateTenantInput) => {
    try {
      await createMutation.mutateAsync(formData as CreateTenantInput);
      setIsCreateOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSubmit = async (formData: CreateTenantInput | UpdateTenantInput) => {
    try {
      await updateMutation.mutateAsync(formData as UpdateTenantInput);
      setEditingTenant(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTenant) return;
    try {
      await deleteMutation.mutateAsync(deletingTenant.id);
      setDeletingTenant(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tenant Management
            </h1>
            {isFetching && !isLoading && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                Fetching...
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage organizations, tier subscriptions, and multi-tenant quotas.
          </p>
        </div>

        {/* + Create Tenant Button (Page 16) */}
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1128] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Tenant</span>
        </button>
      </div>

      {/* Tenant Search / Filter (Page 16) */}
      <TenantFilters
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={() =>
          setFilters({
            page: 1,
            limit: 5,
            search: '',
            status: undefined,
            plan: undefined,
          })
        }
      />

      {/* Tenant Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16">
            <Loader message="Loading tenant organizations..." />
          </div>
        ) : isError ? (
          <div className="p-6">
            <ErrorMessage
              message={error instanceof Error ? error.message : 'Failed to retrieve tenants'}
              onRetry={() => refetch()}
            />
          </div>
        ) : data?.items.length === 0 ? (
          <EmptyState
            title="No tenants found"
            description="Adjust your search criteria or plan/status filters."
            actionText="Reset Filters"
            onAction={() =>
              setFilters({
                page: 1,
                limit: 5,
                search: '',
                status: undefined,
                plan: undefined,
              })
            }
          />
        ) : (
          <>
            <TenantTable
              tenants={data?.items || []}
              onEdit={(tenant) => setEditingTenant(tenant)}
              onDelete={(tenant) => setDeletingTenant(tenant)}
            />

            <Pagination
              currentPage={filters.page || 1}
              totalPages={data?.totalPages || 1}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              isFetching={isFetching}
            />
          </>
        )}
      </div>

      {/* Create Tenant Modal */}
      <TenantForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />

      {/* Edit Tenant Modal */}
      <TenantForm
        isOpen={Boolean(editingTenant)}
        onClose={() => setEditingTenant(null)}
        initialTenant={editingTenant}
        onSubmit={handleUpdateSubmit}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTenant)}
        title="Delete Tenant"
        message={`Are you sure you want to delete organization "${deletingTenant?.name}"? All related data and users will be unlinked.`}
        confirmLabel="Delete Tenant"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTenant(null)}
      />
    </div>
  );
};