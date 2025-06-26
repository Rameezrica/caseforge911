import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USER_TOKEN_KEY = 'userToken';

// --- TypeScript Interfaces for User Authentication ---
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  created_at: string;
  solved_problems: string[];
  total_score: number;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserProgress {
  total_problems_solved: number;
  total_score: number;
  current_streak: number;
  longest_streak: number;
  problems_by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  recent_activity: Array<{
    problem_id: string;
    problem_title: string;
    solved_at: string;
    score?: number;
  }>;
}

export interface Solution {
  id: string;
  problem_id: string;
  user_id: string;
  content: string;
  submitted_at: string;
  score?: number;
}

// --- User Authentication Functions ---
export const registerUser = async (userData: UserCreate): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Registration failed');
  }
};

export const loginUser = async (credentials: UserLogin): Promise<AuthTokenResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await axios.post(`${API_BASE_URL}/auth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Login failed');
  }
};

// --- Axios Client for Authenticated User Requests ---
const userApiClient = axios.create({
  baseURL: API_BASE_URL,
});

userApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(USER_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(USER_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- User Profile and Progress Functions ---
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await userApiClient.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get current user');
  }
};

export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const response = await userApiClient.get('/user/progress');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get user progress');
  }
};

export const getUserSolutions = async (): Promise<Solution[]> => {
  try {
    const response = await userApiClient.get('/user/solutions');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get user solutions');
  }
};

export const submitSolutionAuth = async (problemId: string, content: string): Promise<any> => {
  try {
    const response = await userApiClient.post('/solutions', {
      problem_id: problemId,
      content,
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to submit solution');
  }
};

// --- Helper Functions ---
export const getStoredToken = (): string | null => {
  return localStorage.getItem(USER_TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(USER_TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(USER_TOKEN_KEY);
};

export const isTokenValid = (): boolean => {
  const token = getStoredToken();
  if (!token) return false;
  
  try {
    // Basic JWT validation - check if token is expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};