import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { UsersPage } from '../pages/Users/UsersPage';
import { UserDetailsPage } from '../pages/Users/UserDetailsPage';
import { TenantsPage } from '../pages/Tenants/TenantsPage';
import { TenantDetailsPage } from '../pages/Tenants/TenantDetailsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailsPage />} />

      <Route path="/tenants" element={<TenantsPage />} />
      <Route path="/tenants/:id" element={<TenantDetailsPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};