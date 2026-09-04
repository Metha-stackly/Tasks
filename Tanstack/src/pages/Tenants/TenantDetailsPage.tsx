import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tenantQueries } from '../../queries/tenantQueries';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import {
  ArrowLeft,
  Building2,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
} from 'lucide-react';

export const TenantDetailsPage: React.FC = () => {
  const { tenantId = '' } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  // 1. Primary Tenant Details Query: queryKey ["tenant", tenantId]
  const {
    data: tenant,
    isLoading: isTenantLoading,
    isFetching: isTenantFetching,
    error: tenantError,
    refetch: refetchTenant,
  } = useQuery(tenantQueries.detail(tenantId));

  // 2. Dependent Tenant Users Query:
  // queryKey ["tenantUsers", tenantId], enabled: !!tenantId && !!tenant
  const {
    data: tenantUsers,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    ...tenantQueries.users(tenantId),
    enabled: !!tenantId && !!tenant, // explicit dependent query
  });

  if (isTenantLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader text="Fetching tenant configuration from server..." size="lg" />
      </div>
    );
  }

  if (tenantError || !tenant) {
    return (
      <ErrorState
        title="Tenant Not Found"
        message={tenantError ? tenantError.message : `No tenant found with ID: ${tenantId}`}
        onRetry={refetchTenant}
        isRetrying={isTenantFetching}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => navigate('/tenants')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tenants
        </button>

        <div className="flex items-center gap-2">
          {isTenantFetching && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
              Syncing
            </span>
          )}
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {tenant.id}
          </span>
        </div>
      </div>

      {/* Tenant Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-700 shadow-xs shrink-0">
            <Building2 className="w-8 h-8 text-amber-600" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900">{tenant.name}</h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  tenant.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {tenant.status}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {tenant.plan} Plan
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{tenant.domain}</span>
              <span className="text-slate-300">•</span>
              <span>Tenant ID: {tenant.id}</span>
            </p>
          </div>
        </div>

        {/* Tenant Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5" />
              Primary Contact
            </span>
            <span className="text-xs font-semibold text-slate-900 break-all">{tenant.contactEmail}</span>
            <p className="text-2xs text-slate-500 mt-0.5">{tenant.contactPhone || 'No phone provided'}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5" />
              User Quota & Usage
            </span>
            <span className="text-xs font-semibold text-slate-900">
              {tenant.userCount} / {tenant.maxUsers} Users
            </span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (tenant.userCount / tenant.maxUsers) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Monthly MRR
            </span>
            <span className="text-lg font-bold text-slate-900">${tenant.mrr.toLocaleString()}</span>
            <p className="text-2xs text-emerald-600 font-semibold mt-0.5">Active Subscription</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Billing Cycle
            </span>
            <span className="text-xs font-semibold text-slate-900">
              {new Date(tenant.subscriptionStart).toLocaleDateString([], { month: 'short', year: 'numeric' })} -{' '}
              {new Date(tenant.subscriptionEnd).toLocaleDateString([], { month: 'short', year: 'numeric' })}
            </span>
            <p className="text-2xs text-slate-500 mt-0.5">Annual Auto-Renewal</p>
          </div>
        </div>
      </div>

      {/* Dependent Query: Tenant Users Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tenant Assigned Users
              </h3>
              <p className="text-2xs text-slate-400">
                Dependent query <code className="bg-slate-100 px-1 rounded">["tenantUsers", "{tenantId}"]</code> executed automatically
              </p>
            </div>
          </div>
          {isUsersFetching && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
              Syncing Users
            </span>
          )}
        </div>

        {isUsersLoading ? (
          <div className="py-8 flex justify-center">
            <Loader text="Loading users assigned to this tenant..." size="sm" />
          </div>
        ) : usersError ? (
          <ErrorState
            title="Failed to Load Tenant Users"
            message={usersError.message}
            onRetry={refetchUsers}
            isRetrying={isUsersFetching}
          />
        ) : !tenantUsers || tenantUsers.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No users are currently assigned to this tenant organization.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenantUsers.map(user => (
              <div
                key={user.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                    <p className="text-2xs text-slate-500">{user.email}</p>
                    <span className="inline-block text-2xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded mt-1">
                      {user.role}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/users/${user.id}`}
                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="View user details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
