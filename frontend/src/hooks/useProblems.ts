import { apiService } from '../services/api';
import { useApiWithFallback } from './useApiWithFallback';
import { problems as mockProblems } from '../data/mockData';
import { Problem } from '../types';

export const useProblems = (filters?: {
  domain?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
}) => {
  const result = useApiWithFallback(
    () => apiService.getProblems(filters),
    mockProblems,
    [filters?.domain, filters?.difficulty, filters?.category, filters?.limit]
  );

  return {
    problems: result.data || [],
    loading: result.loading,
    error: result.error,
    isServerOnline: result.isServerOnline,
    retry: result.retry
  };
};

export const useProblem = (id: string) => {
  const mockProblem = mockProblems.find(p => p.id === id);
  
  const result = useApiWithFallback(
    () => apiService.getProblem(id),
    mockProblem,
    [id]
  );

  return {
    problem: result.data,
    loading: result.loading,
    error: result.error,
    isServerOnline: result.isServerOnline,
    retry: result.retry
  };
};