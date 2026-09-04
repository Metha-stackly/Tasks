import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '../../queries/userQueries';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Clock,
  Activity,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const UserDetailsPage: React.FC = () => {
  const { userId = '' } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // 1. Primary User Details Query: queryKey ["user", userId]
  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    error: userError,
    refetch: refetchUser,
  } = useQuery(userQueries.detail(userId));

  // 2. Dependent User Activity Query:
  // queryKey ["userActivity", userId], enabled: !!userId && !!user
  const {
    data: activities,
    isLoading: isActivityLoading,
    isFetching: isActivityFetching,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    ...userQueries.activity(userId),
    enabled: !!userId && !!user, // explicit dependent query
  });

  if (isUserLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader text="Fetching user details from server..." size="lg" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <ErrorState
        title="User Not Found"
        message={userError ? userError.message : `No user found matching identifier: ${userId}`}
        onRetry={refetchUser}
        isRetrying={isUserFetching}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Users
        </button>

        <div className="flex items-center gap-2">
          {isUserFetching && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
              Syncing
            </span>
          )}
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {user.id}
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-2xl text-slate-700 shadow-xs shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  user.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : user.status === 'Suspended'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {user.status}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {user.role}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.company || 'Organization'}</span>
              <span className="text-slate-300">•</span>
              <span>Tenant: </span>
              <Link
                to={`/tenants/${user.tenantId}`}
                className="font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
                {user.tenantName} <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </span>
            <span className="text-xs font-semibold text-slate-900 break-all">{user.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5" />
              Phone Number
            </span>
            <span className="text-xs font-semibold text-slate-900">{user.phone || '—'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              Work Location
            </span>
            <span className="text-xs font-semibold text-slate-900">{user.address || '—'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Member Since
            </span>
            <span className="text-xs font-semibold text-slate-900">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Dependent Query: Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900">User Activity Stream</h3>
              <p className="text-2xs text-slate-400">
                Dependent query <code className="bg-slate-100 px-1 rounded">["userActivity", "{userId}"]</code> triggered once user resolves
              </p>
            </div>
          </div>
          {isActivityFetching && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
              Syncing Activity
            </span>
          )}
        </div>

        {isActivityLoading ? (
          <div className="py-8 flex justify-center">
            <Loader text="Loading dependent user activity logs..." size="sm" />
          </div>
        ) : activityError ? (
          <ErrorState
            title="Failed to Load User Activity"
            message={activityError.message}
            onRetry={refetchActivity}
            isRetrying={isActivityFetching}
          />
        ) : !activities || activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No activity entries recorded for this user.</p>
        ) : (
          <div className="space-y-3">
            {activities.map(act => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{act.action}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                    <p className="text-2xs text-slate-400 mt-1 font-mono">IP: {act.ipAddress}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(act.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
