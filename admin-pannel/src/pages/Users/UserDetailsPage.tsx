import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userDetailsQueryOptions, userActivityQueryOptions } from '../../queries/userQueries';
import { queryKeys } from '../../queries/queryKeys';
import { User, PaginatedResponse } from '../../types/user.types';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  Activity,
} from 'lucide-react';

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>('Personal Details');

  // Sub-pills tabs matching the visual reference image
  const tabs = [
    'Personal Details',
    'Contact Details',
    'Next of Kin Details',
    'Educational Qualifications',
    'Guarantor Details',
    'Family Details',
    'Job Details',
    'Financial Details',
  ];

  // Page 15: initialData / placeholderData derived from the User List query cache
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    ...userDetailsQueryOptions(id || ''),
    placeholderData: () => {
      // Find user from existing user lists in cache
      const cachedUsersLists = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: queryKeys.users.all,
      });

      for (const [, listData] of cachedUsersLists) {
        const found = listData?.items.find((u) => u.id === id);
        if (found) return found;
      }
      return undefined;
    },
  });

  // Page 11, 12: Dependent Query: Recent Activity enabled only when userId is available
  const {
    data: activities,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
    error: activitiesError,
  } = useQuery(userActivityQueryOptions(id || ''));

  if (isUserLoading && !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader message="Retrieving user profile..." />
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="p-6">
        <ErrorMessage
          message={userError instanceof Error ? userError.message : 'User not found'}
          onRetry={() => refetchUser()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/users')}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Employee Mgmt</span>
            <span>/</span>
            <span>Employee Profile</span>
            <span>/</span>
            <span className="text-[#0a1128] font-bold">{user.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              user.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-md border border-amber-200">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.tenantName} ({user.company})</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Member Since</span>
            <span className="font-semibold text-slate-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Last Session</span>
            <span className="font-semibold text-slate-800">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px]">Tenant ID</span>
            <span className="font-mono text-slate-800 font-semibold">{user.tenantId}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout matching screenshot navigation pills & detail pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sub-navigation Pills (matching reference image) */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f59e0b] text-[#0a1128] font-bold shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Details Pane */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal & Contact Attributes Display (Page 10, 11) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {activeTab}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Full Name
                </span>
                <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Email Address
                </span>
                <p className="font-semibold text-slate-800 text-sm font-mono">{user.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Phone Number
                </span>
                <p className="font-semibold text-slate-800 text-sm">{user.phone}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Assigned Tenant
                </span>
                <p className="font-semibold text-slate-800 text-sm">{user.tenantName}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Address
                </span>
                <p className="font-semibold text-slate-800 text-sm">{user.address}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Company / Organization
                </span>
                <p className="font-semibold text-slate-800 text-sm">{user.company}</p>
              </div>
            </div>
          </div>

          {/* Page 11, 12: User Activity - Dependent Query (enabled: !!userId) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  User Activity (Dependent Query)
                </h3>
                <p className="text-xs text-slate-400">
                  Runs only when userId is loaded: query key ["userActivity", "{user.id}"]
                </p>
              </div>
            </div>

            {isActivitiesLoading ? (
              <Loader message="Loading user activities..." size="sm" />
            ) : isActivitiesError ? (
              <ErrorMessage
                message={activitiesError instanceof Error ? activitiesError.message : 'Error'}
              />
            ) : (
              <div className="space-y-3">
                {activities?.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{act.action}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{act.target}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(act.timestamp).toLocaleDateString()} {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};