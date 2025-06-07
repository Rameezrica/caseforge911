import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout: The server took too long to respond.');
    }
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 404:
          throw new Error(`Resource not found: ${message}`);
        case 500:
          throw new Error(`Server error: ${message}`);
        default:
          throw new Error(`API error (${status}): ${message}`);
      }
    }
    
    throw new Error(`Unknown error: ${error.message}`);
  }
);

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
  company?: string;
  time_limit?: number;
  sample_framework?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformStats {
  total_problems: number;
  total_solutions: number;
  total_users: number;
  difficulty_distribution: Record<string, number>;
}

interface CategoryInfo {
  domain: string;
  categories: string[];
  problem_count: number;
}

export interface DailyChallenge {
  problem: Problem;
  date: string;
  participants: number;
  completion_rate: number;
}

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.warn('Server health check failed:', error);
    return false;
  }
};

export const apiService = {
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  async getProblems(filters?: {
    domain?: string;
    difficulty?: string;
    category?: string;
    limit?: number;
  }) {
    try {
      const response = await api.get('/problems', { params: filters });
      return response.data as Problem[];
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      throw error;
    }
  },

  async getProblem(id: string) {
    try {
      const response = await api.get(`/problems/${id}`);
      return response.data as Problem;
    } catch (error) {
      console.error(`Failed to fetch problem ${id}:`, error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data as CategoryInfo[];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const response = await api.get('/stats');
      return response.data as PlatformStats;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  },

  async getDailyChallenge() {
    try {
      const response = await api.get('/daily-challenge');
      return response.data as DailyChallenge;
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
      throw error;
    }
  },

  async submitSolution(problemId: string, content: string, userId?: string) {
    try {
      const response = await api.post('/solutions', {
        problem_id: problemId,
        content,
        user_id: userId || 'anonymous'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit solution:', error);
      throw error;
    }
  }
};