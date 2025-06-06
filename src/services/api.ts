import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

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
  domain_distribution?: Record<string, number>;
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
  domain?: string;
}

export interface Domain {
  name: string;
  color: string;
  categories: string[];
  skills: string[];
  levels: Record<number, { title: string; xp_required: number }>;
  problem_count: number;
}

export interface DomainStats {
  domain: string;
  total_problems: number;
  total_solutions: number;
  difficulty_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
  domain_info: {
    color: string;
    categories: string[];
    skills: string[];
    levels: Record<number, { title: string; xp_required: number }>;
  };
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  level: number;
  level_title: string;
  total_score: number;
  problems_solved: number;
  domain_xp: number;
  streak: number;
  last_active: string;
}

export interface DomainLeaderboard {
  domain: string;
  leaderboard: LeaderboardEntry[];
  total_participants: number;
}

export interface LearningPath {
  id: string;
  domain: string;
  title: string;
  description: string;
  level: string;
  problems: string[];
  estimated_duration: number;
  skills_covered: string[];
  created_at: string;
}

export interface DomainProgress {
  user_id: string;
  domain: string;
  level: number;
  experience_points: number;
  problems_solved: number;
  average_score: number;
  time_spent: number;
  streak: number;
  last_activity: string;
  skills_unlocked: string[];
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  replies: number;
  created_at: string;
  domain: string;
  tags: string[];
}

// API Functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Domains
  async getDomains() {
    const response = await api.get('/domains');
    return response.data as Domain[];
  },

  async getDomainStats(domain: string) {
    const response = await api.get(`/domains/${domain}/stats`);
    return response.data as DomainStats;
  },

  async getDomainLeaderboard(domain: string, limit: number = 50) {
    const response = await api.get(`/domains/${domain}/leaderboard?limit=${limit}`);
    return response.data as DomainLeaderboard;
  },

  async getDomainLearningPaths(domain: string) {
    const response = await api.get(`/domains/${domain}/learning-paths`);
    return response.data as LearningPath[];
  },

  async getDomainDiscussions(domain: string, limit: number = 20) {
    const response = await api.get(`/domains/${domain}/discussions?limit=${limit}`);
    return response.data as Discussion[];
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

  async getDomainDailyChallenge(domain: string) {
    const response = await api.get(`/daily-challenge/${domain}`);
    return response.data as DailyChallenge;
  },

  // User progress and preferences
  async setUserPreferences(userId: string, preferences: any) {
    const response = await api.post(`/users/${userId}/preferences`, preferences);
    return response.data;
  },

  async getUserDomainProgress(userId: string, domain?: string) {
    const url = domain 
      ? `/users/${userId}/domain-progress/${domain}`
      : `/users/${userId}/domain-progress`;
    const response = await api.get(url);
    return response.data as DomainProgress | DomainProgress[];
  },

  // Submit solution
  async submitSolution(problemId: string, content: string, userId?: string, score?: number, timeTaken?: number) {
    const response = await api.post('/solutions', {
      problem_id: problemId,
      content,
      user_id: userId || 'anonymous',
      score,
      time_taken: timeTaken
    });
    return response.data;
  }
};

export default api;