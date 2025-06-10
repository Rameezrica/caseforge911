import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

const AdminLayout: React.FC = () => {
  const { logout, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // The logout function in useAdminAuth should already navigate to /admin/login
  };

  // In a real scenario, you might want to also check loading state from useAdminAuth
  // and show a loader, or rely on ProtectedRouteAdmin to handle non-auth state.
  if (!isAdminAuthenticated) {
    // This is a fallback, ProtectedRouteAdmin should primarily handle this.
    // Or, if AdminLayout is only ever rendered when authenticated, this might not be strictly necessary.
    // navigate('/admin/login'); // Commenting out as ProtectedRoute should handle this.
    // return null; // Or a loading indicator
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '220px', background: '#f4f4f4', padding: '20px' }}>
        <h3>Admin Panel</h3>
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/admin">Dashboard</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/admin/problems">Manage Problems</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/admin/competitions">Manage Competitions</Link></li>
            {/* Add more links as new admin pages are created */}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          style={{ marginTop: '30px', padding: '10px', width: '100%', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: '20px', background: '#fff' }}>
        <Outlet /> {/* Child routes (AdminDashboardPage, etc.) will render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
