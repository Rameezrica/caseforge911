import axios, { AxiosError } from 'axios';

// Try multiple possible API URLs for WebContainer compatibility
const possibleApiUrls = [
  import.meta.env.VITE_API_BASE_URL || '/api',
  'http://localhost:8001/api',
  '/api'
];

let API_BASE_URL = possibleApiUrls[0];

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to test API connectivity and switch URLs if needed
const testApiConnectivity = async () => {
  for (const url of possibleApiUrls) {
    try {
      const testApi = axios.create({
        baseURL: url,
        timeout: 5000,
      });
      await testApi.get('/health');
      console.log(`✅ API accessible at: ${url}`);
      API_BASE_URL = url;
      api.defaults.baseURL = url;
      return true;
    } catch (error) {
      console.log(`❌ API not accessible at: ${url}`);
    }
  }
  return false;
};

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Add authentication headers
    const firebaseToken = localStorage.getItem('firebase_id_token');
    const userToken = localStorage.getItem('caseforge_access_token');
    const adminToken = localStorage.getItem('caseforge_admin_access_token');
    
    // Prioritize admin token for admin routes
    if (config.url?.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (firebaseToken) {
      // Use Firebase ID token for authentication
      config.headers.Authorization = `Bearer ${firebaseToken}`;
    } else if (userToken) {
      // Fallback to old token system
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ API Response Error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.log('🔄 Network error detected, trying to find working API URL...');
      const connected = await testApiConnectivity();
      if (connected) {
        console.log('🔄 Retrying request with new API URL...');
        // Retry the original request with the new URL
        return api.request(error.config!);
      }
      throw new Error('❌ Unable to connect to the backend server. Please ensure the backend is running on port 8001.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('⏱️ Request timeout: The server took too long to respond.');
    }
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 404:
          throw new Error(`🔍 Resource not found: ${message}`);
        case 500:
          throw new Error(`🚨 Server error: ${message}`);
        default:
          throw new Error(`⚠️ API error (${status}): ${message}`);
      }
    }
    
    throw new Error(`❓ Unknown error: ${error.message}`);
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
    console.warn('❌ Server health check failed:', error);
    // Try to find a working API URL
    const connected = await testApiConnectivity();
    return connected;
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
  },

  // Admin endpoints
  async getAdminDashboard() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin dashboard:', error);
      throw error;
    }
  },

  async getAdminUsers(page = 1, limit = 50) {
    try {
      const response = await api.get('/admin/users', { params: { page, limit } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      throw error;
    }
  },

  async getAdminProblems() {
    try {
      const response = await api.get('/admin/problems');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin problems:', error);
      throw error;
    }
  },

  async createAdminProblem(problemData: any) {
    try {
      const response = await api.post('/admin/problems', problemData);
      return response.data;
    } catch (error) {
      console.error('Failed to create problem:', error);
      throw error;
    }
  },

  async updateAdminProblem(problemId: string, problemData: any) {
    try {
      const response = await api.put(`/admin/problems/${problemId}`, problemData);
      return response.data;
    } catch (error) {
      console.error('Failed to update problem:', error);
      throw error;
    }
  },

  async deleteAdminProblem(problemId: string) {
    try {
      const response = await api.delete(`/admin/problems/${problemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete problem:', error);
      throw error;
    }
  }
};

// Initialize connectivity test on module load
testApiConnectivity().then(connected => {
  if (connected) {
    console.log('🚀 API connectivity established');
  } else {
    console.warn('⚠️ No API connectivity found');
  }
});