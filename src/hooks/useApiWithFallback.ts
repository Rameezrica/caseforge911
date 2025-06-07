import { useState, useEffect } from 'react';
import { apiService, checkServerHealth } from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isServerOnline: boolean;
}

export function useApiWithFallback<T>(
  apiCall: () => Promise<T>,
  fallbackData?: T,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: fallbackData || null,
    loading: true,
    error: null,
    isServerOnline: true
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Check server health first
        const isOnline = await checkServerHealth();
        
        if (!isOnline) {
          if (isMounted) {
            setState({
              data: fallbackData || null,
              loading: false,
              error: 'Server is offline. Using cached data.',
              isServerOnline: false
            });
          }
          return;
        }

        // Server is online, fetch real data
        const data = await apiCall();
        
        if (isMounted) {
          setState({
            data,
            loading: false,
            error: null,
            isServerOnline: true
          });
        }
      } catch (error) {
        console.error('API call failed:', error);
        
        if (isMounted) {
          setState({
            data: fallbackData || null,
            loading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isServerOnline: false
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const retry = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    // Trigger re-fetch by updating a dependency
  };

  return { ...state, retry };
}