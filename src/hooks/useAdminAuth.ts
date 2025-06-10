import { useState, useEffect } from 'react';
import { loginAdmin, AuthTokenResponse } from '../services/adminApi';

const ADMIN_TOKEN_KEY = 'adminToken';

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: !!token,
      isLoading: false,
    }));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response: AuthTokenResponse = await loginAdmin(username, password);
      localStorage.setItem(ADMIN_TOKEN_KEY, response.access_token);
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
  };
};