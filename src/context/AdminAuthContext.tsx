import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAdminAuth();
  }, []);

  const initializeAdminAuth = async () => {
    try {
      setIsLoading(true);
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting admin session:', error);
      } else if (session) {
        // Check if user is admin
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const isAdmin = session.user.email === adminEmail || 
                       session.user.user_metadata?.admin === true;
        
        if (isAdmin) {
          setSession(session);
          setAdminUser({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || 'admin',
            is_admin: true,
          });
          setIsAuthenticated(true);
        }
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Admin auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
            const isAdmin = session.user.email === adminEmail || 
                           session.user.user_metadata?.admin === true;
            
            if (isAdmin) {
              setSession(session);
              setAdminUser({
                id: session.user.id,
                email: session.user.email!,
                username: session.user.user_metadata?.username || 'admin',
                is_admin: true,
              });
              setIsAuthenticated(true);
            } else {
              // Not an admin user
              setSession(null);
              setAdminUser(null);
              setIsAuthenticated(false);
            }
          } else {
            setSession(null);
            setAdminUser(null);
            setIsAuthenticated(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error: any) {
      console.error('Admin auth initialization error:', error);
      setError(error.message || 'Admin authentication initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use backend admin login endpoint
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Admin login failed');
      }

      const data = await response.json();
      
      // Set the session manually using the token from backend
      const { error } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      setError(error.message || 'Admin login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await supabase.auth.signOut();
      
      // Clear local state
      setAdminUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Admin sign out error:', error);
      // Even if sign out fails, clear local state
      setAdminUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AdminAuthContextType = {
    adminUser,
    session,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};