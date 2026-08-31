import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  tenantDetailsQueryOptions,
  tenantUsersQueryOptions,
} from '../../queries/tenantQueries';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const TenantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Primary Tenant Query (Page 17)
  const {
    data: tenant,
    isLoading: isTenantLoading,
    isError: isTenantError,
    error: tenantError,
    refetch: refetchTenant,
  } = useQuery(tenantDetailsQueryOptions(id || ''));

  // Dependent Query: Users belonging to this tenant (Page 17: enabled: !!tenantId, queryKey: ['tenantUsers', tenantId])
  const {
    data: tenantUsers,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery(tenantUsersQueryOptions(id || ''));

  if (isTenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader message="Loading tenant information..." />
      </div>
    );
  }

  if (isTenantError || !tenant) {
    return (
      <div className="p-6">
        <ErrorMessage
          message={tenantError instanceof Error ? tenantError.message : 'Tenant not found'}
          onRetry={() => refetchTenant()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/tenants')}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Tenants</span>
            <span>/</span>
            <span className="text-[#0a1128] font-bold">{tenant.name}</span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            tenant.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {tenant.status}
        </span>
      </div>

      {/* Tenant Information Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-2xl shrink-0">
            <Building2 className="w-8 h-8 text-[#0a1128]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{tenant.name}</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[11px] font-bold rounded-md border border-blue-200">
                {tenant.plan} Plan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">{tenant.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Monthly Revenue</span>
            <span className="font-bold text-slate-900 text-sm">
              ${tenant.monthlyRevenue.toLocaleString()}/mo
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Storage Used</span>
            <span className="font-bold text-slate-900 text-sm">{tenant.storageUsedGb} GB</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px]">Created Date</span>
            <span className="font-semibold text-slate-800">
              {new Date(tenant.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tenant Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Contact Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-3 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-mono">{tenant.contactEmail}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{tenant.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{tenant.address}</span>
            </div>
          </div>
        </div>

        {/* Page 17: Tenant Users - Dependent Query */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Users Belonging to this Tenant
              </h3>
              <p className="text-xs text-slate-400">
                Dependent query ["tenantUsers", "{tenant.id}"] (enabled: !!tenantId)
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
              {tenantUsers?.length || 0} Members
            </span>
          </div>

          {isUsersLoading ? (
            <Loader message="Loading tenant users..." size="sm" />
          ) : isUsersError ? (
            <ErrorMessage
              message={usersError instanceof Error ? usersError.message : 'Error loading users'}
            />
          ) : tenantUsers?.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No registered user accounts found for this tenant.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tenantUsers?.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <button
                        onClick={() => navigate(`/users/${u.id}`)}
                        className="text-xs font-bold text-slate-800 hover:text-amber-600 text-left cursor-pointer"
                      >
                        {u.name}
                      </button>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {u.role}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};