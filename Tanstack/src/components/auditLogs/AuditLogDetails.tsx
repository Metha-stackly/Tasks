import React from 'react';
import type { AuditLog } from '../../types/auditLog.types';
import type { User } from '../../types/user.types';
import type { Tenant } from '../../types/tenant.types';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  User as UserIcon,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Loader } from '../common/Loader';

interface AuditLogDetailsProps {
  auditLog: AuditLog;
  relatedUser?: User;
  isUserLoading?: boolean;
  relatedTenant?: Tenant;
  isTenantLoading?: boolean;
}

export const AuditLogDetails: React.FC<AuditLogDetailsProps> = ({
  auditLog,
  relatedUser,
  isUserLoading,
  relatedTenant,
  isTenantLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Primary Audit Information Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                auditLog.status === 'Success'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {auditLog.status === 'Success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{auditLog.action}</h2>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    auditLog.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {auditLog.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {new Date(auditLog.timestamp).toLocaleString()}
                <span className="text-slate-300">•</span>
                <span>IP: {auditLog.ipAddress}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {auditLog.id}
            </span>
          </div>
        </div>

        {/* Error Notice if failed */}
        {auditLog.errorDetails && (
          <div className="mt-5 p-4 rounded-xl bg-red-50/80 border border-red-200 text-red-800">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">
                  Execution Failure Details
                </h4>
                <p className="text-sm font-mono mt-1 text-red-800">{auditLog.errorDetails}</p>
              </div>
            </div>
          </div>
        )}

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Target Resource
            </span>
            <span className="font-mono text-xs font-semibold text-slate-800">
              {auditLog.resource}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Outcome Summary
            </span>
            <span className="text-xs font-medium text-slate-700">{auditLog.result}</span>
          </div>
        </div>

        {/* State Mutation Diff (Previous Value -> New Value) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Payload State Mutation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Previous State
              </span>
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap">
                {auditLog.previousValue || '(None / Initial Creation)'}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <span className="text-2xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                New Target State
              </span>
              <pre className="text-xs font-mono text-slate-900 font-semibold whitespace-pre-wrap">
                {auditLog.newValue || '(None / Deleted)'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Dependent Queries Section: Related User and Related Tenant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dependent User Query Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Related User (Dependent Query)
              </h3>
            </div>
            {relatedUser && (
              <Link
                to={`/users/${relatedUser.id}`}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
                View Profile <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          {isUserLoading ? (
            <div className="py-6 flex justify-center">
              <Loader inline text="Resolving dependent user query..." size="sm" />
            </div>
          ) : relatedUser ? (
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-semibold text-slate-800">{relatedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-800">{relatedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="font-semibold text-slate-800">{relatedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-600">{relatedUser.status}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">User details not found.</p>
          )}
        </div>

        {/* Dependent Tenant Query Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Related Tenant (Dependent Query)
              </h3>
            </div>
            {relatedTenant && (
              <Link
                to={`/tenants/${relatedTenant.id}`}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
                View Tenant <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          {isTenantLoading ? (
            <div className="py-6 flex justify-center">
              <Loader inline text="Resolving dependent tenant query..." size="sm" />
            </div>
          ) : relatedTenant ? (
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-semibold text-slate-800">{relatedTenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="font-semibold text-blue-600">{relatedTenant.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Domain:</span>
                <span className="font-semibold text-slate-800">{relatedTenant.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Users:</span>
                <span className="font-semibold text-slate-800">{relatedTenant.userCount} active</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Tenant details not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
