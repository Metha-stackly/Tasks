import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { AuditLog } from '../../types/auditLog.types';
import { auditLogQueries } from '../../queries/auditLogQueries';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
  isFetching?: boolean;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Prefetch audit log details when hovering over row or View Details button
  const handlePrefetch = (logId: string) => {
    queryClient.prefetchQuery(auditLogQueries.detail(logId));
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
            <th className="py-3.5 px-4">Time</th>
            <th className="py-3.5 px-4">User</th>
            <th className="py-3.5 px-4">Tenant</th>
            <th className="py-3.5 px-4">Action</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {logs.map(log => {
            const timeFormatted = new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dateFormatted = new Date(log.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <tr
                key={log.id}
                onMouseEnter={() => handlePrefetch(log.id)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                onClick={() => navigate(`/audit-logs/${log.id}`)}
              >
                {/* Time */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{timeFormatted}</span>
                    <span className="text-slate-400 font-normal ml-1">({dateFormatted})</span>
                  </div>
                </td>

                {/* User */}
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-amber-600 transition-colors">
                    {log.userName}
                  </span>
                </td>

                {/* Tenant */}
                <td className="py-3.5 px-4">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {log.tenantName}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3.5 px-4">
                  <span className="text-xs font-medium text-slate-800">
                    {log.action}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      log.status === 'Success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {log.status === 'Success' ? (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    {log.status}
                  </span>
                </td>

                {/* View details button */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onMouseEnter={() => handlePrefetch(log.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/audit-logs/${log.id}`);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
