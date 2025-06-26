import { useAuth } from '../context/AuthContext';

// Re-export the auth hook for consistency
export const useUserAuth = () => {
  return useAuth();
};