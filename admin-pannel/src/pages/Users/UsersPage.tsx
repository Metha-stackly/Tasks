import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  userListQueryOptions,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCompareUsers,
} from '../../queries/userQueries';
import { CreateUserInput, UpdateUserInput, User, UserFilters as IUserFilters } from '../../types/user.types';
import { UserFilters } from '../../components/users/UserFilters';
import { UserTable } from '../../components/users/UserTable';
import { UserForm } from '../../components/users/UserForm';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { UserPlus, Sparkles, X, Layers } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<IUserFilters>({
    page: 1,
    limit: 5,
    search: '',
    role: undefined,
    status: undefined,
    tenantId: undefined,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Multi-user selection for User Comparison (Page 15)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(['usr-1', 'usr-2']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Page 9, 10: Query Key contains search, role, status, tenantId.
  // Changing a filter automatically retrieves the query without manual refetch()!
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery(
    userListQueryOptions(filters)
  );

  // Page 15: User comparison queries with dynamic useQueries()
  const comparisonQueries = useCompareUsers(selectedUserIds);

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const handleCreateSubmit = async (formData: CreateUserInput | UpdateUserInput) => {
    try {
      await createMutation.mutateAsync(formData as CreateUserInput);
      setIsCreateOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSubmit = async (formData: CreateUserInput | UpdateUserInput) => {
    try {
      await updateMutation.mutateAsync(formData as UpdateUserInput);
      setEditingUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      await deleteMutation.mutateAsync(deletingUser.id);
      setDeletingUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllVisible = (checked: boolean) => {
    if (checked && data?.items) {
      const allIds = Array.from(new Set([...selectedUserIds, ...data.items.map((u) => u.id)]));
      setSelectedUserIds(allIds);
    } else if (data?.items) {
      const visibleIds = data.items.map((u) => u.id);
      setSelectedUserIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              User Management
            </h1>
            {isFetching && !isLoading && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                Fetching...
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, search, filter, compare, and manage multi-tenant user accounts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* User Comparison Trigger */}
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            disabled={selectedUserIds.length < 2}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#f59e0b]" />
            <span>Compare Users ({selectedUserIds.length})</span>
          </button>

          {/* + Create User Button (Page 12) */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1128] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Search & Filter bar (Page 9) */}
      <UserFilters
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={() =>
          setFilters({
            page: 1,
            limit: 5,
            search: '',
            role: undefined,
            status: undefined,
            tenantId: undefined,
          })
        }
      />

      {/* Main User List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16">
            <Loader message="Loading users list..." />
          </div>
        ) : isError ? (
          <div className="p-6">
            <ErrorMessage
              message={error instanceof Error ? error.message : 'Failed to retrieve users'}
              onRetry={() => refetch()}
            />
          </div>
        ) : data?.items.length === 0 ? (
          <EmptyState
            title="No users match your criteria"
            description="Try clearing search query or adjusting role and status filters."
            actionText="Clear Filters"
            onAction={() =>
              setFilters({
                page: 1,
                limit: 5,
                search: '',
                role: undefined,
                status: undefined,
                tenantId: undefined,
              })
            }
          />
        ) : (
          <>
            <UserTable
              users={data?.items || []}
              onEdit={(user) => setEditingUser(user)}
              onDelete={(user) => setDeletingUser(user)}
              selectedUserIds={selectedUserIds}
              onToggleSelect={toggleSelectUser}
              onSelectAll={selectAllVisible}
            />

            {/* Pagination (Page 10) */}
            <Pagination
              currentPage={filters.page || 1}
              totalPages={data?.totalPages || 1}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              isFetching={isFetching}
            />
          </>
        )}
      </div>

      {/* User Comparison Section / Modal (Page 15: Demonstrates useQueries()) */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Compare Users (Dynamic useQueries)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Side-by-side attributes evaluated concurrently via TanStack Query useQueries()
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {comparisonQueries.map((queryResult, idx) => {
                const user = queryResult.data;
                const userId = selectedUserIds[idx];

                if (queryResult.isLoading) {
                  return (
                    <div
                      key={userId}
                      className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center min-h-[250px]"
                    >
                      <Loader message="Loading user details..." size="sm" />
                    </div>
                  );
                }

                if (queryResult.isError || !user) {
                  return (
                    <div
                      key={userId}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs"
                    >
                      Failed to load user {userId}
                    </div>
                  );
                }

                return (
                  <div
                    key={user.id}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-[#f59e0b] transition-all space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#f59e0b]/40"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Role</span>
                        <span className="font-semibold text-slate-700">{user.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tenant</span>
                        <span className="font-semibold text-slate-700">{user.tenantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone</span>
                        <span className="font-medium text-slate-600">{user.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Company</span>
                        <span className="font-medium text-slate-600">{user.company}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal (Page 12) */}
      <UserForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />

      {/* Edit User Modal (Page 13) */}
      <UserForm
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        initialUser={editingUser}
        onSubmit={handleUpdateSubmit}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog (Page 13) */}
      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${deletingUser?.name}? This action cannot be undone and will synchronize with the server cache.`}
        confirmLabel="Delete User"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
};