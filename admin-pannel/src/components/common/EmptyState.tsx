import React from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <FolderSearch className="w-7 h-7 text-slate-400" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#0a1128] hover:bg-[#162248] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
