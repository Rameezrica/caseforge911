import { useState, useEffect } from 'react';
import { apiService, Problem } from '../services/api';

export const useProblems = (filters?: {
  domain?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProblems(filters);
        setProblems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch problems');
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [filters?.domain, filters?.difficulty, filters?.category, filters?.limit]);

  return { problems, loading, error, refetch: () => window.location.reload() };
};

export const useProblem = (id: string) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProblem(id);
        setProblem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch problem');
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  return { problem, loading, error };
};