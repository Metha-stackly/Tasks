import React from 'react';
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  isLoading = false,
  isFetching = false,
}) => {
  return (
    <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse my-1.5" />
          ) : (
            <h3 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              {value}
              {isFetching && (
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin inline-block opacity-75" />
              )}
            </h3>
          )}
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>

        {icon && (
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      {trend !== undefined && !isLoading && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center text-xs">
          <span
            className={`inline-flex items-center font-semibold ${
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400 ml-1.5">vs last month</span>
        </div>
      )}
    </div>
  );
};
