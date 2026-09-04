import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tenant, CreateTenantInput, UpdateTenantInput, TenantPlan, TenantStatus } from '../../types/tenant.types';
import { tenantsApi } from '../../api/tenants.api';
import { tenantKeys, analyticsKeys } from '../../queries/queryKeys';
import { X, Loader2, Save, Building2 } from 'lucide-react';

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  tenantToEdit?: Tenant | null;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  isOpen,
  onClose,
  tenantToEdit,
}) => {
  const queryClient = useQueryClient();
  const isEditing = Boolean(tenantToEdit);

  const [formData, setFormData] = useState({
    name: '',
    plan: 'Pro' as TenantPlan,
    status: 'Active' as TenantStatus,
    maxUsers: 50,
    contactEmail: '',
    contactPhone: '',
    domain: '',
    subscriptionStart: new Date().toISOString().split('T')[0],
    subscriptionEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0],
    mrr: 1200,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantToEdit) {
      setFormData({
        name: tenantToEdit.name,
        plan: tenantToEdit.plan,
        status: tenantToEdit.status,
        maxUsers: tenantToEdit.maxUsers,
        contactEmail: tenantToEdit.contactEmail,
        contactPhone: tenantToEdit.contactPhone,
        domain: tenantToEdit.domain,
        subscriptionStart: tenantToEdit.subscriptionStart.split('T')[0],
        subscriptionEnd: tenantToEdit.subscriptionEnd.split('T')[0],
        mrr: tenantToEdit.mrr,
      });
    } else {
      setFormData({
        name: '',
        plan: 'Pro',
        status: 'Active',
        maxUsers: 50,
        contactEmail: '',
        contactPhone: '',
        domain: '',
        subscriptionStart: new Date().toISOString().split('T')[0],
        subscriptionEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0],
        mrr: 1200,
      });
    }
    setValidationError(null);
  }, [tenantToEdit, isOpen]);

  // Create Tenant mutation
  const createMutation = useMutation({
    mutationFn: (newTenantData: CreateTenantInput) => tenantsApi.createTenant(newTenantData),
    onSuccess: () => {
      // Synchronize Tenant List, Dashboard Statistics
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      onClose();
    },
    onError: (err: Error) => {
      setValidationError(err.message || 'Failed to create tenant');
    },
  });

  // Edit Tenant mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateTenantInput) => {
      if (!tenantToEdit) throw new Error('No tenant specified for update');
      return tenantsApi.updateTenant(tenantToEdit.id, data);
    },
    onSuccess: updated => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.setQueryData(tenantKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      onClose();
    },
    onError: (err: Error) => {
      setValidationError(err.message || 'Failed to update tenant');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactEmail.trim() || !formData.domain.trim()) {
      setValidationError('Please fill in required fields (Name, Contact Email, Domain).');
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              {isEditing ? <Save className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Tenant Configuration' : 'Create New Tenant'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update subscription tier and organizational limits' : 'Onboard a new organization to the platform'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tenant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acme Global Corp"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domain / Workspace Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.domain}
                onChange={e => setFormData({ ...formData, domain: e.target.value })}
                placeholder="e.g. acme.io"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="ops@acme.io"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Tier</label>
              <select
                value={formData.plan}
                onChange={e => setFormData({ ...formData, plan: e.target.value as TenantPlan })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as TenantStatus })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly MRR ($)</label>
              <input
                type="number"
                min="0"
                value={formData.mrr}
                onChange={e => setFormData({ ...formData, mrr: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-sm disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
