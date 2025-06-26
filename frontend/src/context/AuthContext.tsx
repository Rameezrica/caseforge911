import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Hardcoded configuration
const API_BASE_URL = '/api';
const ADMIN_EMAIL = 'rameezuddinmohammed61@gmail.com';

// Types
export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string;
  is_admin: boolean;
  created_at: string;
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

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Firebase auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email);
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          console.log('User authenticated, getting ID token...');
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          console.log('Got Firebase ID token');
          
          // Store token for API calls
          localStorage.setItem('firebase_id_token', idToken);
          
          setUser(firebaseUser);
          setIsAuthenticated(true);
          
          // Load user data from backend
          await loadUserDataWithFirebaseToken(idToken);
        } catch (error) {
          console.error('Error processing authenticated user:', error);
          setError('Failed to load user profile');
        }
      } else {
        // User signed out
        console.log('User signed out');
        localStorage.removeItem('firebase_id_token');
        setUser(null);
        setIsAuthenticated(false);
        setUserProfile(null);
        setUserProgress(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserDataWithFirebaseToken = async (idToken: string) => {
    try {
      console.log('Loading user profile from backend...');
      // Get user profile from backend using Firebase token
      const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        console.log('User profile loaded:', profile);
        setUserProfile(profile);
      } else {
        console.error('Failed to load user profile:', profileResponse.status, await profileResponse.text());
      }

      console.log('Loading user progress from backend...');
      // Get user progress from backend
      const progressResponse = await fetch(`${API_BASE_URL}/user/progress`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (progressResponse.ok) {
        const progress = await progressResponse.json();
        console.log('User progress loaded:', progress);
        setUserProgress(progress);
      } else {
        console.error('Failed to load user progress:', progressResponse.status, await progressResponse.text());
      }
    } catch (error: any) {
      console.error('Failed to load user data with Firebase token:', error);
      setError('Failed to load user data');
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
      console.log('Signing up user:', email);

      // Create user with Firebase
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created:', userCredential.user.uid);
      
      // Update the user's display name
      if (userCredential.user && (fullName || username)) {
        await updateProfile(userCredential.user, {
          displayName: fullName || username
        });
        console.log('User display name updated');
      }

      // The onAuthStateChanged listener will handle the rest
      return true;
    } catch (error: any) {
      console.error('Sign up error:', error);
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
      console.log('Signing in user:', email);

      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase sign in successful');
      
      // The onAuthStateChanged listener will handle the rest
      return true;
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      console.log('Signing out user...');
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear local storage
      localStorage.removeItem('firebase_id_token');
      
      // The onAuthStateChanged listener will handle clearing state
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      localStorage.removeItem('firebase_id_token');
      setUser(null);
      setUserProfile(null);
      setUserProgress(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('Refreshing user data...');
      const idToken = await user.getIdToken(true); // Force refresh
      localStorage.setItem('firebase_id_token', idToken);
      await loadUserDataWithFirebaseToken(idToken);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    userProfile,
    userProgress,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    logout: signOut,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};