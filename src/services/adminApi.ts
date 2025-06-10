import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_TOKEN_KEY = 'adminToken'; // Consistent with useAdminAuth

// --- TypeScript Interfaces for Problem Data ---
// Mirroring Pydantic models from backend/admin_router.py and backend/server.py

export interface Problem {
  id: string;
  title: str;
  description: str;
  difficulty: string; // "Easy", "Medium", "Hard"
  category: string;
  domain: string;
  company?: string;
  time_limit?: number; // in minutes
  sample_framework?: string;
  created_at: string; // Store as string, can be converted to Date object if needed
  updated_at: string; // Store as string
}

export interface ProblemCreate { // For creating new problems
  title: str;
  description: str;
  difficulty: string;
  category: string;
  domain: string;
  company?: string;
  time_limit?: number;
  sample_framework?: string;
}

export interface ProblemUpdate { // For updating existing problems, all fields optional
  title?: string;
  description?: string;
  difficulty?: string;
  category?: string;
  domain?: string;
  company?: string;
  time_limit?: number;
  sample_framework?: string;
  // updated_at is handled by backend
}


// --- Auth Token Response ---
export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

// --- Login Function (remains as before, but separate from adminApiClient) ---
export const loginAdmin = async (username, password): Promise<AuthTokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${BASE_URL}/auth/token`, { // Uses /api/auth/token
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(errorData.detail || 'Failed to login');
  }
  return response.json() as Promise<AuthTokenResponse>;
};


// --- Axios API Client for Authenticated Admin Requests ---
const adminApiClient = axios.create({
  baseURL: `${BASE_URL}/admin`, // All admin routes are prefixed with /api/admin
});

adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Optionally handle missing token, e.g., redirect to login
      // This might be better handled by UI components using useAdminAuth
      console.warn('Admin token not found in localStorage.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Problem CRUD Functions ---

export const getProblems = async (skip: number = 0, limit: number = 100): Promise<Problem[]> => {
  try {
    const response = await adminApiClient.get('/problems', { params: { skip, limit } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    throw error; // Rethrow for the component to handle
  }
};

export const getProblem = async (problemId: string): Promise<Problem> => {
  try {
    const response = await adminApiClient.get(`/problems/${problemId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch problem ${problemId}:`, error);
    throw error;
  }
};

export const createProblem = async (problemData: ProblemCreate): Promise<Problem> => {
  try {
    const response = await adminApiClient.post('/problems', problemData);
    return response.data;
  } catch (error) {
    console.error('Failed to create problem:', error);
    throw error;
  }
};

export const updateProblem = async (problemId: string, problemData: ProblemUpdate): Promise<Problem> => {
  try {
    const response = await adminApiClient.put(`/problems/${problemId}`, problemData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update problem ${problemId}:`, error);
    throw error;
  }
};

export const deleteProblem = async (problemId: string): Promise<void> => {
  try {
    await adminApiClient.delete(`/problems/${problemId}`);
  } catch (error) {
    console.error(`Failed to delete problem ${problemId}:`, error);
    throw error;
  }
};

// --- TypeScript Interfaces for Competition Data ---
// Mirroring Pydantic models from backend
export interface Competition {
  id: string;
  name: string;
  description: string;
  start_date: string; // ISO datetime string
  end_date: string;   // ISO datetime string
  problem_ids: string[];
  is_active: boolean;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface CompetitionCreate {
  name: string;
  description: string;
  start_date: string; // ISO datetime string
  end_date: string;   // ISO datetime string
  problem_ids?: string[]; // Optional, default to empty list on backend if not provided
  is_active?: boolean;    // Optional, default to false on backend
}

export interface CompetitionUpdate {
  name?: string;
  description?: string;
  start_date?: string; // ISO datetime string
  end_date?: string;   // ISO datetime string
  problem_ids?: string[];
  is_active?: boolean;
  // updated_at is handled by backend
}

// --- Competition CRUD Functions ---

export const getCompetitions = async (skip: number = 0, limit: number = 100): Promise<Competition[]> => {
  try {
    const response = await adminApiClient.get('/competitions', { params: { skip, limit } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch competitions:', error);
    throw error;
  }
};

export const getCompetition = async (competitionId: string): Promise<Competition> => {
  try {
    const response = await adminApiClient.get(`/competitions/${competitionId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch competition ${competitionId}:`, error);
    throw error;
  }
};

export const createCompetition = async (competitionData: CompetitionCreate): Promise<Competition> => {
  try {
    const response = await adminApiClient.post('/competitions', competitionData);
    return response.data;
  } catch (error) {
    console.error('Failed to create competition:', error);
    throw error;
  }
};

export const updateCompetition = async (competitionId: string, competitionData: CompetitionUpdate): Promise<Competition> => {
  try {
    const response = await adminApiClient.put(`/competitions/${competitionId}`, competitionData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update competition ${competitionId}:`, error);
    throw error;
  }
};

export const deleteCompetition = async (competitionId: string): Promise<void> => {
  try {
    await adminApiClient.delete(`/competitions/${competitionId}`);
  } catch (error) {
    console.error(`Failed to delete competition ${competitionId}:`, error);
    throw error;
  }
};
