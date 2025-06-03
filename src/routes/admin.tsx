import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboardPage } from '../pages/admin/DashboardPage';
import { AdminProblemsPage } from '../pages/admin/ProblemsPage';
import { AdminUsersPage } from '../pages/admin/UsersPage';
import { AdminSolutionsPage } from '../pages/admin/SolutionsPage';
import { AdminSettingsPage } from '../pages/admin/SettingsPage';
import { AdminLoginPage } from '../pages/admin/LoginPage';
import { useAdmin } from '../hooks/useAdmin';

const AdminRoutes: React.FC = () => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="problems" element={<AdminProblemsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="solutions" element={<AdminSolutionsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 