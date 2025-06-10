import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  UserCreate, 
  UserLogin, 
  UserProgress,
  registerUser, 
  loginUser, 
  getCurrentUser, 
  getUserProgress,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  isTokenValid
} from '../services/userApi';

interface AuthContextType {
  user: User | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserLogin) => Promise<boolean>;
  register: (userData: UserCreate) => Promise<boolean>;
  logout: () => void;
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
      const token = getStoredToken();
      
      if (token && isTokenValid()) {
        await loadUserData();
      } else {
        removeStoredToken();
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      removeStoredToken();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const [userData, progressData] = await Promise.all([
        getCurrentUser(),
        getUserProgress().catch(() => null) // Progress might not be available for new users
      ]);
      
      setUser(userData);
      setUserProgress(progressData);
      setIsAuthenticated(true);
      setError(null);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to load user data');
    }
  };

  const refreshUserData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const [userData, progressData] = await Promise.all([
        getCurrentUser(),
        getUserProgress().catch(() => null)
      ]);
      
      setUser(userData);
      setUserProgress(progressData);
    } catch (error: any) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const login = async (credentials: UserLogin): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const tokenResponse = await loginUser(credentials);
      setStoredToken(tokenResponse.access_token);
      
      await loadUserData();
      return true;
    } catch (error: any) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserCreate): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newUser = await registerUser(userData);
      
      // Auto-login after registration
      const loginSuccess = await login({
        username: userData.username,
        password: userData.password,
      });
      
      return loginSuccess;
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setUserProgress(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    userProgress,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};