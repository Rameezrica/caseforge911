import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const ProtectedRouteAdmin: React.FC = () => {
  const { isAdminAuthenticated, loading } = useAdminAuth();

  if (loading) {
    // You might want to show a global loading spinner here
    // or a simple text indicator.
    return <div>Loading admin session...</div>;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />; // Renders the nested child routes (e.g., AdminLayout and its children)
};

export default ProtectedRouteAdmin;
