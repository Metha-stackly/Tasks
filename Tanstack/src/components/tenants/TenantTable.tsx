import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Tenant, TenantFilters } from '../../types/tenant.types';
import { tenantQueries } from '../../queries/tenantQueries';
import { tenantKeys, analyticsKeys } from '../../queries/queryKeys';
import { tenantsApi } from '../../api/tenants.api';
import { TenantStatusToggle } from './TenantStatusToggle';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Eye, Edit2, Trash2, Building2, Users } from 'lucide-react';

interface TenantTableProps {
  tenants: Tenant[];
  filters: TenantFilters;
  onEditTenant: (tenant: Tenant) => void;
  isFetching?: boolean;
}

export const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  filters,
  onEditTenant,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  // Prefetch tenant details on hover over View button
  const handlePrefetchTenant = (tenantId: string) => {
    queryClient.prefetchQuery(tenantQueries.detail(tenantId));
  };

  // Delete tenant mutation
  const deleteMutation = useMutation({
    mutationFn: (tenantId: string) => tenantsApi.deleteTenant(tenantId),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.removeQueries({ queryKey: tenantKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      setTenantToDelete(null);
    },
    onError: (err: Error) => {
      alert(`Delete tenant failed: ${err.message}`);
    },
  });

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">Tenant Name</th>
              <th className="py-3.5 px-4">Tenant ID</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">User Count</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tenants.map(tenant => (
              <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Tenant Name & Domain */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center font-bold text-amber-700 text-xs shrink-0">
                      <Building2 className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onMouseEnter={() => handlePrefetchTenant(tenant.id)}
                        onClick={() => navigate(`/tenants/${tenant.id}`)}
                        className="font-semibold text-slate-900 hover:text-amber-600 transition-colors text-left cursor-pointer"
                      >
                        {tenant.name}
                      </button>
                      <p className="text-2xs text-slate-400">{tenant.domain}</p>
                    </div>
                  </div>
                </td>

                {/* Tenant ID */}
                <td className="py-3.5 px-4">
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {tenant.id}
                  </span>
                </td>

                {/* Plan */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
                      tenant.plan === 'Enterprise'
                        ? 'bg-purple-100 text-purple-700'
                        : tenant.plan === 'Pro'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {tenant.plan}
                  </span>
                </td>

                {/* User Count */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tenant.userCount} / {tenant.maxUsers}</span>
                  </div>
                </td>

                {/* Status Toggle (Optimistic) */}
                <td className="py-3.5 px-4">
                  <TenantStatusToggle tenant={tenant} currentFilters={filters} />
                </td>

                {/* Created Date */}
                <td className="py-3.5 px-4 text-xs text-slate-500">
                  {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                {/* Actions: View (with prefetch), Edit, Delete */}
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1 justify-end">
                    <button
                      type="button"
                      onMouseEnter={() => handlePrefetchTenant(tenant.id)}
                      onClick={() => navigate(`/tenants/${tenant.id}`)}
                      className="px-2 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
                      title="View tenant details (prefetches on hover)"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditTenant(tenant)}
                      className="px-2 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
                      title="Edit tenant"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setTenantToDelete(tenant)}
                      className="px-2 py-1 text-xs font-semibold rounded-md text-red-600 hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1"
                      title="Delete tenant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(tenantToDelete)}
        title="Delete Tenant Workspace"
        message={`Are you sure you want to permanently delete "${tenantToDelete?.name}" (${tenantToDelete?.id})? All tenant data and configurations will be removed.`}
        confirmLabel="Delete Tenant"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (tenantToDelete) {
            deleteMutation.mutate(tenantToDelete.id);
          }
        }}
        onCancel={() => setTenantToDelete(null)}
      />
    </div>
  );
};
