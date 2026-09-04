import React, { useState } from 'react';
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { UsersPage } from '../pages/Users/UsersPage';
import { UserDetailsPage } from '../pages/Users/UserDetailsPage';
import { TenantsPage } from '../pages/Tenants/TenantsPage';
import { TenantDetailsPage } from '../pages/Tenants/TenantDetailsPage';
import { AuditLogsPage } from '../pages/AuditLogs/AuditLogsPage';
import { AuditLogDetailsPage } from '../pages/AuditLogs/AuditLogDetailsPage';
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  RefreshCcw,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Breadcrumb Generator
const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const formatSegment = (seg: string) => {
    if (seg === 'audit-logs') return 'Audit Logs';
    if (seg === 'users') return 'Users';
    if (seg === 'tenants') return 'Tenants';
    if (seg === 'dashboard') return 'Dashboard';
    return seg;
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium overflow-x-auto py-1">
      <span className="text-slate-800 font-semibold hover:text-amber-600 transition-colors">
        Super Admin
      </span>
      {pathnames.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={index}>
            <span
              className={`${
                isLast
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              } capitalize whitespace-nowrap`}
            >
              {formatSegment(value)}
            </span>
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Main Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClearCache = () => {
    queryClient.clear();
    alert('TanStack Query Cache cleared! Data will be refetched on next access.');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a101f] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-black text-sm tracking-wider uppercase text-white">
            SCAMSUNGTECH
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-64 bg-[#0a101f] text-white flex flex-col border-r border-slate-800/80 transition-transform duration-300 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wider uppercase text-white leading-none">
              SCAMSUNGTECH
            </h1>
            <span className="text-2xs text-slate-400 font-medium">Ops Operations Portal</span>
          </div>
        </div>

        {/* Admin Profile Widget (Matching Template image) */}
        <div className="p-4 mx-3 my-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm shrink-0">
            A
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">Admin</h4>
            <span className="text-2xs font-medium text-slate-400 block truncate">Super Admin</span>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto py-2">
          {/* Features Section */}
          <div>
            <span className="text-2xs font-bold uppercase tracking-widest text-slate-500 px-3 block mb-2">
              Features
            </span>
            <div className="space-y-1">
              <NavLink
                to="/dashboard"
                onClick={() => setIsMobileNavOpen(false)}
                className={navItemClass}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="flex-1">Dashboard</span>
                <span className="text-2xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                  Live
                </span>
              </NavLink>
            </div>
          </div>

          {/* Operations & Management */}
          <div>
            <span className="text-2xs font-bold uppercase tracking-widest text-slate-500 px-3 block mb-2">
              Management
            </span>
            <div className="space-y-1">
              <NavLink
                to="/users"
                onClick={() => setIsMobileNavOpen(false)}
                className={navItemClass}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="flex-1">User Directory</span>
              </NavLink>

              <NavLink
                to="/tenants"
                onClick={() => setIsMobileNavOpen(false)}
                className={navItemClass}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="flex-1">Tenants</span>
              </NavLink>
            </div>
          </div>

          {/* Governance */}
          <div>
            <span className="text-2xs font-bold uppercase tracking-widest text-slate-500 px-3 block mb-2">
              Governance
            </span>
            <div className="space-y-1">
              <NavLink
                to="/audit-logs"
                onClick={() => setIsMobileNavOpen(false)}
                className={navItemClass}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="flex-1">Audit Logs</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer / Quick Tools */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070c17]">
          <button
            type="button"
            onClick={handleClearCache}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-2xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer border border-slate-800"
            title="Clear all TanStack Query cache entries"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset Query Cache
          </button>
          <div className="mt-2 text-center text-3xs text-slate-500">
            TanStack Query v5 • React 19 • TS
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <Breadcrumbs />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-2xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Server Online
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserDetailsPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/tenants/:tenantId" element={<TenantDetailsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/audit-logs/:auditLogId" element={<AuditLogDetailsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};
