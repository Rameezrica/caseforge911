import { useState, useEffect } from 'react';
import { apiService, DailyChallenge } from '../services/api';

export const useDailyChallenge = () => {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getDailyChallenge();
        setChallenge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch daily challenge');
        console.error('Error fetching daily challenge:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, []);

  return { challenge, loading, error };
};