import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export interface CategoryInfo {
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

// API Functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Problems
  async getProblems(filters?: {
    domain?: string;
    difficulty?: string;
    category?: string;
    limit?: number;
  }) {
    const response = await api.get('/problems', { params: filters });
    return response.data as Problem[];
  },

  async getProblem(id: string) {
    const response = await api.get(`/problems/${id}`);
    return response.data as Problem;
  },

  // Categories and domains
  async getCategories() {
    const response = await api.get('/categories');
    return response.data as CategoryInfo[];
  },

  // Platform statistics
  async getStats() {
    const response = await api.get('/stats');
    return response.data as PlatformStats;
  },

  // Daily challenge
  async getDailyChallenge() {
    const response = await api.get('/daily-challenge');
    return response.data as DailyChallenge;
  },

  // Submit solution
  async submitSolution(problemId: string, content: string, userId?: string) {
    const response = await api.post('/solutions', {
      problem_id: problemId,
      content,
      user_id: userId || 'anonymous'
    });
    return response.data;
  }
};

export default api;