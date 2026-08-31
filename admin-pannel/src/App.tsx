import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import {
  LayoutDashboard,
  Users,
  Building2,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  Briefcase,
  UserCheck,
  FileText,
  UserCog,
  CalendarCheck,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { section: 'Features' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: '0' },
    { name: 'Messages', path: '/messages', icon: MessageSquare, badge: '0', mock: true },
    
    { section: 'Management' },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Tenants', path: '/tenants', icon: Building2 },

    { section: 'Recruitment' },
    { name: 'Jobs', path: '/jobs', icon: Briefcase, mock: true },
    { name: 'Candidates', path: '/candidates', icon: UserCheck, mock: true },
    { name: 'Resumes', path: '/resumes', icon: FileText, mock: true },

    { section: 'Organization' },
    { name: 'Employee Management', path: '/users', icon: UserCog },
    { name: 'Leave Management', path: '/leave', icon: CalendarCheck, mock: true },
    { name: 'Performance Management', path: '/performance', icon: TrendingUp, mock: true },
    { name: "KPI's Pay", path: '/kpi-pay', icon: CreditCard, mock: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Dark Navy Sidebar matching visual reference */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1128] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-transparent flex items-center justify-center text-[#f59e0b]">
              <Sparkles className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <span className="font-extrabold text-white text-base tracking-wider font-mono uppercase">
              SCAMSUNGTECH
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User profile capsule in sidebar */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-[#101c3d] border border-slate-800/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#f59e0b] text-[#0a1128] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
            A
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">Admin</h4>
            <p className="text-[11px] text-slate-400 truncate">Admin</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item, index) => {
            if (item.section) {
              return (
                <div
                  key={index}
                  className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                >
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive =
              item.path &&
              !item.mock &&
              (location.pathname === item.path ||
                (item.path !== '/dashboard' &&
                  item.path !== '/' &&
                  location.pathname.startsWith(item.path)));

            return (
              <NavLink
                key={(item.name || 'nav') + index}
                to={item.mock ? '#' : item.path!}
                onClick={(e) => {
                  if (item.mock) {
                    e.preventDefault();
                  } else {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#f59e0b] text-[#0a1128] font-bold shadow-md'
                    : 'text-slate-300 hover:bg-[#121e42] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0a1128]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-red-500 text-white' : 'bg-red-500/80 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-semibold text-slate-500 hidden sm:flex items-center space-x-1.5">
              <span>Super Admin Management System</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                TanStack Query Active
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-[#0a1128] font-bold text-xs flex items-center justify-center">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">Super Admin</p>
                <p className="text-[10px] text-slate-400">admin@system.io</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};