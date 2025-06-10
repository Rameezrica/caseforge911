import { useState, useEffect, useCallback } from 'react';
import { loginAdmin, AuthTokenResponse } from '../services/adminApi';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const ADMIN_TOKEN_KEY = 'adminToken';

interface AdminUserState {
  token: string | null;
  // Add more admin user details here if needed, e.g., username, roles
  // For now, just storing the token indicates authentication.
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUserState | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initially true to check auth
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    setLoading(true);
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        // TODO: Optionally verify token with a backend endpoint here.
        // For now, presence of token means authenticated.
        setAdminUser({ token });
        setIsAdminAuthenticated(true);
      } else {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
    } catch (e) {
      console.error("Failed to check auth status", e);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthTokenResponse = await loginAdmin(username, password);
      if (response.access_token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.access_token);
        setAdminUser({ token: response.access_token });
        setIsAdminAuthenticated(true);
        navigate('/admin'); // Redirect to admin dashboard on successful login
      } else {
        throw new Error('Login response did not contain access token.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Login failed:', errorMessage);
      setError(errorMessage);
      setIsAdminAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    navigate('/admin/login'); // Redirect to login page on logout
  }, [navigate]);

  return {
    adminUser,
    isAdminAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth, // Exposing checkAuth if manual re-check is needed
  };
};
