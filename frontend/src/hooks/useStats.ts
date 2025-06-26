import { apiService } from '../services/api';
import { useApiWithFallback } from './useApiWithFallback';

const mockStats = {
  total_problems: 150,
  total_solutions: 1250,
  total_users: 850,
  difficulty_distribution: {
    'Easy': 45,
    'Medium': 65,
    'Hard': 40
  }
};

export const useStats = () => {
  const result = useApiWithFallback(
    () => apiService.getStats(),
    mockStats
  );

  return {
    stats: result.data,
    loading: result.loading,
    error: result.error,
    isServerOnline: result.isServerOnline,
    retry: result.retry
  };
};