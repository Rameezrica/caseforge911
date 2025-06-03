import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Solution, Comment } from '../types';

interface Store {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Voting state
  votes: Record<string, 'up' | 'down' | null>;
  setVote: (id: string, vote: 'up' | 'down' | null) => void;
  
  // Comments state
  comments: Record<string, Comment[]>;
  addComment: (parentId: string, comment: Comment) => void;
  
  // Solutions state
  solutions: Record<string, Solution[]>;
  addSolution: (problemId: string, solution: Solution) => void;
  
  // Study plan progress
  studyPlanProgress: Record<string, number>;
  updateStudyPlanProgress: (planId: string, progress: number) => void;
  
  // Daily challenge state
  lastDailyChallenge: string | null;
  updateDailyChallenge: (date: string) => void;
  dailyStreak: number;
  updateDailyStreak: (streak: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Voting state
      votes: {},
      setVote: (id, vote) => set((state) => ({
        votes: { ...state.votes, [id]: vote }
      })),
      
      // Comments state
      comments: {},
      addComment: (parentId, comment) => set((state) => ({
        comments: {
          ...state.comments,
          [parentId]: [...(state.comments[parentId] || []), comment]
        }
      })),
      
      // Solutions state
      solutions: {},
      addSolution: (problemId, solution) => set((state) => ({
        solutions: {
          ...state.solutions,
          [problemId]: [...(state.solutions[problemId] || []), solution]
        }
      })),
      
      // Study plan progress
      studyPlanProgress: {},
      updateStudyPlanProgress: (planId, progress) => set((state) => ({
        studyPlanProgress: {
          ...state.studyPlanProgress,
          [planId]: progress
        }
      })),
      
      // Daily challenge state
      lastDailyChallenge: null,
      updateDailyChallenge: (date) => set({ lastDailyChallenge: date }),
      dailyStreak: 0,
      updateDailyStreak: (streak) => set({ dailyStreak: streak })
    }),
    {
      name: 'caseforge-storage'
    }
  )
);