import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation, useQueries } from '@tanstack/react-query';
import type { User, UserFilters } from '../../types/user.types';
import { userQueries } from '../../queries/userQueries';
import { userKeys, analyticsKeys } from '../../queries/queryKeys';
import { usersApi } from '../../api/users.api';
import { UserStatusToggle } from './UserStatusToggle';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Eye,
  Edit2,
  Trash2,
  Scale,
  X,
} from 'lucide-react';

interface UserTableProps {
  users: User[];
  filters: UserFilters;
  onEditUser: (user: User) => void;
  isFetching?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  filters,
  onEditUser,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Selection state for User Comparison
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Delete state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Prefetch user details on hover over "View"
  const handlePrefetchUser = (userId: string) => {
    queryClient.prefetchQuery(userQueries.detail(userId));
  };

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: (_, deletedId) => {
      // Synchronize User List, User Details, Dashboard Statistics
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      setUserToDelete(null);
      setSelectedUserIds(prev => prev.filter(id => id !== deletedId));
    },
    onError: (err: Error) => {
      alert(`Delete error: ${err.message}`);
    },
  });

  // User comparison dynamic useQueries hook
  const comparedUsersQueries = useQueries({
    queries: selectedUserIds.map(id => userQueries.detail(id)),
  });

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
  };

  return (
    <div className="relative">
      {/* Comparison Action Bar if users selected */}
      {selectedUserIds.length > 0 && (
        <div className="mb-3.5 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>{selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="px-3 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare Users Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setSelectedUserIds([])}
              className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-md transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={toggleSelectAll}
                  className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  title="Select all"
                />
              </th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Tenant</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map(user => {
              const isSelected = selectedUserIds.includes(user.id);
              return (
                <tr
                  key={user.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-amber-50/30' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectUser(user.id)}
                      className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                  </td>

                  {/* Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onMouseEnter={() => handlePrefetchUser(user.id)}
                          onClick={() => navigate(`/users/${user.id}`)}
                          className="font-semibold text-slate-900 hover:text-amber-600 transition-colors text-left cursor-pointer"
                        >
                          {user.name}
                        </button>
                        <p className="text-2xs text-slate-400">{user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-600 text-xs">{user.email}</td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                        user.role === 'Super Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'Admin'
                          ? 'bg-blue-100 text-blue-700'
                          : user.role === 'Manager'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Tenant */}
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                      {user.tenantName}
                    </span>
                  </td>

                  {/* Status Toggle (Optimistic) */}
                  <td className="py-3 px-4">
                    <UserStatusToggle user={user} currentFilters={filters} />
                  </td>

                  {/* Actions: View (with prefetch), Edit, Delete */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onMouseEnter={() => handlePrefetchUser(user.id)}
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="px-2 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
                        title="View user details (prefetches on hover)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        className="px-2 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
                        title="Edit user"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setUserToDelete(user)}
                        className="px-2 py-1 text-xs font-semibold rounded-md text-red-600 hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Delete User Account"
        message={`Are you sure you want to delete "${userToDelete?.name}" (${userToDelete?.email})? This will revoke all access privileges and cannot be undone.`}
        confirmLabel="Delete User"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (userToDelete) {
            deleteMutation.mutate(userToDelete.id);
          }
        }}
        onCancel={() => setUserToDelete(null)}
      />

      {/* Compare Users Modal using useQueries() */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    User Comparison Matrix ({selectedUserIds.length} Users)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Side-by-side comparison dynamically fetched with TanStack Query's <code className="bg-slate-100 px-1 rounded">useQueries()</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-side grid */}
            <div className="mt-4 overflow-x-auto flex-1 pb-2">
              <div className="grid grid-flow-col auto-cols-[280px] gap-4">
                {comparedUsersQueries.map((query, index) => {
                  const user = query.data;
                  if (query.isLoading) {
                    return (
                      <div
                        key={selectedUserIds[index]}
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50 animate-pulse flex flex-col items-center justify-center h-80"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-200 mb-3" />
                        <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                        <div className="h-3 w-40 bg-slate-200 rounded" />
                      </div>
                    );
                  }

                  if (!user) {
                    return (
                      <div
                        key={selectedUserIds[index]}
                        className="p-5 rounded-xl border border-slate-200 bg-red-50 text-red-600 text-xs flex items-center justify-center"
                      >
                        Failed to fetch user {selectedUserIds[index]}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={user.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                            user.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : user.status === 'Suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSelectUser(user.id)}
                          className="text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                          title="Remove from compare"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="text-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 mx-auto mb-2 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-lg">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                        <p className="text-2xs text-slate-500">{user.email}</p>
                      </div>

                      <div className="space-y-3 text-xs border-t border-slate-100 pt-3 flex-1">
                        <div>
                          <span className="text-slate-400 block text-2xs uppercase">Role</span>
                          <span className="font-semibold text-slate-800">{user.role}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-2xs uppercase">Tenant</span>
                          <span className="font-semibold text-slate-800">{user.tenantName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-2xs uppercase">Company</span>
                          <span className="text-slate-700">{user.company || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-2xs uppercase">Phone</span>
                          <span className="text-slate-700">{user.phone || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-2xs uppercase">Address</span>
                          <span className="text-slate-700 line-clamp-2">{user.address || '—'}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCompareOpen(false);
                            navigate(`/users/${user.id}`);
                          }}
                          className="w-full py-1.5 text-xs font-semibold text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
