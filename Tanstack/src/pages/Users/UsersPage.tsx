import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User, UserFilters as IUserFilters } from '../../types/user.types';
import { userQueries } from '../../queries/userQueries';
import { UserTable } from '../../components/users/UserTable';
import { UserFilters } from '../../components/users/UserFilters';
import { UserForm } from '../../components/users/UserForm';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { UserPlus, Users, RefreshCw } from 'lucide-react';

export const UsersPage: React.FC = () => {
  // Query filter state represented in the query key:
  // ["users", { search, role, status, tenantId, page }]
  const [filters, setFilters] = useState<IUserFilters>({
    search: '',
    role: 'All',
    status: 'All',
    tenantId: 'All',
    page: 1,
    limit: 5,
  });

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // TanStack Query: list query with placeholderData: keepPreviousData
  // Changing filters automatically runs query; no manual refetch() needed
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(userQueries.list(filters));

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleCreateUser = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            User Management
            {isFetching && (
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                Updating...
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of cross-tenant administrators, managers, and member accounts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Refetch Users"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCreateUser}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <UserFilters filters={filters} onFilterChange={setFilters} />

      {/* State Renderers: Loading / Error / Empty / Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading users directory..." size="lg" />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Users"
          message={error.message}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No users match the search query or active filter settings."
          actionLabel="Create User"
          onAction={handleCreateUser}
          icon={<Users className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div>
          {/* User Table with Prefetch, Comparison, and Status Toggle */}
          <UserTable
            users={data.data}
            filters={filters}
            onEditUser={handleEditUser}
            isFetching={isFetching}
          />

          {/* Pagination with Previous 1 2 3 Next and placeholderData keeping previous visible */}
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalRecords={data.total}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </div>
      )}

      {/* Create / Edit User Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setUserToEdit(null);
        }}
        userToEdit={userToEdit}
      />
    </div>
  );
};
