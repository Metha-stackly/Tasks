import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'An unexpected error occurred while loading data.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 bg-red-50 border border-red-200 rounded-xl text-red-800 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Failed to retrieve information</h4>
          <p className="text-sm text-red-600 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
