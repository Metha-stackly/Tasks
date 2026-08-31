import React from 'react';
import { User } from '../../types/user.types';
import { UserStatusToggle } from './UserStatusToggle';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../queries/queryKeys';
import { usersApi } from '../../api/users.api';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  selectedUserIds: string[];
  onToggleSelect: (userId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  selectedUserIds,
  onToggleSelect,
  onSelectAll,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Page 11: Prefetch user details on hover
  const handlePrefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.users.detail(userId),
      queryFn: ({ signal }) => usersApi.getUserById(userId, signal),
      staleTime: 1000 * 60 * 5,
    });
  };

  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="p-3.5 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-[#f59e0b] focus:ring-[#f59e0b] cursor-pointer"
              />
            </th>
            <th className="p-3.5">Avatar</th>
            <th className="p-3.5">Name</th>
            <th className="p-3.5">Email</th>
            <th className="p-3.5">Role</th>
            <th className="p-3.5">Tenant</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {users.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);

            return (
              <tr
                key={user.id}
                className={`hover:bg-slate-50/80 transition-colors ${
                  isSelected ? 'bg-amber-50/40' : ''
                }`}
              >
                <td className="p-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(user.id)}
                    className="rounded border-slate-300 text-[#f59e0b] focus:ring-[#f59e0b] cursor-pointer"
                  />
                </td>
                <td className="p-3.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                </td>
                <td className="p-3.5 font-semibold text-slate-800">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    onMouseEnter={() => handlePrefetchUser(user.id)}
                    className="hover:text-amber-600 transition-colors text-left cursor-pointer"
                  >
                    {user.name}
                  </button>
                </td>
                <td className="p-3.5 text-slate-600 font-mono text-[11px]">{user.email}</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] bg-slate-100 text-slate-700">
                    {user.role}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600">{user.tenantName}</td>
                <td className="p-3.5">
                  {/* Optimistic Status Toggle (Page 13, 14) */}
                  <UserStatusToggle userId={user.id} currentStatus={user.status} />
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    {/* View Button with hover prefetch (Page 11) */}
                    <button
                      type="button"
                      onMouseEnter={() => handlePrefetchUser(user.id)}
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="p-1.5 text-slate-500 hover:text-[#0a1128] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
