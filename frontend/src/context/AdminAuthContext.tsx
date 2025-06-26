import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Hardcoded configuration
const API_BASE_URL = '/api';
const ADMIN_EMAIL = 'rameezuddinmohammed61@gmail.com';

interface AdminUser {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string;
  is_admin: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  firebaseUser: User | null;
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
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Admin Firebase auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Admin Firebase auth state changed:', user?.email);
      setIsLoading(true);
      
      if (user && user.email === ADMIN_EMAIL) {
        try {
          console.log('Admin user authenticated, getting ID token...');
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          
          // Store token for admin API calls
          localStorage.setItem('admin_firebase_id_token', idToken);
          
          // Load admin profile from backend
          await loadAdminProfile(idToken);
          
          setFirebaseUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error processing admin user:', error);
          setError('Failed to load admin profile');
        }
      } else if (user && user.email !== ADMIN_EMAIL) {
        // User is authenticated but not admin
        console.log('Non-admin user tried to access admin area');
        setError('Admin access required');
        await firebaseSignOut(auth);
      } else {
        // User signed out
        console.log('Admin user signed out');
        localStorage.removeItem('admin_firebase_id_token');
        setFirebaseUser(null);
        setAdminUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAdminProfile = async (idToken: string) => {
    try {
      console.log('Loading admin profile from backend...');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('Admin profile loaded:', profile);
        if (profile.is_admin) {
          setAdminUser(profile);
        } else {
          throw new Error('User is not an admin');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to load admin profile:', response.status, errorText);
        throw new Error('Failed to load admin profile');
      }
    } catch (error: any) {
      console.error('Failed to load admin profile:', error);
      setError(error.message || 'Failed to load admin profile');
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Admin signing in:', email);

      // Check if email is admin email
      if (email !== ADMIN_EMAIL) {
        throw new Error('Admin access required');
      }

      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Admin Firebase sign in successful');
      
      // The onAuthStateChanged listener will handle the rest
      return true;
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      setError(error.message || 'Admin login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      console.log('Admin signing out...');
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear local storage
      localStorage.removeItem('admin_firebase_id_token');
      
      // The onAuthStateChanged listener will handle clearing state
      console.log('Admin sign out successful');
    } catch (error: any) {
      console.error('Admin sign out error:', error);
      // Even if sign out fails, clear local state
      localStorage.removeItem('admin_firebase_id_token');
      setFirebaseUser(null);
      setAdminUser(null);
      setIsAuthenticated(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AdminAuthContextType = {
    adminUser,
    firebaseUser,
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