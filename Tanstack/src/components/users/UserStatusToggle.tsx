import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, UserStatus, UserFilters, PaginationResponse } from '../../types/user.types';
import { usersApi } from '../../api/users.api';
import { userKeys, analyticsKeys } from '../../queries/queryKeys';
import { Loader2 } from 'lucide-react';

interface UserStatusToggleProps {
  user: User;
  currentFilters: UserFilters;
}

export const UserStatusToggle: React.FC<UserStatusToggleProps> = ({ user, currentFilters }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Optimistic mutation for user status
  const mutation = useMutation({
    mutationFn: (newStatus: UserStatus) => usersApi.updateUserStatus(user.id, newStatus),
    onMutate: async (newStatus: UserStatus) => {
      // 1. Cancel outgoing queries for user lists
      await queryClient.cancelQueries({ queryKey: userKeys.all });

      // 2. Snapshot previous cache
      const previousList = queryClient.getQueryData<PaginationResponse<User>>(
        userKeys.list(currentFilters)
      );
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(user.id));

      // 3. Optimistically update list cache
      if (previousList) {
        queryClient.setQueryData<PaginationResponse<User>>(userKeys.list(currentFilters), {
          ...previousList,
          data: previousList.data.map((u: User) => (u.id === user.id ? { ...u, status: newStatus } : u)),
        });
      }

      // 4. Optimistically update detail cache if present
      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(user.id), {
          ...previousUser,
          status: newStatus,
        });
      }

      // Return context with saved previous cache for rollback
      return { previousList, previousUser };
    },
    onError: (err, _newStatus, context) => {
      // Rollback on failure
      if (context?.previousList) {
        queryClient.setQueryData(userKeys.list(currentFilters), context.previousList);
      }
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(user.id), context.previousUser);
      }
      alert(`Failed to update status: ${(err as Error).message}. Status rolled back.`);
    },
    onSettled: () => {
      // Always resync after mutation settles
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });

  const statuses: UserStatus[] = ['Active', 'Inactive', 'Suspended'];

  const statusColors = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    Inactive: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    Suspended: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  };

  const handleSelect = (status: UserStatus) => {
    setIsOpen(false);
    if (status !== user.status) {
      mutation.mutate(status);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={mutation.isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
          statusColors[user.status]
        }`}
        title="Click to toggle status (optimistic)"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            user.status === 'Active'
              ? 'bg-emerald-500'
              : user.status === 'Suspended'
              ? 'bg-red-500'
              : 'bg-slate-400'
          }`}
        />
        <span>{user.status}</span>
        {mutation.isPending && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-scaleUp">
            {statuses.map(st => (
              <button
                key={st}
                type="button"
                onClick={() => handleSelect(st)}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                  st === user.status ? 'text-amber-600 font-bold bg-amber-50/50' : 'text-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    st === 'Active'
                      ? 'bg-emerald-500'
                      : st === 'Suspended'
                      ? 'bg-red-500'
                      : 'bg-slate-400'
                  }`}
                />
                {st}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
