// Common Types for CaseForge

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 
  | 'Strategy & Consulting'
  | 'Finance & Investment'
  | 'Operations & Supply Chain'
  | 'Marketing & Growth'
  | 'Entrepreneurship'
  | 'Data Analysis & Business Intelligence';

export interface User {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  isGoogleUser: boolean;
  problemsSolved: number;
  achievements: string[];
  stats: {
    totalProblems: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    accuracy: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  points: number;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyChallenge {
  _id: string;
  problemId: string;
  date: string;
  participants: number;
  averageScore: number;
}

export interface Solution {
  _id: string;
  problemId: string;
  userId: string;
  content: string;
  score?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  solutionId?: string;
  problemId?: string;
  content: string;
  createdAt: string;
  votes: number;
}