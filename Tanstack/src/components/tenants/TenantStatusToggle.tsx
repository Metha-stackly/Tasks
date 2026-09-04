import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tenant, TenantStatus, TenantFilters, PaginationResponse } from '../../types/tenant.types';
import { tenantsApi } from '../../api/tenants.api';
import { tenantKeys, analyticsKeys } from '../../queries/queryKeys';
import { Loader2 } from 'lucide-react';

interface TenantStatusToggleProps {
  tenant: Tenant;
  currentFilters: TenantFilters;
}

export const TenantStatusToggle: React.FC<TenantStatusToggleProps> = ({
  tenant,
  currentFilters,
}) => {
  const queryClient = useQueryClient();

  const nextStatus: TenantStatus = tenant.status === 'Active' ? 'Inactive' : 'Active';

  // Optimistic status mutation
  const mutation = useMutation({
    mutationFn: (status: TenantStatus) => tenantsApi.updateTenantStatus(tenant.id, status),
    onMutate: async (status: TenantStatus) => {
      // 1. Cancel ongoing queries for tenant lists
      await queryClient.cancelQueries({ queryKey: tenantKeys.all });

      // 2. Snapshot previous cache
      const previousList = queryClient.getQueryData<PaginationResponse<Tenant>>(
        tenantKeys.list(currentFilters)
      );
      const previousTenant = queryClient.getQueryData<Tenant>(tenantKeys.detail(tenant.id));

      // 3. Optimistically update list cache
      if (previousList) {
        queryClient.setQueryData<PaginationResponse<Tenant>>(tenantKeys.list(currentFilters), {
          ...previousList,
          data: previousList.data.map((t: Tenant) => (t.id === tenant.id ? { ...t, status } : t)),
        });
      }

      // 4. Optimistically update detail cache if present
      if (previousTenant) {
        queryClient.setQueryData<Tenant>(tenantKeys.detail(tenant.id), {
          ...previousTenant,
          status,
        });
      }

      return { previousList, previousTenant };
    },
    onError: (err, _status, context) => {
      // Restore previous status on failure
      if (context?.previousList) {
        queryClient.setQueryData(tenantKeys.list(currentFilters), context.previousList);
      }
      if (context?.previousTenant) {
        queryClient.setQueryData(tenantKeys.detail(tenant.id), context.previousTenant);
      }
      alert(`Status update failed: ${(err as Error).message}. Restored previous status.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });

  const handleToggle = () => {
    mutation.mutate(nextStatus);
  };

  const isActive = tenant.status === 'Active';

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={mutation.isPending}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
      }`}
      title={`Click to switch to ${nextStatus} (optimistic)`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
      />
      <span>{tenant.status}</span>
      {mutation.isPending && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
    </button>
  );
};
