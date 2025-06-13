import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Check if we're in fallback mode based on environment
const FALLBACK_MODE = import.meta.env.VITE_FALLBACK_MODE === 'true' || true; // Default to true for now

// Types
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  created_at: string;
  solved_problems: string[];
  total_score: number;
}

export interface UserProgress {
  total_problems_solved: number;
  total_score: number;
  current_streak: number;
  longest_streak: number;
  problems_by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  recent_activity: Array<{
    problem_id: string;
    problem_title: string;
    solved_at: string;
    score?: number;
  }>;
}

// Fallback user type
interface FallbackUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  created_at: string;
}

export interface AuthContextType {
  user: User | FallbackUser | null;
  session: Session | any | null;
  userProfile: UserProfile | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else if (session) {
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
        await loadUserData(session);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          setSession(session);
          setUser(session?.user ?? null);
          setIsAuthenticated(!!session?.user);
          
          if (session?.user) {
            await loadUserData(session);
          } else {
            setUserProfile(null);
            setUserProgress(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      setError(error.message || 'Authentication initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (session: Session) => {
    try {
      // Get user profile from backend
      const profileResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserProfile(profile);
      }

      // Get user progress from backend
      const progressResponse = await fetch('/api/user/progress', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (progressResponse.ok) {
        const progress = await progressResponse.json();
        setUserProgress(progress);
      }
    } catch (error: any) {
      console.error('Failed to load user data:', error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    username: string, 
    fullName?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use backend registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          full_name: fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      // After successful registration, sign in the user
      return await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use backend login endpoint
      const response = await fetch('/api/auth/token', {
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
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Set the session manually using the token from backend
      const { data: sessionData, error } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      setError(error.message || 'Login failed');
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
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setUserProgress(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setUserProgress(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!session) return;
    await loadUserData(session);
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    session,
    userProfile,
    userProgress,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};