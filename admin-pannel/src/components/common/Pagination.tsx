import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching = false,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

return (
  <div className="flex flex-col items-center px-4 py-3 bg-white border-t border-slate-200 sm:px-6 rounded-b-xl">
    
    {/* Pagination buttons - centered */}
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isFetching}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5 mr-1" />
        Previous
      </button>

      <div className="hidden sm:flex items-center space-x-1">
        {pages.map((p) => {
          const isActive = p === currentPage;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={isFetching}
              className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#f59e0b] text-[#0a1128] font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isFetching}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>

    {/* Page information - below pagination */}
    <div className="mt-2 flex items-center space-x-2 text-xs text-slate-500">
      <span>
        Page{' '}
        <strong className="text-slate-800 font-semibold">
          {currentPage}
        </strong>{' '}
        of{' '}
        <strong className="text-slate-800 font-semibold">
          {totalPages}
        </strong>
      </span>

      {isFetching && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 animate-pulse">
          Loading...
        </span>
      )}
    </div>

  </div>
);
};
