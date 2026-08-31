import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: string;
  accentColor?: 'amber' | 'blue' | 'emerald' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  trend,
  accentColor = 'amber',
}) => {
  const colorMap = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorMap[accentColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{trend}</span>
            </div>
          )}
          {subtext && <span className="text-slate-400 ml-auto">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
