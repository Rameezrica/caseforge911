import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Check if we're in fallback mode based on environment
const FALLBACK_MODE = import.meta.env.VITE_FALLBACK_MODE === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

interface AdminUser {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
}

// Fallback admin user type
interface FallbackAdminUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  created_at: string;
}

// Local admin session type for fallback mode
interface LocalAdminSession {
  access_token: string;
  refresh_token: string;
  user: FallbackAdminUser;
  expires_at?: number;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  session: any | LocalAdminSession | null;
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
  const [session, setSession] = useState<any | LocalAdminSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAdminAuth();
  }, []);

  const initializeAdminAuth = async () => {
    try {
      setIsLoading(true);
      
      if (FALLBACK_MODE) {
        // In fallback mode, check for stored admin session
        const storedToken = localStorage.getItem('caseforge_admin_access_token');
        const storedUser = localStorage.getItem('caseforge_admin_user');
        
        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const localSession: LocalAdminSession = {
              access_token: storedToken,
              refresh_token: localStorage.getItem('caseforge_admin_refresh_token') || storedToken,
              user: userData
            };
            
            // Verify token with backend
            const isValid = await validateAdminTokenWithBackend(storedToken);
            if (isValid) {
              setSession(localSession);
              setAdminUser({
                id: userData.id,
                email: userData.email,
                username: userData.user_metadata?.username || 'admin',
                is_admin: true,
              });
              setIsAuthenticated(true);
            } else {
              // Token invalid, clear storage
              clearAdminLocalStorage();
            }
          } catch (error) {
            console.error('Error parsing stored admin user data:', error);
            clearAdminLocalStorage();
          }
        }
      } else {
        // Use Supabase authentication
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting admin session:', error);
        } else if (session) {
          // Check if user is admin
          const isAdmin = session.user.email === ADMIN_EMAIL || 
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
              const isAdmin = session.user.email === ADMIN_EMAIL || 
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
      }
    } catch (error: any) {
      console.error('Admin auth initialization error:', error);
      setError(error.message || 'Admin authentication initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const validateAdminTokenWithBackend = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Admin token validation error:', error);
      return false;
    }
  };

  const clearAdminLocalStorage = () => {
    localStorage.removeItem('caseforge_admin_access_token');
    localStorage.removeItem('caseforge_admin_refresh_token');
    localStorage.removeItem('caseforge_admin_user');
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use backend admin login endpoint
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
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
      
      if (FALLBACK_MODE || true) { // Always use fallback mode for admin
        // Store tokens locally and create local session
        const userData: FallbackAdminUser = {
          id: data.user.id,
          email: data.user.email,
          user_metadata: {
            username: data.user.username || 'admin',
            admin: true
          },
          created_at: new Date().toISOString()
        };

        const localSession: LocalAdminSession = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: userData
        };

        // Store in localStorage with proper keys
        localStorage.setItem('caseforge_admin_access_token', data.access_token);
        localStorage.setItem('caseforge_admin_refresh_token', data.refresh_token);
        localStorage.setItem('caseforge_admin_user', JSON.stringify(userData));

        // Update state
        setSession(localSession);
        setAdminUser({
          id: userData.id,
          email: userData.email,
          username: userData.user_metadata?.username || 'admin',
          is_admin: true,
        });
        setIsAuthenticated(true);
      } else {
        // Use Supabase session
        const { error } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (error) {
          throw error;
        }
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
      
      // Always clear local storage for admin
      clearAdminLocalStorage();
      setAdminUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      if (!FALLBACK_MODE) {
        // Also sign out from Supabase if not in fallback mode
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      console.error('Admin sign out error:', error);
      // Even if sign out fails, clear local state
      clearAdminLocalStorage();
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