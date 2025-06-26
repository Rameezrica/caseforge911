import { apiService } from '../services/api';
import { useApiWithFallback } from './useApiWithFallback';
import { dailyChallenge as mockDailyChallenge } from '../data/mockData';

export const useDailyChallenge = () => {
  const result = useApiWithFallback(
    () => apiService.getDailyChallenge(),
    mockDailyChallenge
  );

  return {
    challenge: result.data,
    loading: result.loading,
    error: result.error,
    isServerOnline: result.isServerOnline,
    retry: result.retry
  };
};