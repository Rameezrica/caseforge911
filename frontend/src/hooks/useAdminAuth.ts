import { useAdminAuth as useAdminAuthContext } from '../context/AdminAuthContext';

// Re-export the admin auth hook for consistency
export const useAdminAuth = () => {
  return useAdminAuthContext();
};