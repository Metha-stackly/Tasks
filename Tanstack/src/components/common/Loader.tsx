import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  inline?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text = 'Loading...',
  inline = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  const spinner = (
    <div className={`flex items-center gap-2.5 ${inline ? 'inline-flex' : 'flex-col justify-center py-10'}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-amber-500`} />
      {text && <span className="text-sm font-medium text-slate-500">{text}</span>}
    </div>
  );

  return spinner;
};
