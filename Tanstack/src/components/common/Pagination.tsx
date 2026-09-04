import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  totalRecords?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching = false,
  totalRecords,
}) => {
  if (totalPages <= 1 && (!totalRecords || totalRecords <= 0)) {
    return null;
  }

  // Generate visible page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200/80 text-sm">
      <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
        {totalRecords !== undefined && (
          <span>
            Showing page <strong className="text-slate-800 font-semibold">{currentPage}</strong> of{' '}
            <strong className="text-slate-800 font-semibold">{totalPages || 1}</strong> ({totalRecords} items)
          </span>
        )}
        {isFetching && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Updating...
          </span>
        )}
      </div>

      <nav className="flex items-center gap-1.5" aria-label="Pagination Navigation">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isFetching}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Previous</span>
        </button>

        {pages.map(page => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={isFetching && page === currentPage}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all ${
              page === currentPage
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-500'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isFetching}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};
