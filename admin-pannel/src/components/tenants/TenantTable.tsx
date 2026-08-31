import React from 'react';
import { Tenant } from '../../types/tenant.types';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../queries/queryKeys';
import { tenantsApi } from '../../api/tenants.api';
import { useUpdateTenantStatusOptimistic } from '../../queries/tenantQueries';
import { Eye, Edit, Trash2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TenantTableProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const statusMutation = useUpdateTenantStatusOptimistic();

  // Page 17: Prefetch Tenant Details when hovering over View
  const handlePrefetchTenant = (tenantId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.tenants.detail(tenantId),
      queryFn: ({ signal }) => tenantsApi.getTenantById(tenantId, signal),
      staleTime: 1000 * 60 * 5,
    });
  };

  const planBadgeStyles = {
    Starter: 'bg-slate-100 text-slate-700 border-slate-200',
    Professional: 'bg-blue-50 text-blue-700 border-blue-200',
    Enterprise: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="p-3.5">Tenant Name</th>
            <th className="p-3.5">Tenant ID</th>
            <th className="p-3.5">Plan</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Users</th>
            <th className="p-3.5">Created Date</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="p-3.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/tenants/${tenant.id}`)}
                      onMouseEnter={() => handlePrefetchTenant(tenant.id)}
                      className="font-semibold text-slate-800 hover:text-amber-600 transition-colors text-left cursor-pointer"
                    >
                      {tenant.name}
                    </button>
                    <p className="text-[11px] text-slate-400">{tenant.contactEmail}</p>
                  </div>
                </div>
              </td>
              <td className="p-3.5 font-mono text-[11px] text-slate-500">{tenant.id}</td>
              <td className="p-3.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] border ${
                    planBadgeStyles[tenant.plan]
                  }`}
                >
                  {tenant.plan}
                </span>
              </td>
              <td className="p-3.5">
                {/* Page 18: Tenant Status Optimistic Update Active <-> Inactive */}
                <button
                  type="button"
                  onClick={() =>
                    statusMutation.mutate({
                      tenantId: tenant.id,
                      status: tenant.status === 'Active' ? 'Inactive' : 'Active',
                    })
                  }
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    tenant.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                  }`}
                  title="Click to toggle status optimistically"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      tenant.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  {tenant.status}
                </button>
              </td>
              <td className="p-3.5 font-semibold text-slate-700">{tenant.userCount}</td>
              <td className="p-3.5 text-slate-500">
                {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="p-3.5 text-right">
                <div className="flex items-center justify-end space-x-1.5">
                  <button
                    type="button"
                    onMouseEnter={() => handlePrefetchTenant(tenant.id)}
                    onClick={() => navigate(`/tenants/${tenant.id}`)}
                    className="p-1.5 text-slate-500 hover:text-[#0a1128] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    title="View Tenant"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(tenant)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                    title="Edit Tenant"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(tenant)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="Delete Tenant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
