import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  problemsSolved: number;
  currentStreak: number;
  achievements: string[];
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  
  // Problem solving state
  currentProblem: string | null;
  solvedProblems: string[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setCurrentProblem: (problemId: string | null) => void;
  markProblemSolved: (problemId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      sidebarCollapsed: false,
      theme: 'dark',
      currentProblem: null,
      solvedProblems: [],

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        currentProblem: null 
      }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      setCurrentProblem: (problemId) => set({ currentProblem: problemId }),
      
      markProblemSolved: (problemId) => set((state) => {
        if (!state.solvedProblems.includes(problemId)) {
          return {
            solvedProblems: [...state.solvedProblems, problemId],
            user: state.user ? {
              ...state.user,
              problemsSolved: state.user.problemsSolved + 1
            } : null
          };
        }
        return state;
      }),
    }),
    {
      name: 'caseforge-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        solvedProblems: state.solvedProblems,
      }),
    }
  )
);