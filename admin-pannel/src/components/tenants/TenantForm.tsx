import React, { useState } from 'react';
import { CreateTenantInput, Tenant, TenantPlan, TenantStatus, UpdateTenantInput } from '../../types/tenant.types';
import { X, Building2, Save } from 'lucide-react';

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTenantInput | UpdateTenantInput) => void;
  initialTenant?: Tenant | null;
  isLoading?: boolean;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTenant,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialTenant);

  const [name, setName] = useState(initialTenant?.name || '');
  const [plan, setPlan] = useState<TenantPlan>(initialTenant?.plan || 'Professional');
  const [status, setStatus] = useState<TenantStatus>(initialTenant?.status || 'Active');
  const [contactEmail, setContactEmail] = useState(initialTenant?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(initialTenant?.contactPhone || '');
  const [address, setAddress] = useState(initialTenant?.address || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Tenant name is required';
    if (!contactEmail.trim()) {
      errs.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      errs.contactEmail = 'Valid email is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && initialTenant) {
      onSubmit({
        id: initialTenant.id,
        name,
        plan,
        status,
        contactEmail,
        contactPhone,
        address,
      });
    } else {
      onSubmit({
        name,
        plan,
        status,
        contactEmail,
        contactPhone,
        address,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              {isEditing ? <Save className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Tenant Organization' : 'Create New Tenant'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tenant Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corporation"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plan *</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as TenantPlan)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent bg-white cursor-pointer"
              >
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TenantStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent bg-white cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admin@tenant.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
              />
              {errors.contactEmail && (
                <p className="text-[11px] text-red-500 mt-1">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Corporate Headquarters Address"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-[#0a1128] bg-[#f59e0b] hover:bg-[#d97706] rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
