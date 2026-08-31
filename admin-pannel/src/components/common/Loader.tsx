import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-[#f59e0b] mb-3`} />
      {message && <p className="text-sm font-medium tracking-wide text-slate-600">{message}</p>}
    </div>
  );
};
