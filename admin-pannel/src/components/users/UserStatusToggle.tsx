import React, { useState } from 'react';
import { UserStatus } from '../../types/user.types';
import { useUpdateUserStatusOptimistic } from '../../queries/userQueries';
import { Check, ChevronDown } from 'lucide-react';

interface UserStatusToggleProps {
  userId: string;
  currentStatus: UserStatus;
}

export const UserStatusToggle: React.FC<UserStatusToggleProps> = ({
  userId,
  currentStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useUpdateUserStatusOptimistic();

  const statuses: UserStatus[] = ['Active', 'Inactive', 'Suspended'];

  const statusStyles: Record<UserStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    Inactive: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200',
    Suspended: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  };

  const handleSelectStatus = (newStatus: UserStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    mutation.mutate({ userId, status: newStatus });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
          statusStyles[currentStatus]
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            currentStatus === 'Active'
              ? 'bg-emerald-500'
              : currentStatus === 'Inactive'
              ? 'bg-slate-400'
              : 'bg-rose-500'
          }`}
        />
        {currentStatus}
        <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-200 z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleSelectStatus(status)}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
              >
                <span>{status}</span>
                {status === currentStatus && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
