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

// Check if we're in fallback mode based on environment
const FALLBACK_MODE = import.meta.env.VITE_FALLBACK_MODE === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

// Local session type for fallback mode
interface LocalSession {
  access_token: string;
  refresh_token: string;
  user: FallbackUser;
  expires_at?: number;
}

export interface AuthContextType {
  user: User | FallbackUser | null;
  session: any | LocalSession | null;
  userProfile: UserProfile | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Add alias for signOut
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
  const [user, setUser] = useState<User | FallbackUser | null>(null);
  const [session, setSession] = useState<any | LocalSession | null>(null);
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
      
      if (FALLBACK_MODE) {
        // In fallback mode, check for stored session
        const storedToken = localStorage.getItem('caseforge_access_token');
        const storedUser = localStorage.getItem('caseforge_user');
        
        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const localSession: LocalSession = {
              access_token: storedToken,
              refresh_token: localStorage.getItem('caseforge_refresh_token') || storedToken,
              user: userData
            };
            
            // Verify token with backend
            const isValid = await validateTokenWithBackend(storedToken);
            if (isValid) {
              setSession(localSession);
              setUser(userData);
              setIsAuthenticated(true);
              await loadUserData(localSession);
            } else {
              // Token invalid, clear storage
              clearLocalStorage();
            }
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            clearLocalStorage();
          }
        }
      } else {
        // Use Firebase authentication
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('Firebase auth state changed:', firebaseUser?.email);
          
          if (firebaseUser) {
            // Get Firebase ID token
            const idToken = await firebaseUser.getIdToken();
            
            // Store token for API calls
            localStorage.setItem('firebase_id_token', idToken);
            
            setUser(firebaseUser);
            setSession({ user: firebaseUser, idToken });
            setIsAuthenticated(true);
            
            // Load user data from backend
            await loadUserDataWithFirebaseToken(idToken);
          } else {
            // User signed out
            localStorage.removeItem('firebase_id_token');
            setUser(null);
            setSession(null);
            setIsAuthenticated(false);
            setUserProfile(null);
            setUserProgress(null);
          }
        });

        return () => unsubscribe();
      }
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      setError(error.message || 'Authentication initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const validateTokenWithBackend = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('caseforge_access_token');
    localStorage.removeItem('caseforge_refresh_token');
    localStorage.removeItem('caseforge_user');
    localStorage.removeItem('firebase_id_token');
  };

  const loadUserData = async (session: LocalSession) => {
    try {
      const token = session.access_token;
      
      // Get user profile from backend
      const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserProfile(profile);
      }

      // Get user progress from backend
      const progressResponse = await fetch(`${API_BASE_URL}/user/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const loadUserDataWithFirebaseToken = async (idToken: string) => {
    try {
      // Get user profile from backend using Firebase token
      const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserProfile(profile);
      }

      // Get user progress from backend
      const progressResponse = await fetch(`${API_BASE_URL}/user/progress`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (progressResponse.ok) {
        const progress = await progressResponse.json();
        setUserProgress(progress);
      }
    } catch (error: any) {
      console.error('Failed to load user data with Firebase token:', error);
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

      if (FALLBACK_MODE) {
        // Use backend registration endpoint
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
      } else {
        // Use Firebase authentication
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update the user's display name
        if (userCredential.user && (fullName || username)) {
          await updateProfile(userCredential.user, {
            displayName: fullName || username
          });
        }

        // The onAuthStateChanged listener will handle the rest
        return true;
      }
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

      if (FALLBACK_MODE) {
        // Use backend login endpoint
        const response = await fetch(`${API_BASE_URL}/auth/token`, {
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
        
        // Store tokens locally and create local session
        const userData: FallbackUser = {
          id: data.user.id,
          email: data.user.email,
          user_metadata: {
            username: data.user.username,
            full_name: data.user.full_name
          },
          created_at: new Date().toISOString()
        };

        const localSession: LocalSession = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: userData
        };

        // Store in localStorage
        localStorage.setItem('caseforge_access_token', data.access_token);
        localStorage.setItem('caseforge_refresh_token', data.refresh_token);
        localStorage.setItem('caseforge_user', JSON.stringify(userData));

        // Update state
        setSession(localSession);
        setUser(userData);
        setIsAuthenticated(true);
        await loadUserData(localSession);

        return true;
      } else {
        // Use Firebase authentication
        await signInWithEmailAndPassword(auth, email, password);
        // The onAuthStateChanged listener will handle the rest
        return true;
      }
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
      
      if (FALLBACK_MODE) {
        // In fallback mode, clear local storage and state
        clearLocalStorage();
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setUserProgress(null);
        setIsAuthenticated(false);
      } else {
        // Use Firebase sign out
        await firebaseSignOut(auth);
        // The onAuthStateChanged listener will handle clearing state
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      clearLocalStorage();
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setUserProgress(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!session) return;
    
    if (FALLBACK_MODE) {
      await loadUserData(session as LocalSession);
    } else {
      const idToken = localStorage.getItem('firebase_id_token');
      if (idToken) {
        await loadUserDataWithFirebaseToken(idToken);
      }
    }
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
    logout: signOut, // Add alias
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};